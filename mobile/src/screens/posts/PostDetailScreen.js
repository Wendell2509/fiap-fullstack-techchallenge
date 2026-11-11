
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
} from 'react-native';

import { apiRequest } from '../../services/api';

export default function PostDetailScreen({ route }) {
    const { postId } = route.params;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
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
});
