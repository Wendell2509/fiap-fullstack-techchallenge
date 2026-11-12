
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';

import PostsScreen from '../screens/posts/PostsScreen';
import PostDetailScreen from '../screens/posts/PostDetailScreen';
import CreatePostScreen from '../screens/posts/CreatePostScreen';
import EditPostScreen from '../screens/posts/EditPostScreen';

import TeachersScreen from '../screens/teachers/TeachersScreen';
import CreateTeacherScreen from '../screens/teachers/CreateTeacherScreen';
import EditTeacherScreen from '../screens/teachers/EditTeacherScreen';

import StudentsScreen from '../screens/students/StudentsScreen';
import CreateStudentScreen from '../screens/students/CreateStudentScreen';
import EditStudentScreen from '../screens/students/EditStudentScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#2455a4" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen
                            name="Posts"
                            component={PostsScreen}
                            options={{ title: 'FIAP Blog' }}
                        />

                        <Stack.Screen
                            name="Teachers"
                            component={TeachersScreen}
                            options={{ title: 'Professores' }}
                        />

                        <Stack.Screen
                            name="CreateTeacher"
                            component={CreateTeacherScreen}
                            options={{ title: 'Cadastrar Professor' }}
                        />

                        <Stack.Screen
                            name="EditTeacher"
                            component={EditTeacherScreen}
                            options={{ title: 'Editar Professor' }}
                        />

                        <Stack.Screen
                            name="Students"
                            component={StudentsScreen}
                            options={{ title: 'Alunos' }}
                        />

                        <Stack.Screen
                            name="CreateStudent"
                            component={CreateStudentScreen}
                            options={{ title: 'Cadastrar Aluno' }}
                        />

                        <Stack.Screen
                            name="EditStudent"
                            component={EditStudentScreen}
                            options={{ title: 'Editar Aluno' }}
                        />

                        <Stack.Screen
                            name="PostDetail"
                            component={PostDetailScreen}
                            options={{ title: 'Detalhes do Post' }}
                        />

                        <Stack.Screen
                            name="CreatePost"
                            component={CreatePostScreen}
                            options={{ title: 'Criar Post' }}
                        />

                        <Stack.Screen
                            name="EditPost"
                            component={EditPostScreen}
                            options={{ title: 'Editar Post' }}
                        />
                    </>
                ) : (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            title: 'Login',
                            headerShown: false,
                        }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
