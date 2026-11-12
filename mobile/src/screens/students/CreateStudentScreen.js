
import { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';

import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../services/api';

export default function CreateStudentScreen({ navigation }) {
    const { token } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleCreateStudent() {
        if (
            !name.trim() ||
            !email.trim() ||
            !registrationNumber.trim()
        ) {
            Alert.alert(
                'Atenção',
                'Nome, e-mail e matrícula são obrigatórios.'
            );
            return;
        }

        try {
            setLoading(true);

            await apiRequest(
                '/students',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        registration_number: registrationNumber.trim(),
                    }),
                },
                token
            );

            Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            Alert.alert(
                'Erro',
                error.message || 'Não foi possível cadastrar o aluno.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cadastrar Aluno</Text>

            <Text style={styles.label}>Nome *</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do aluno"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>E-mail *</Text>
            <TextInput
                style={styles.input}
                placeholder="email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Matrícula *</Text>
            <TextInput
                style={styles.input}
                placeholder="Número de matrícula"
                value={registrationNumber}
                onChangeText={setRegistrationNumber}
                autoCapitalize="none"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleCreateStudent}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Cadastrar</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    title: {
        fontSize: 24,
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
        fontSize: 16,
    },
    button: {
        backgroundColor: '#2455a4',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 30,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
