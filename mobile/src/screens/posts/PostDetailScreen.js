
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';

import { apiRequest } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function PostDetailScreen({ route, navigation }) {
    const { postId } = route.params;
    const { user, token } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadPost() {
            try {
                setLoading(true);
                setError('');

                const data = await apiRequest(`/posts/${postId}`);
                setPost(data);
            } catch (err) {
                setError(err.message || 'Erro ao carregar o post.');
            } finally {
                setLoading(false);
            }
        }

        loadPost();
    }, [postId]);

    function handleDeletePost() {
        Alert.alert(
            'Excluir Post',
            'Tem certeza de que deseja excluir este post? Essa ação não poderá ser desfeita.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: confirmDelete,
                },
            ]
        );
    }

    async function confirmDelete() {
        try {
            setDeleting(true);

            await apiRequest(
                `/posts/${postId}`,
                {
                    method: 'DELETE',
                },
                token
            );

            Alert.alert(
                'Sucesso',
                'Post excluído com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (err) {
            Alert.alert(
                'Erro',
                err.message || 'Não foi possível excluir o post.'
            );
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2455a4" />
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>
                    {error || 'Post não encontrado.'}
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{post.title}</Text>

            <Text style={styles.author}>
                Por: {post.author}
            </Text>

            <Text style={styles.content}>
                {post.content}
            </Text>

            {user?.role === 'teacher' && (
                <>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                            navigation.navigate('EditPost', {
                                postId: post.id,
                            })
                        }
                    >
                        <Text style={styles.buttonText}>
                            Editar Post
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeletePost}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>
                                Excluir Post
                            </Text>
                        )}
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 12,
    },
    author: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
    },
    content: {
        fontSize: 16,
        color: '#333',
        lineHeight: 25,
    },
    error: {
        color: '#d32f2f',
        textAlign: 'center',
    },
    editButton: {
        backgroundColor: '#2455a4',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    deleteButton: {
        backgroundColor: '#d32f2f',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 24,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
