const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

export function createCrudService(path, label) {
  const url = `${API_BASE_URL}/api/${path}`;

  async function request(endpoint = '', options = {}) {
    const response = await fetch(`${url}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data.message || `Operation impossible pour ${label}.`);
    }

    return data;
  }

  return {
    async list() {
      const data = await request();
      return Array.isArray(data) ? data : [];
    },
    async create(payload) {
      return request('', { method: 'POST', body: JSON.stringify(payload) });
    },
    async update(id, payload) {
      return request(`/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    },
    async remove(id) {
      return request(`/${id}`, { method: 'DELETE' });
    },
    async findByField(field, value) {
      const data = await request();
      return Array.isArray(data) ? data.filter(item => String(item[field]) === String(value)) : [];
    },
  };
}
  