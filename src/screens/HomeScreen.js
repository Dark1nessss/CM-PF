import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { loadTasks, saveTasks } from '../utils/storage';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);

  // Load tasks on mount
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

  // Reload tasks when the screen gains focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const savedTasks = await loadTasks();
        setTasks(savedTasks);
      } catch (error) {
        console.error('Erro ao recarregar tarefas:', error);
      }
    });

    return unsubscribe; // Cleanup listener
  }, [navigation]);

  // Delete a task
  const deleteTask = async (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.taskCard}
            onPress={() => navigation.navigate('EditTask', { taskIndex: index, taskText: item })}
          >
            <Text style={styles.taskText}>{item}</Text>
            <View style={styles.taskActions}>
              <Ionicons
                name="create-outline"
                size={24}
                color={colors.primary}
                onPress={() => navigation.navigate('EditTask', { taskIndex: index, taskText: item })}
              />
              <Ionicons
                name="trash-outline"
                size={24}
                color={colors.accent}
                onPress={() => deleteTask(index)}
              />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa adicionada.</Text>}
      />
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
  taskActions: { flexDirection: 'row', gap: 10 },
  emptyText: { textAlign: 'center', color: colors.text, marginTop: 20 },
});
