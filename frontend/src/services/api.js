import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// Interceptor para injetar o token Bearer em todas as chamadas
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('@blog:token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;