
const API_URL = 'http://127.0.0.1:3000';

export async function apiRequest(endpoint, options = {}, token = null) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || data.error || 'Erro na comunicação com o servidor.'
        );
    }

    return data;
}
