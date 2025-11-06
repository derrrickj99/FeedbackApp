import { useEffect, useState, type ReactNode } from "react";
import type { User } from "../typings";
import { auth } from "../api/authAPI"
import AuthContext from "../context/authContext";
import { CustomError, getError } from "../utils/error";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(
        localStorage.getItem('accessToken')
    );
    const [refreshToken, setRefreshToken] = useState<string | null>(
        localStorage.getItem('refreshToken')
    );
    const [loading, setLoading] = useState(true);
    //const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Fetch current user on mount
    useEffect(() => {
        // Handle token refresh
        const handleRefreshToken = async () => {
            if (!refreshToken) {
                handleLogout();
                return;
            }

            try {
                const data = await auth.refresh(refreshToken);

                //console.log(newAccessToken);
                setAccessToken(data.accessToken);
                localStorage.setItem('accessToken', data.accessToken);

                const user = await auth.me(data.accessToken);
                setUser(user);

            } catch (error) {
                console.error(getError(error).message);
                handleLogout();
            }
        };

        const fetchUser = async () => {
            if (accessToken) {
                try {
                    const user = await auth.me(accessToken);

                    setUser(user);
                    // Token invalid, try to refresh
                    await handleRefreshToken();

                } catch (error) {
                    console.error(getError(error).message);
                    handleLogout();
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, [accessToken, refreshToken]);

    // Login
    const login = async (email: string, password: string) => {
        try {
            const data = await auth.login(email, password);

            const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } = data;
            console.log(newAccessToken);
            setUser(user);
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

        } catch (error) {
            console.error(getError(error).message);
            handleLogout();
            throw getError(error);
        }
    };

    const register = async (name: string, email: string, password: string, confirmPassword: string) => {

        const data = await auth.register(name, email, password, confirmPassword);

        const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

        setUser(user);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
    }
    // Logout (internal function)
    const handleLogout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const logout = async () => {
        if (!accessToken) throw new CustomError("Access Token Error", "No access token found!");

        try {
            auth.logout(accessToken);
            handleLogout();
        } catch (error) {
            console.error(getError(error).message);
            handleLogout();
            throw getError(error);
        }
    }

    // Update profile
    const updateProfile = async (data: Partial<User>) => {
        if (!accessToken) throw new CustomError("Authentication Error", 'Not authenticated');

        try {
            const user = await auth.update(data, accessToken);

            setUser(user);
        } catch (error) {
            console.error('Update profile error:', error);
            throw getError(error);
        }
    };

    const value = {
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};