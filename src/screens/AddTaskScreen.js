import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { saveTasks, loadTasks } from '../utils/storage';
import { colors } from '../theme/colors';

export default function AddTaskScreen() {
  const [task, setTask] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const navigation = useNavigation();

  const addTask = async () => {
    if (!task.trim()) return; // DO NOT SAVE EMPTY TASKS, THERE IS NO TRY CATCH
    setShowAnimation(true);

    try {
      const currentTasks = await loadTasks();
      const updatedTasks = [...currentTasks, task];
      await saveTasks(updatedTasks);
      setTask('');
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    } finally {
      setTimeout(() => {
        setShowAnimation(false);
        navigation.goBack();
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      {showAnimation ? (
        <LottieView
          source={require('../../assets/animations/task-complete.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      ) : (
        <>
          <Text style={styles.title}>Adicionar Nova Tarefa</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a tarefa..."
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Guardar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: colors.secondary,
    color: colors.background,
  },
  addButton: { backgroundColor: colors.primary, padding: 10, borderRadius: 5 },
  addButtonText: { color: colors.background, textAlign: 'center', fontWeight: 'bold' },
  animation: { width: 200, height: 200, alignSelf: 'center' },
});