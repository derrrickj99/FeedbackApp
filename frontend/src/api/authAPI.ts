import type { IApiResponse, User } from "../typings";
import { CustomError, getError } from "../utils/error";
import { apiClient } from "./api";

export const auth = {
    refresh: async (refreshToken: string) => {
        try {
            const response = await apiClient.post(`/auth/refresh-token`, "", {
                body: JSON.stringify({ refreshToken })
            })

            if (response.ok) {

                const body = await response.json() as IApiResponse<{ accessToken: string }>;
                if (body.success && body.data !== undefined) {
                    return body.data;
                } else {
                    throw new CustomError("Server Error", body.message ?? "Unknown error. Please contact Admin");
                }
            } else {
                throw new CustomError("Server Error", response.statusText ?? "Unknown error");
            }
        } catch (err) {
            throw getError(err);
        }

    },
    me: async (accessToken: string) => {
        try {
            const response = await apiClient.get(`/auth/me`, accessToken, {
            })
            if (response.ok) {

                const body = await response.json() as IApiResponse<User>;
                if (body.success && body.data !== undefined) {
                    return body.data;
                } else {
                    throw new CustomError("Server Error", body.message ?? "Unknown error. Please contact Admin");
                }
            } else {
                throw new CustomError("Server Error", response.statusText ?? "Unknown error");
            }
        } catch (err) {
            throw getError(err);
        }
    },
    login: async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/login', "", {
                body: JSON.stringify({ email, password })
            })

            if (response.ok) {

                const body = await response.json() as IApiResponse<{ user: User; accessToken: string; refreshToken: string }>;
                if (body.success && body.data !== undefined) {
                    return body.data;
                } else {
                    throw new CustomError("Server Error", body.message ?? "Unknown error. Please contact Admin");
                }
            } else if (response.status === 401) {
                throw new CustomError("Authorization Error", "Invalid Credentials");
            } else {
                throw new CustomError("Server Error", response.statusText ?? "Unknown error");
            }
        } catch (err) {
            throw getError(err);
        }
    },
    logout: async (accessToken: string) => {
        try {
            const response = await apiClient.post('/auth/logout', accessToken);

            if (response.ok) {

                const body = await response.json() as IApiResponse<undefined>;
                if (body.success) {
                    return;
                } else {
                    throw new CustomError("Server Error", body.message ?? "Unknown error. Please contact Admin");
                }
            } else {
                throw new CustomError("Server Error", response.statusText ?? "Unknown error");
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    },
    register: async (name: string, email: string, password: string, confirmPassword: string) => {
        try {
            const response = await apiClient.post("/auth/register", "", {
                body: JSON.stringify({ name, email, password, confirmPassword })
            });

            const body = await response.json() as IApiResponse<{ user: User; accessToken: string; refreshToken: string }>;

            if (body.success && body.data !== undefined) {
                return body.data;
            } else {
                throw new CustomError("Server Error", body.message ?? "Unknown error. Please contact Admin");
            }
        } catch (error) {
            throw getError(error);
        }
    },
    update: async (user: Partial<User>, accessToken: string) => {
        try {
            const response = await apiClient.put("/auth/update-profile", accessToken, {
                body: JSON.stringify({ name: user.name, email: user.email })
            })

            const body = await response.json() as IApiResponse<User>;

            if (body.success && body.data !== undefined) {
                return body.data;
            } else {
                throw new CustomError("Server Error", body.message ?? "Unknown error. Please contact Admin");
            }

        } catch (error) {
            throw getError(error)
        }
    }
}