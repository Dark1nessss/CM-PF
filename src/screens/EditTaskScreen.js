import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveTasks, loadTasks } from '../utils/storage';
import { colors } from '../theme/colors';

export default function EditTaskScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { taskIndex, taskText } = route.params;

  const [task, setTask] = useState(taskText);

  const saveTask = async () => {
    try {
      const currentTasks = await loadTasks();
      currentTasks[taskIndex] = task; // Update the specific task
      await saveTasks(currentTasks);
      navigation.goBack(); // Navigate back to the HomeScreen
    } catch (error) {
      console.error('Erro ao salvar a tarefa:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Tarefa</Text>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    color: colors.text,
    backgroundColor: colors.secondary,
  },
  saveButton: { backgroundColor: colors.primary, padding: 10, borderRadius: 5 },
  saveButtonText: { color: colors.background, textAlign: 'center', fontWeight: 'bold' },
});