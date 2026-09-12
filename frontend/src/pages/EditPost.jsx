import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await api.get(`/posts/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar dados do post.');
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await api.put(`/posts/${id}`, { title, content });
            navigate(`/post/${id}`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erro ao atualizar o post.');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando dados...</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '30px auto', padding: '0 20px' }}>
            <h2>Editar Postagem</h2>

            {error && (
                <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Título:
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Conteúdo:
                    </label>
                    <textarea
                        rows="8"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        padding: '12px',
                        background: submitting ? '#999' : '#0066cc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                    }}
                >
                    {submitting ? 'Salvando...' : 'Atualizar Postagem'}
                </button>
            </form>
        </div>
    );
}