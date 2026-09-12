import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authenticated } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await api.get(`/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error(err);
                setError('Não foi possível carregar a postagem.');
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id]);

    async function handleDelete() {
        const confirmDelete = window.confirm('Tem certeza que deseja excluir esta postagem?');
        if (!confirmDelete) return;

        try {
            await api.delete(`/posts/${id}`);
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Erro ao excluir a postagem.');
        }
    }

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando postagem...</div>;
    }

    if (error || !post) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
                {error || 'Postagem não encontrada.'}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
            <button
                onClick={() => navigate('/')}
                style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
            >
                &larr; Voltar
            </button>

            <article>
                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>{post.title}</h1>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Por: {post.author || 'Autor desconhecido'}
                </p>

                {authenticated && (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <Link
                            to={`/posts/edit/${id}`}
                            style={{
                                padding: '6px 12px',
                                background: '#ff9800',
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Editar Post
                        </Link>
                        <button
                            onClick={handleDelete}
                            style={{
                                padding: '6px 12px',
                                background: '#e53935',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Excluir Post
                        </button>
                    </div>
                )}

                <div style={{ lineHeight: '1.6', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
                    {post.content}
                </div>
            </article>
        </div>
    );
}