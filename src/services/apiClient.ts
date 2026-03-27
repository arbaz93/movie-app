import axios from 'axios'

const tmdbBaseUrl = import.meta.env.VITE_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3';
const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;

export const hasTmdbCredentials = Boolean(tmdbApiKey)

export const apiClient = axios.create({
  baseURL: tmdbBaseUrl,
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  if (tmdbApiKey) {
    config.params = { ...config.params, api_key: tmdbApiKey }
  }
  return config
})
