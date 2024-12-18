import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Entypo, Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function MenuModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.option}>
                <Feather name="users" size={20} color={colors.headerText} />
                <Text style={styles.optionText}>Members</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Ionicons name="settings-outline" size={20} color={colors.headerText} />
                <Text style={styles.optionText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Entypo name="trash" size={20} color={colors.headerText} />
                <Text style={styles.optionText}>Trash</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <FontAwesome name="arrow-circle-up" size={20} color={colors.headerText} />
                <Text style={styles.optionText}>Upgrade to Plus</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Entypo name="help-with-circle" size={20} color={colors.headerText} />
                <Text style={styles.optionText}>Help & support</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    marginTop: 80,
    marginRight: 20,
    marginLeft: 'auto',
    backgroundColor: colors.modalBackground,
    borderRadius: 10,
    width: 250,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.headerText,
  },
});