import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveTasks, loadTasks } from '../utils/storage';
import { colors } from '../theme/colors';

export default function EditTaskScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { taskIndex, taskText } = route.params;

  const [task, setTask] = useState(taskText);

  const saveTask = async () => {
    if (!task.trim()) return;
    try {
      const currentTasks = await loadTasks();
      currentTasks[taskIndex] = task; // Update the specific task
      await saveTasks(currentTasks);
      navigation.goBack(); // Navigate back to the HomeScreen
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Task</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={task}
            onChangeText={setTask}
            multiline
            maxLength={200}
            autoFocus
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, !task.trim() && styles.saveButtonDisabled]} 
          onPress={saveTask}
          disabled={!task.trim()}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: Platform.OS === 'ios' ? 60 : 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
  },
  inputContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 15,
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.background,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});