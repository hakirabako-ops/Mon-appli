import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faPenToSquare,
  faTrash,
  faSort,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import Spinner from './Spinner';
import { displayValue } from '../utils/crudHelpers';

/**
 * Tableau de données avec :
 * - Tri par colonne (clic sur l'en-tête)
 * - Recherche
 * - Pagination (gérée en interne)
 */
export default function CrudDataTable({
  config,
  items,
  options,
  loading,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const searchEnabled = config.searchable === true;
  const paginationEnabled = Boolean(config.pagination?.enabled);
  const pageSize = Number(config.pagination?.pageSize) > 0 ? Number(config.pagination.pageSize) : 25;

  // Réinitialiser la page quand les données ou la recherche changent
  useEffect(() => { setPage(1); }, [items.length, search]);
  // Réinitialiser le tri quand on change de page CRUD
  useEffect(() => { setSortColumn(null); setSortDir('asc'); setPage(1); }, [config.title]);

  const sortedItems = useMemo(() => {
    if (!sortColumn) return items;
    return [...items].sort((a, b) => {
      const aVal = String(a[sortColumn] ?? '').toLowerCase();
      const bVal = String(b[sortColumn] ?? '').toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortColumn, sortDir]);

  const totalPages = paginationEnabled ? Math.max(1, Math.ceil(sortedItems.length / pageSize)) : 1;
  const safePage = Math.min(page, totalPages);
  const paginatedItems = paginationEnabled
    ? sortedItems.slice((safePage - 1) * pageSize, safePage * pageSize)
    : sortedItems;
  const pageStart = sortedItems.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const pageEnd = paginationEnabled ? Math.min(safePage * pageSize, sortedItems.length) : sortedItems.length;

  function handleSort(colName) {
    if (sortColumn === colName) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colName);
      setSortDir('asc');
    }
    setPage(1);
  }

  function SortIcon({ colName }) {
    if (sortColumn !== colName)
      return <FontAwesomeIcon icon={faSort} className="sort-icon sort-icon-inactive" />;
    return (
      <FontAwesomeIcon
        icon={sortDir === 'asc' ? faSortUp : faSortDown}
        className="sort-icon sort-icon-active"
      />
    );
  }

  return (
    <div className="table-card">
      <div className="table-card-header">
        <span className="table-card-title">{config.listTitle || 'Liste'}</span>
        <span className="badge-count">{sortedItems.length}</span>
      </div>

      {searchEnabled && (
        <div className="table-search">
          <input
            type="text"
            className="table-search-input"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <Spinner size="md" text="Chargement..." />
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="empty-state">
          {search && searchEnabled
            ? 'Aucun résultat trouvé.'
            : config.emptyText || 'Aucun élément enregistré pour le moment.'}
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              {config.columns.map((col) => (
                <th
                  key={col.name}
                  className={col.sortable !== false ? 'th-sortable' : ''}
                  onClick={col.sortable !== false ? () => handleSort(col.name) : undefined}
                >
                  <span className="th-content">
                    {col.label}
                    {col.sortable !== false && <SortIcon colName={col.name} />}
                  </span>
                </th>
              ))}
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => (
              <tr key={item.id}>
                {config.columns.map((col) => (
                  <td key={col.name}>{displayValue(item, col, options)}</td>
                ))}
                <td>
                  <div className="table-actions-cell">
                    <button
                      type="button"
                      className="btn-icon btn-icon-edit"
                      onClick={() => onEdit(item)}
                      title="Modifier"
                      aria-label="Modifier"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-icon-delete"
                      onClick={() => onDelete(item.id)}
                      title="Supprimer"
                      aria-label="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {paginationEnabled && sortedItems.length > 0 && (
        <div className="pagination-bar">
          <div className="pagination-info">
            {pageStart}–{pageEnd} sur {sortedItems.length}
          </div>
          <div className="pagination-controls">
            <button
              type="button"
              className="btn-secondary pagination-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Page précédente"
            >
              <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
            </button>
            <span className="pagination-current">Page {safePage} / {totalPages}</span>
            <button
              type="button"
              className="btn-secondary pagination-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Page suivante"
            >
              <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
