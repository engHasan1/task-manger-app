import axios from 'axios';

export const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// إضافة اعتراض للطلبات لإرفاق التوكن
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
//yenii
export const login = (email, password) =>
    api.post('/auth/login', { email, password })
        .then(response => {
            console.log('Login response:', response);
            return response.data;
        })
        .catch(error => {
            console.error('Login error:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
            console.error('Error config:', error.config);
            throw error;
        });
export const register = (username, email, password) => api.post('/auth/register', { username, email, password });
export const getTasks = () => api.get('/tasks');
export const addTask = (task) => api.post('/tasks', task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, status) => api.put(`/tasks/${id}`, { status });

export default api;
