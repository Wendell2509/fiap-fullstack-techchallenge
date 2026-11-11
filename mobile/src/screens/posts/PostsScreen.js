import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

import { apiRequest } from '../../services/api';

export default function PostsScreen() {
    const [posts, setPosts] = useState([]);
    const [term, setTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigation = useNavigation();
    const { user } = useAuth();

    async function loadPosts(searchTerm = '') {
        try {
            setLoading(true);
            setError('');

            const endpoint = searchTerm.trim()
                ? `/posts/search?term=${encodeURIComponent(searchTerm.trim())}`
                : '/posts';

            const data = await apiRequest(endpoint);

            setPosts(data);
        } catch (err) {
            setError(err.message || 'Erro ao carregar posts.');
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadPosts(term);
        }, [term])
    );

    function handleSearch() {
        loadPosts(term);
    }

    function handleClear() {
        setTerm('');
        loadPosts('');
    }

    function renderPost({ item }) {
        return (
            <TouchableOpacity
                style={styles.postCard}
                onPress={() =>
                    navigation.navigate('PostDetail', {
                        postId: item.id,
                    })
                }
            >
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.author}>Por: {item.author}</Text>
                <Text style={styles.content}>{item.content}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Posts</Text>

            {user?.role === 'teacher' && (
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate('CreatePost')}
                >
                    <Text style={styles.buttonText}>+ Novo Post</Text>
                </TouchableOpacity>
            )}

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar posts..."
                    value={term}
                    onChangeText={setTerm}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Text style={styles.buttonText}>Buscar</Text>
                </TouchableOpacity>
            </View>

            {term.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                    <Text style={styles.clearText}>Limpar pesquisa</Text>
                </TouchableOpacity>
            )}

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#2455a4"
                    style={styles.loader}
                />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderPost}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            Nenhum post encontrado.
                        </Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#222',
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
    },
    searchButton: {
        backgroundColor: '#2455a4',
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    clearText: {
        color: '#2455a4',
        marginBottom: 12,
    },
    list: {
        paddingBottom: 20,
    },
    postCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#222',
    },
    author: {
        fontSize: 13,
        color: '#666',
        marginBottom: 10,
    },
    content: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
    },
    loader: {
        marginTop: 30,
    },
    error: {
        color: '#d32f2f',
        marginTop: 20,
        textAlign: 'center',
    },
    empty: {
        textAlign: 'center',
        color: '#666',
        marginTop: 30,
    },
    createButton: {
        backgroundColor: '#2455a4',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
});
