// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('skillmaster_user'))
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if it's a 401 and NOT a login attempt
    if (error.response?.status === 401 && !error.config.url.endsWith('/auth/login')) {
      localStorage.removeItem('skillmaster_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
