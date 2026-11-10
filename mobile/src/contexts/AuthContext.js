
import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSession() {
            try {
                const savedToken = await SecureStore.getItemAsync('token');
                const savedUser = await SecureStore.getItemAsync('user');

                if (savedToken && savedUser) {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.error('Erro ao recuperar sessão:', error);
            } finally {
                setLoading(false);
            }
        }

        loadSession();
    }, []);

    async function signIn(email, password) {
        const data = await loginService(email, password);

        await SecureStore.setItemAsync('token', data.token);
        await SecureStore.setItemAsync('user', JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
    }

    async function signOut() {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');

        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, token, loading, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
