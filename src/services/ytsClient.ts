import axios from 'axios'

const ytsBaseUrl = import.meta.env.VITE_YTS_BASE_URL;

export const ytsClient = axios.create({
    baseURL: ytsBaseUrl,
    timeout: 10000,
})

ytsClient.interceptors.request.use((config) => {
        config.params = { ...config.params }
    return config
})
