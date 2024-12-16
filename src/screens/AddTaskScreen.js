import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import EmojiPicker from 'rn-emoji-keyboard';
import { saveTasks, loadTasks } from '../utils/storage';
import { colors } from '../theme/colors';

export default function AddTaskScreen() {
  const [task, setTask] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const navigation = useNavigation();

  const addTask = async () => {
    if (!task.trim()) return; // DO NOT SAVE EMPTY TASKS, THERE IS NO TRY CATCH
    setShowAnimation(true);

    try {
      const currentTasks = await loadTasks();
      const newTask = selectedEmoji ? `${selectedEmoji} ${task}` : task;
      const updatedTasks = [...currentTasks, newTask];
      await saveTasks(updatedTasks);
      setTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setTimeout(() => {
        setShowAnimation(false);
        navigation.goBack();
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {showAnimation ? (
        <LottieView
          source={require('../../assets/animations/task-complete.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      ) : (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>New Task</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.emojiButton}
              onPress={() => setIsEmojiPickerVisible(true)}
            >
              <Text style={styles.emojiButtonText}>
                {selectedEmoji || '😀'}
              </Text>
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.placeholder}
              value={task}
              onChangeText={setTask}
              multiline
              maxLength={200}
              autoFocus
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, !task.trim() && styles.saveButtonDisabled]} 
            onPress={addTask}
            disabled={!task.trim()}
          >
            <Text style={styles.saveButtonText}>Save Task</Text>
          </TouchableOpacity>
        </View>
      )}

      <EmojiPicker
        onEmojiSelected={emoji => {
          setSelectedEmoji(emoji.emoji);
          setIsEmojiPickerVisible(false);
        }}
        open={isEmojiPickerVisible}
        onClose={() => setIsEmojiPickerVisible(false)}
      />
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
    marginTop: Platform.OS === 'ios' ? 50 : 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  emojiButton: {
    marginRight: 10,
    marginTop: 2,
  },
  emojiButtonText: {
    fontSize: 24,
  },
  input: {
    flex: 1,
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
  animation: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
});