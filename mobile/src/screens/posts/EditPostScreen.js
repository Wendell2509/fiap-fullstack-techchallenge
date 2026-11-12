
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';

import { apiRequest } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function EditPostScreen({ route, navigation }) {
    const { postId } = route.params;
    const { token } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadPost() {
            try {
                setLoading(true);

                const data = await apiRequest(`/posts/${postId}`);

                setTitle(data.title);
                setContent(data.content);
                setAuthor(data.author);
            } catch (error) {
                Alert.alert(
                    'Erro',
                    error.message || 'Não foi possível carregar o post.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadPost();
    }, [postId]);

    async function handleUpdatePost() {
        if (!title.trim() || !content.trim() || !author.trim()) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        try {
            setSaving(true);

            await apiRequest(
                `/posts/${postId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        title: title.trim(),
                        content: content.trim(),
                        author: author.trim(),
                    }),
                },
                token
            );

            Alert.alert('Sucesso', 'Post atualizado com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            Alert.alert(
                'Erro',
                error.message || 'Não foi possível atualizar o post.'
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2455a4" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Editar Post</Text>

            <Text style={styles.label}>Título</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o título"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Conteúdo</Text>
            <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="Digite o conteúdo"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
            />

            <Text style={styles.label}>Autor</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do autor"
                value={author}
                onChangeText={setAuthor}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleUpdatePost}
                disabled={saving}
            >
                {saving ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Salvar Alterações</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#222',
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    contentInput: {
        minHeight: 150,
    },
    button: {
        backgroundColor: '#2455a4',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
