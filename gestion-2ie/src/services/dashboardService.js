const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Impossible de charger le tableau de bord.');
  }

  return data;
}

export const dashboardService = {
  getStats: () => request('stats'),
  getRecentActivities: () => request('activities'),
  getChartData: () => request('charts'),
  getAcademicYears: () => request('academic-years'),
  setActiveAcademicYear: (id) => request('active-year', { method: 'PATCH', body: JSON.stringify({ id }) }),
};
