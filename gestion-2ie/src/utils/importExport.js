import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Export items to CSV
 * @param {Array} items - Data to export
 * @param {Array} columns - Column configuration
 * @param {string} fileName - File name without extension
 */
export function exportToCSV(items, columns, fileName = 'export') {
  if (!items || items.length === 0) {
    throw new Error('Aucune donnée à exporter.');
  }

  const headers = columns.map(col => col.label);
  const data = items.map(item =>
    columns.map(col => item[col.name] ?? '')
  );

  const csv = Papa.unparse({
    fields: headers,
    data: data,
  });

  downloadFile(csv, `${fileName}.csv`, 'text/csv');
}

/**
 * Export items to Excel
 * @param {Array} items - Data to export
 * @param {Array} columns - Column configuration
 * @param {string} fileName - File name without extension
 */
export function exportToExcel(items, columns, fileName = 'export') {
  if (!items || items.length === 0) {
    throw new Error('Aucune donnée à exporter.');
  }

  const headers = columns.map(col => col.label);
  const data = items.map(item =>
    columns.map(col => item[col.name] ?? '')
  );

  const sheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
  sheet['!cols'] = columns.map(() => ({ wch: 15 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Data');

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * Import items from CSV
 * @param {File} file - CSV file
 * @param {Array} fields - Field configuration
 * @returns {Promise<Array>} Imported items
 */
export function importFromCSV(file, fields) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const items = results.data.map(row => {
            const item = {};
            fields.forEach(field => {
              const label = field.label;
              if (row[label] !== undefined) {
                item[field.name] = normalizeImportValue(field, row[label]);
              }
            });
            return item;
          });

          resolve(items.filter(item => Object.keys(item).length > 0));
        } catch (err) {
          reject(new Error(`Erreur lors de l'import: ${err.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`Erreur CSV: ${error.message}`));
      },
    });
  });
}

/**
 * Import items from Excel
 * @param {File} file - Excel file
 * @param {Array} fields - Field configuration
 * @returns {Promise<Array>} Imported items
 */
export function importFromExcel(file, fields) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const items = data.map(row => {
          const item = {};
          fields.forEach(field => {
            const label = field.label;
            if (row[label] !== undefined) {
              item[field.name] = normalizeImportValue(field, row[label]);
            }
          });
          return item;
        });

        resolve(items.filter(item => Object.keys(item).length > 0));
      } catch (err) {
        reject(new Error(`Erreur lors de l'import: ${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier.'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Normalize imported value based on field type
 */
function normalizeImportValue(field, value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const strValue = String(value).trim();

  if (field.type === 'number') {
    const num = parseFloat(strValue);
    return isNaN(num) ? '' : num;
  }

  if (field.type === 'checkbox') {
    return ['true', '1', 'oui', 'yes'].includes(strValue.toLowerCase());
  }

  if (field.type === 'date') {
    const date = new Date(strValue);
    return isNaN(date.getTime()) ? '' : strValue;
  }

  return strValue;
}

/**
 * Helper to download a file
 */
function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
