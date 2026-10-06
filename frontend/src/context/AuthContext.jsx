/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('@blog:token');
        const storedUser = localStorage.getItem('@blog:user');

        // Garante que o valor existe e nao e a string "undefined" ou "null"
        if (token && storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            try {
                const parsedUser = JSON.parse(storedUser);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return parsedUser;
            } catch (error) {
                // Se falhar o parse, limpa os dados invalidos
                localStorage.removeItem('@blog:token');
                localStorage.removeItem('@blog:user');
                return null;
            }
        }
        return null;
    });

    async function login(email, password) {
        const response = await api.post('/login', { email, password });

        const { token, user: userData } = response.data;
        // Evita gravar undefined no localStorage
        const resolvedUser = userData || { email };

        localStorage.setItem('@blog:token', token);
        localStorage.setItem('@blog:user', JSON.stringify(resolvedUser));

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(resolvedUser);
    }

    function logout() {
        localStorage.removeItem('@blog:token');
        localStorage.removeItem('@blog:user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, authenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}