import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 300000, // 5 minutos para procesamiento pesado
  headers: {
    'Content-Type': 'application/json',
  },
}

export const apiClient: AxiosInstance = axios.create(config)

// Interceptores para manejo global
apiClient.interceptors.request.use(
  (config) => {
    // Aquí puedes añadir auth tokens
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo centralizado de errores
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Tiempo de espera agotado. El archivo es muy grande.'))
    }
    if (error.response?.status === 422) {
      return Promise.reject(new Error('Archivo inválido. Verifica el formato PDF.'))
    }
    return Promise.reject(error)
  },
)
