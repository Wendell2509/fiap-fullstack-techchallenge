
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
    Alert,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { apiRequest } from '../../services/api';

export default function PostsScreen() {
    const [posts, setPosts] = useState([]);
    const [term, setTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigation = useNavigation();
    const { user, token, signOut } = useAuth();

    async function handleLogout() {
        try {
            await signOut();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível sair da conta.');
        }
    }

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

    function handleDeletePost(postId) {
        Alert.alert(
            'Excluir Post',
            'Tem certeza de que deseja excluir este post? Essa ação não poderá ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => confirmDelete(postId),
                },
            ]
        );
    }

    async function confirmDelete(postId) {
        try {
            await apiRequest(
                `/posts/${postId}`,
                { method: 'DELETE' },
                token
            );

            Alert.alert('Sucesso', 'Post excluído com sucesso!');
            loadPosts(term);
        } catch (err) {
            Alert.alert('Erro', err.message || 'Não foi possível excluir o post.');
        }
    }

    function renderPost({ item }) {
        return (
            <View style={styles.postCard}>
                <TouchableOpacity
                    style={styles.postInfo}
                    onPress={() =>
                        navigation.navigate('PostDetail', { postId: item.id })
                    }
                >
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text style={styles.author}>Por: {item.author}</Text>
                    <Text style={styles.content}>{item.content}</Text>
                </TouchableOpacity>

                {user?.role === 'teacher' && (
                    <View style={styles.adminButtons}>
                        <TouchableOpacity
                            style={styles.editIconButton}
                            onPress={() =>
                                navigation.navigate('EditPost', {
                                    postId: item.id,
                                })
                            }
                            accessibilityLabel="Editar post"
                        >
                            <Feather name="edit-2" size={20} color="#2455a4" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteIconButton}
                            onPress={() => handleDeletePost(item.id)}
                            accessibilityLabel="Excluir post"
                        >
                            <Feather name="trash-2" size={20} color="#d32f2f" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>Posts</Text>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    accessibilityLabel="Sair da conta"
                >
                    <Feather name="log-out" size={23} color="#2455a4" />
                </TouchableOpacity>
            </View>

            {user?.role === 'teacher' && (
                <>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => navigation.navigate('CreatePost')}
                    >
                        <Text style={styles.buttonText}>+ Novo Post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.teachersButton}
                        onPress={() => navigation.navigate('Teachers')}
                    >
                        <Text style={styles.buttonText}>Professores</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.studentsButton}
                        onPress={() => navigation.navigate('Students')}
                    >
                        <Text style={styles.buttonText}>Alunos</Text>
                    </TouchableOpacity>
                </>
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
                        <Text style={styles.empty}>Nenhum post encontrado.</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#222',
    },
    logoutButton: {
        padding: 8,
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
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        alignItems: 'center',
    },
    postInfo: {
        flex: 1,
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
    adminButtons: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
        gap: 16,
    },
    editIconButton: {
        padding: 8,
        backgroundColor: '#edf2fa',
        borderRadius: 8,
    },
    deleteIconButton: {
        padding: 8,
        backgroundColor: '#fff0f0',
        borderRadius: 8,
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
        marginBottom: 8,
    },
    teachersButton: {
        backgroundColor: '#555',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    studentsButton: {
        backgroundColor: '#287a55',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
});
