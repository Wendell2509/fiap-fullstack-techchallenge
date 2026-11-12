
import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../services/api';

export default function TeachersScreen() {
    const navigation = useNavigation();
    const { token } = useAuth();

    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function loadTeachers() {
        try {
            setLoading(true);
            setError('');

            const response = await apiRequest(
                '/teachers?page=1&limit=10',
                {},
                token
            );

            setTeachers(response.data);
        } catch (err) {
            setError(err.message || 'Erro ao carregar professores.');
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadTeachers();
        }, [token])
    );

    function handleDeleteTeacher(teacherId, teacherName) {
        Alert.alert(
            'Excluir Professor',
            `Tem certeza de que deseja excluir ${teacherName}? Essa ação não poderá ser desfeita.`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => confirmDelete(teacherId),
                },
            ]
        );
    }

    async function confirmDelete(teacherId) {
        try {
            await apiRequest(
                `/teachers/${teacherId}`,
                {
                    method: 'DELETE',
                },
                token
            );

            Alert.alert('Sucesso', 'Professor excluído com sucesso!');

            loadTeachers();
        } catch (err) {
            Alert.alert(
                'Erro',
                err.message || 'Não foi possível excluir o professor.'
            );
        }
    }

    function renderTeacher({ item }) {
        return (
            <View style={styles.teacherCard}>
                <View style={styles.teacherInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.info}>E-mail: {item.email}</Text>
                    <Text style={styles.info}>
                        Departamento: {item.department || 'Não informado'}
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                            navigation.navigate('EditTeacher', {
                                teacherId: item.id,
                            })
                        }
                        accessibilityLabel="Editar professor"
                    >
                        <Feather name="edit-2" size={20} color="#2455a4" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() =>
                            handleDeleteTeacher(item.id, item.name)
                        }
                        accessibilityLabel="Excluir professor"
                    >
                        <Feather name="trash-2" size={20} color="#d32f2f" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Professores</Text>

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateTeacher')}
            >
                <Feather name="user-plus" size={18} color="#fff" />
                <Text style={styles.buttonText}>Novo Professor</Text>
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
                    data={teachers}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderTeacher}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            Nenhum professor encontrado.
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
    teacherCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    teacherInfo: {
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
    actionButtons: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
        gap: 12,
    },
    editButton: {
        padding: 10,
        backgroundColor: '#edf2fa',
        borderRadius: 8,
    },
    deleteButton: {
        padding: 10,
        backgroundColor: '#fff0f0',
        borderRadius: 8,
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
