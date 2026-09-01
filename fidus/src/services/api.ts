import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for refresh cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fidus_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling 401s and refreshing tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;

      try {
        const res = await axios.get('http://localhost:5000/api/auth/refresh', {
          withCredentials: true,
        });

        if (res.data.status === 'success') {
          const newToken = res.data.token;
          localStorage.setItem('fidus_token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Dispatch custom event to trigger logout in context
        window.dispatchEvent(new Event('fidus:logout'));
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  uuid: string;
  fullName: string;
  role: 'Client' | 'Artisan';
  profilePicUrl?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  token: string;
  user: User;
}

export interface SignupData {
  fullName: string;
  email: string;
  role: 'Client' | 'Artisan';
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ServiceCreateData {
  Title: string;
  Description: string;
  LocationCoordinates: string;
  PriceRange: string;
}

export interface BidCreateData {
  requestID: string;
  proposedPrice: number;
  message: string;
}

export interface EscrowVerifyData {
  reference: string;
  requestId: string;
  bidId: string;
}

export interface ReviewCreateData {
  requestID: string;
  artisanID: string;
  rating: number;
  comment?: string;
}

// The backend wraps responses in { status, message, data } format
// These helpers extract the data for convenience

export const authApi = {
  signup: (data: SignupData) => api.post('/auth/signup', data),
  login: (data: LoginData) => api.post<AuthResponse>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

export const kycApi = {
  getStatus: () => api.get('/kyc/status'),
  uploadNin: (file: File) => {
    const formData = new FormData();
    formData.append('nin_document', file);
    return api.post('/kyc/upload-nin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadProfilePic: (file: File) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    return api.post('/kyc/upload-profile-pic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadBusinessCert: (file: File) => {
    const formData = new FormData();
    formData.append('business_certificate', file);
    return api.post('/kyc/upload-business-cert', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const serviceApi = {
  create: (data: ServiceCreateData) => api.post('/services/create', data),
  getOpen: (page = 1, limit = 10) => api.get(`/services/open?page=${page}&limit=${limit}`),
  getMyRequests: (page = 1, limit = 10) => api.get(`/services/my-requests?page=${page}&limit=${limit}`),
  complete: (jobId: string) => api.post(`/services/${jobId}/complete`),
};

export const bidApi = {
  create: (data: BidCreateData) => api.post('/bids/create', data),
  getForJob: (jobId: string, page = 1, limit = 10) => api.get(`/bids/${jobId}?page=${page}&limit=${limit}`),
  decision: (data: { bidId: string; decision: 'Accept' | 'Counter' | 'Reject'; counterAmount?: number }) =>
    api.post('/bids/decision', data),
  artisanAccept: (data: { bidId: string }) => api.post('/bids/artisan-accept', data),
};

export const escrowApi = {
  verify: (data: EscrowVerifyData) => api.post('/escrow/verify', data),
};

export const reviewApi = {
  create: (data: ReviewCreateData) => api.post('/reviews/create', data),
};

export default api;
