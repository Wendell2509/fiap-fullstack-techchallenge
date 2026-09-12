import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
    const { user, authenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <header style={{ background: '#AA44AA', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Blog Tech
            </Link>

            <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Início</Link>

                {authenticated ? (
                    <>
                        <Link to="/admin" style={{ color: '#ccc', textDecoration: 'none' }}>
                            Painel
                        </Link>
                        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                            {user?.name || user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: '#ff00ff',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Sair
                        </button>
                    </>
                ) : (
                    <Link to="/login" style={{ color: '#ccc', textDecoration: 'none' }}>
                        Entrar
                    </Link>
                )}
            </nav>
        </header>
    );
}