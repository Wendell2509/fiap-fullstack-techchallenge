import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
    const { authenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                Carregando autenticação...
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}