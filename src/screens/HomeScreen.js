import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { loadTasks } from '../utils/storage';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const savedTasks = await loadTasks();
        setTasks(savedTasks);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const savedTasks = await loadTasks();
        setTasks(savedTasks); // Refreshes the state of the tasks
      } catch (error) {
        console.error('Erro ao recarregar tarefas:', error);
      }
    });

  // Unsubscribe when the screen is unmounted or the user navigates away from it
    return unsubscribe;
  }, [navigation]);

  const completeTask = async (index) => {
    setShowAnimation(true);
    const updatedTasks = tasks.filter((_, i) => i !== index);
    await saveTasks(updatedTasks);
    setTasks(updatedTasks);

    setTimeout(() => setShowAnimation(false), 2000); // Wait for the animation
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      {showAnimation ? (
        <LottieView
          source={require('../../assets/animations/task-complete.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.taskCard}
              onPress={() => completeTask(index)}
            >
              <Text style={styles.taskText}>{item}</Text>
              <Ionicons name="checkmark-done" size={24} color={colors.accent} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma tarefa adicionada.</Text>
          }
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Ionicons name="add-circle" size={24} color={colors.background} />
        <Text style={styles.addButtonText}>Nova Tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  animation: { width: 200, height: 200, alignSelf: 'center' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: { color: colors.background, fontWeight: 'bold', marginLeft: 10 },
  taskCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: { color: colors.background, fontSize: 16 },
  emptyText: { textAlign: 'center', color: colors.text, marginTop: 20 },
});