
import { useState } from 'react';
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

export default function CreatePostScreen({ navigation }) {
    const { user, token } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);

    async function handleCreatePost() {
        if (!title.trim() || !content.trim() || !author.trim()) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        try {
            setLoading(true);

            await apiRequest(
                '/posts',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        title: title.trim(),
                        content: content.trim(),
                        author: author.trim(),
                    }),
                },
                token
            );

            Alert.alert('Sucesso', 'Post criado com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            Alert.alert(
                'Erro',
                error.message || 'Não foi possível criar o post.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Novo Post</Text>

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
                onPress={handleCreatePost}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Criar Post</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 24,
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
        marginBottom: 18,
        fontSize: 15,
    },
    contentInput: {
        minHeight: 150,
    },
    button: {
        backgroundColor: '#2455a4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
