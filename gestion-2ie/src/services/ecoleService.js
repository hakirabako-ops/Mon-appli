const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const ECOLE_API_URL = `${API_BASE_URL}/api/ecoles`;

async function readResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!text) {
    return {};
  }

  if (contentType.includes('application/json')) {
    return JSON.parse(text);
  }

  return {
    message: `Le serveur a retourne une reponse non JSON (${response.status} ${response.statusText}).`,
    raw: text,
  };
}

export async function getEcoles() {
  const response = await fetch(ECOLE_API_URL);
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data.message || 'Impossible de charger les ecoles.');
  }

  return Array.isArray(data) ? data : [];
}

export async function createEcole(payload) {
  const response = await fetch(ECOLE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Impossible d'enregistrer l'ecole.");
  }

  return data;
}

export async function updateEcole(id, payload) {
  const response = await fetch(`${ECOLE_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Impossible de modifier l'ecole.");
  }

  return data;
}

export async function deleteEcole(id) {
  const response = await fetch(`${ECOLE_API_URL}/${id}`, {
    method: 'DELETE',
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Impossible de supprimer l'ecole.");
  }

  return data;
}

export const ecoleService = {
  async list() {
    return getEcoles();
  },
  async create(payload) {
    return createEcole(payload);
  },
  async update(id, payload) {
    return updateEcole(id, payload);
  },
  async remove(id) {
    return deleteEcole(id);
  },
};
