import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Admin() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar lista de postagens.');
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    async function handleDelete(id) {
        const confirmDelete = window.confirm('Deseja realmente excluir esta postagem?');
        if (!confirmDelete) return;

        try {
            await api.delete(`/posts/${id}`);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        } catch (err) {
            console.error(err);
            alert('Erro ao excluir a postagem.');
        }
    }

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando painel...</div>;
    }

    return (
        <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Painel de Gestão de Postagens</h2>
                <Link
                    to="/posts/new"
                    style={{
                        padding: '8px 16px',
                        background: '#4caf50',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    +
                </Link>
            </div>

            {error && (
                <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            {posts.length === 0 ? (
                <p>Nenhuma postagem cadastrada.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #aaa' }}>Título</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Autor</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{post.id}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{post.title}</td>
                                <td style={{ padding: '12px' }}>{post.author || 'Sem autor'}</td>
                                <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <Link
                                        to={`/posts/edit/${post.id}`}
                                        style={{
                                            padding: '4px 8px',
                                            background: '#ff9800',
                                            color: '#fff',
                                            textDecoration: 'none',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        style={{
                                            padding: '4px 8px',
                                            background: '#e53935',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}