//import dotenv from "dotenv"
//dotenv.config();

import type { IApiResponse } from "../typings";

//const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = 'http://localhost:5000/api';

// API Client Class
export class FetchAPI {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    protected getBaseURL() {
        return this.baseURL;
    }

    protected async fetchAPI<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<IApiResponse<T>> {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config: RequestInit = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            };
            console.log(config);

            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP Error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}