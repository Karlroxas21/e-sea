import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

// types for the failed queue
interface FailedRequest {
    resolve: (token: string | null) => void;
    reject: (error: any) => void;
}

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token && config.url !== '/auth/refresh' && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await apiClient.post('/auth/refresh');

                if (data && data.jwt) {
                    localStorage.setItem('authToken', data.jwt);
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${data.jwt}`;
                    }

                    processQueue(null, data.jwt);
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.clear();
                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export const api = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        apiClient.get<T>(url, config).then((res) => res.data),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.post<T>(url, data, config).then((res) => res.data),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.put<T>(url, data, config).then((res) => res.data),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.patch<T>(url, data, config).then((res) => res.data),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        apiClient.delete<T>(url, config).then((res) => res.data),
};
export default apiClient;
