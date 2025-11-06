import { getError } from "../utils/error";

const API_BASE_URL = import.meta.env.VITE_API_URI;

//console.log(API_BASE_URL);

export const apiClient = {

    get: async (endpoint: string, token?: string, options: RequestInit = {}) => {
        try {
            const config: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            };
            if (token && typeof token === 'string') {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`,
                }
            }
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            return response;
        } catch (err) {
            throw getError(err);
        }
    },

    post: async (endpoint: string, token?: string, options: RequestInit = {}) => {

        try {
            const config: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            };
            if (token && typeof token === 'string') {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`,
                }
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            return response;;
        } catch (err) {
            throw getError(err);
        }
    },

    put: async (endpoint: string, token?: string, options: RequestInit = {}) => {
        try {
            const config: RequestInit = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            };
            if (token && typeof token === 'string') {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`,
                }
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            return response;
        } catch (err) {
            throw getError(err);
        }
    },

    delete: async (endpoint: string, token?: string, options: RequestInit = {}) => {
        try {
            const config: RequestInit = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            };
            if (token && typeof token === 'string') {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`,
                }
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            return response;
        } catch (err) {
            throw getError(err);
        }

    }
};