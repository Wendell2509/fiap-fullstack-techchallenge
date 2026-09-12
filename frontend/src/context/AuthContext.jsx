/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('@blog:token');
        const storedUser = localStorage.getItem('@blog:user');
        return token && storedUser ? JSON.parse(storedUser) : null;
    });

    async function login(email, password) {
        const response = await api.post('/login', { email, password });
        const { token, user: userData } = response.data;

        localStorage.setItem('@blog:token', token);
        localStorage.setItem('@blog:user', JSON.stringify(userData));

        setUser(userData);
    }

    function logout() {
        localStorage.removeItem('@blog:token');
        localStorage.removeItem('@blog:user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, authenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}