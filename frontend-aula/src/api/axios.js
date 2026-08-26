import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para añadir el token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales (ej. 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    // Si la petición fue exitosa y es de escritura, podrías mostrar un toast aquí
    // pero es mejor dejarlo a nivel de componente para mensajes específicos.
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'Ocurrió un error inesperado';

    if (error.response && error.response.status === 401) {
      toast.error('Sesión expirada. Por favor, ingresa de nuevo.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response && error.response.status === 403) {
      toast.error('No tienes permisos para realizar esta acción');
    } else if (error.response && error.response.status === 500) {
      toast.error('Error interno del servidor. Reintenta más tarde.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
