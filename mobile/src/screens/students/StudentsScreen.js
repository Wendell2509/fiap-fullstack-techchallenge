
import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../services/api';

export default function StudentsScreen() {
    const navigation = useNavigation();
    const { token } = useAuth();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function loadStudents() {
        try {
            setLoading(true);
            setError('');

            const response = await apiRequest(
                '/students?page=1&limit=10',
                {},
                token
            );

            setStudents(response.data);
        } catch (err) {
            setError(err.message || 'Erro ao carregar alunos.');
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadStudents();
        }, [token])
    );

    function renderStudent({ item }) {
        return (
            <View style={styles.studentCard}>
                <View style={styles.studentInfo}>
                    <Text style={styles.name}>{item.name}</Text>

                    <Text style={styles.info}>
                        E-mail: {item.email}
                    </Text>

                    <Text style={styles.info}>
                        Matrícula: {item.registration_number}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                        navigation.navigate('EditStudent', {
                            studentId: item.id,
                        })
                    }
                >
                    <Feather name="edit-2" size={20} color="#2455a4" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alunos</Text>

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateStudent')}
            >
                <Feather name="user-plus" size={18} color="#fff" />
                <Text style={styles.buttonText}>Novo Aluno</Text>
            </TouchableOpacity>

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
                    data={students}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderStudent}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            Nenhum aluno encontrado.
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 16,
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: '#2455a4',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    studentCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        alignItems: 'center',
    },
    studentInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
    },
    info: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    editButton: {
        padding: 10,
        marginLeft: 8,
    },
    list: {
        paddingBottom: 20,
    },
    loader: {
        marginTop: 30,
    },
    error: {
        color: '#d32f2f',
        textAlign: 'center',
        marginTop: 20,
    },
    empty: {
        color: '#666',
        textAlign: 'center',
        marginTop: 30,
    },
});
