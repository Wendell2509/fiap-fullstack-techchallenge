
import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

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

                if (!savedToken || !savedUser) {
                    await clearStoredSession();
                    return;
                }

                const decodedToken = jwtDecode(savedToken);

                // Verifica se o token possui data de expiração
                // e se ela já passou.
                if (
                    !decodedToken.exp ||
                    decodedToken.exp * 1000 <= Date.now()
                ) {
                    await clearStoredSession();
                    return;
                }

                const parsedUser = JSON.parse(savedUser);

                setToken(savedToken);
                setUser(parsedUser);

            } catch (error) {
                console.error('Erro ao recuperar sessão:', error);
                await clearStoredSession();
            } finally {
                setLoading(false);
            }
        }

        async function clearStoredSession() {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('user');
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
