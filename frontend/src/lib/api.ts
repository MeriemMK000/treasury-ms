import axios from 'axios';

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('treasury_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('treasury_token');
      localStorage.removeItem('treasury_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
};

// Banks
export const banksApi = {
  list: () => api.get('/banks'),
  get: (id: string) => api.get(`/banks/${id}`),
  create: (data: any) => api.post('/banks', data),
  update: (id: string, data: any) => api.put(`/banks/${id}`, data),
  listAccounts: (params?: any) => api.get('/banks/accounts/all', { params }),
  getAccount: (id: string) => api.get(`/banks/accounts/${id}`),
  createAccount: (data: any) => api.post('/banks/accounts', data),
  getConsolidated: () => api.get('/banks/consolidated/balance'),
  createAgency: (data: any) => api.post('/banks/agencies', data),
};

// Operations
export const operationsApi = {
  list: (params?: any) => api.get('/operations', { params }),
  get: (id: string) => api.get(`/operations/${id}`),
  create: (data: any) => api.post('/operations', data),
  update: (id: string, data: any) => api.put(`/operations/${id}`, data),
  position: (id: string) => api.post(`/operations/${id}/position`),
  cashPosition: (params?: any) => api.get('/operations/cash-position', { params }),
  byPeriod: (params: any) => api.get('/operations/by-period', { params }),
  createFee: (data: any) => api.post('/operations/fees', data),
  listFees: (params?: any) => api.get('/operations/fees/all', { params }),
  feesSummary: () => api.get('/operations/fees/summary'),
};

// Payment Workflow
export const paymentApi = {
  list: (params?: any) => api.get('/payment-requests', { params }),
  get: (id: string) => api.get(`/payment-requests/${id}`),
  create: (data: any) => api.post('/payment-requests', data),
  submit: (id: string) => api.post(`/payment-requests/${id}/submit`),
  approve: (id: string, data: any) => api.post(`/payment-requests/${id}/approve`, data),
  execute: (id: string) => api.post(`/payment-requests/${id}/execute`),
  pendingCount: () => api.get('/payment-requests/pending/count'),
};

// International
export const internationalApi = {
  listPpi: (params?: any) => api.get('/international/ppi', { params }),
  createPpi: (data: any) => api.post('/international/ppi', data),
  validatePpi: (id: string) => api.post(`/international/ppi/${id}/validate`),
  usePpi: (id: string, opId: string) => api.post(`/international/ppi/${id}/use`, { operationId: opId }),
  listOps: (params?: any) => api.get('/international/operations', { params }),
  getOp: (id: string) => api.get(`/international/operations/${id}`),
  createOp: (data: any) => api.post('/international/operations', data),
  advanceOp: (id: string, status: string, data?: any) => api.post(`/international/operations/${id}/advance`, { status, data }),
  launchPredom: (id: string, data: any) => api.post(`/international/operations/${id}/predom`, data),
  launchDom: (id: string, data: any) => api.post(`/international/operations/${id}/dom`, data),
  openLC: (id: string, data: any) => api.post(`/international/operations/${id}/lc`, data),
  addCIL: (id: string, data: any) => api.post(`/international/operations/${id}/cil`, data),
  addFee: (id: string, data: any) => api.post(`/international/operations/${id}/fee`, data),
  maturities: (days?: number) => api.get('/international/maturities', { params: { days } }),
  lcExposure: () => api.get('/international/lc-exposure'),
  addDocument: (data: any) => api.post('/international/documents', data),
  verifyDocument: (id: string, notes: string) => api.post(`/international/documents/${id}/verify`, { notes }),
};

// Commitments
export const commitmentsApi = {
  listLines: (params?: any) => api.get('/commitments/lines', { params }),
  getLine: (id: string) => api.get(`/commitments/lines/${id}`),
  createLine: (data: any) => api.post('/commitments/lines', data),
  linesSummary: () => api.get('/commitments/lines/summary'),
  expiringLines: (days?: number) => api.get('/commitments/lines/expiring', { params: { days } }),
  updateUsage: (id: string, usedAmount: number) => api.put(`/commitments/lines/${id}/usage`, { usedAmount }),
  upcomingMaturities: (days?: number) => api.get('/commitments/maturities/upcoming', { params: { days } }),
  createMaturity: (data: any) => api.post('/commitments/maturities', data),
  payMaturity: (id: string) => api.post(`/commitments/maturities/${id}/pay`),
  listUnpaid: () => api.get('/commitments/unpaid'),
  createUnpaid: (data: any) => api.post('/commitments/unpaid', data),
  resolveUnpaid: (id: string, note: string) => api.post(`/commitments/unpaid/${id}/resolve`, { note }),
  alerts: () => api.get('/commitments/alerts'),
};

// Forecasting
export const forecastingApi = {
  list: (params?: any) => api.get('/forecasting', { params }),
  get: (id: string) => api.get(`/forecasting/${id}`),
  create: (data: any) => api.post('/forecasting', data),
  addItem: (id: string, data: any) => api.post(`/forecasting/${id}/items`, data),
  recalculate: (id: string) => api.post(`/forecasting/${id}/recalculate`),
  deficitSolutions: (id: string) => api.get(`/forecasting/${id}/deficit-solutions`),
  critical: () => api.get('/forecasting/critical'),
  consolidated: (data: any) => api.post('/forecasting/consolidated', data),
};

// Consolidation
export const consolidationApi = {
  listModels: () => api.get('/consolidation/models'),
  createModel: (data: any) => api.post('/consolidation/models', data),
  execute: (id: string) => api.post(`/consolidation/models/${id}/execute`),
};

// Reports
export const reportsApi = {
  dashboard: () => api.get('/reports/dashboard'),
  cashEvolution: (start: string, end: string) => api.get('/reports/cash-evolution', { params: { start, end } }),
  byEntity: (params?: any) => api.get('/reports/by-entity', { params }),
  topPayments: (limit?: number) => api.get('/reports/top-payments', { params: { limit } }),
  byNature: () => api.get('/reports/by-nature'),
};

// Business Units
export const businessUnitsApi = {
  list: () => api.get('/business-units'),
  get: (id: string) => api.get(`/business-units/${id}`),
  create: (data: any) => api.post('/business-units', data),
};

// Bank Statements
export const bankStatementsApi = {
  list: () => api.get('/bank-statements'),
  get: (id: string) => api.get(`/bank-statements/${id}`),
  import: (data: any) => api.post('/bank-statements/import', data),
  autoMatch: (id: string) => api.post(`/bank-statements/${id}/auto-match`),
  matchLine: (lineId: string, opId: string) => api.post(`/bank-statements/lines/${lineId}/match`, { operationId: opId }),
  detectFees: (id: string) => api.get(`/bank-statements/${id}/fees`),
};

// Users
export const usersApi = {
  me: () => api.get('/users/me'),
  list: () => api.get('/users'),
};
