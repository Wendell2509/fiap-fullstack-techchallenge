import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Erro ao carregar posts:', error);
            }
        }
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter((post) =>
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.content?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Postagens</h1>

            <input
                type="text"
                placeholder="Buscar por título ou conteúdo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '20px 0',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                }}
            />

            <div>
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <article key={post.id} style={{ background: '#fff', padding: '15px', marginBottom: '15px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h2>
                                <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: '#AA44AA' }}>
                                    {post.title}
                                </Link>
                            </h2>
                            <p style={{ marginTop: '8px', lineHeight: '1.5' }}>{post.content}</p>
                            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                                Por: <strong>{post.author || 'Autor desconhecido'}</strong>
                            </div>
                        </article>
                    ))
                ) : (
                    <p>Nenhum post encontrado.</p>
                )}
            </div>
        </div>
    );
}