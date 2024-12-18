import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function AccountModal({ visible, onClose }) {
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
              <Text style={styles.modalTitle}>Accounts</Text>
              <Text style={styles.modalEmail}>frankhorn99@gmail.com</Text>
              <View style={styles.accountItem}>
                <View style={styles.logoContainerSmall}>
                  <Text style={styles.logoText}>D</Text>
                </View>
                <Text style={styles.accountName}>Dark1ness's NotY</Text>
                <Entypo name="check" size={20} color={colors.primary} />
              </View>
              <TouchableOpacity style={styles.accountOption}>
                <Text style={styles.optionText}>+ Add an account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.accountOption}>
                <Text style={[styles.optionText, { color: colors.accent }]}>
                  Log out
                </Text>
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.modalBackground,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.headerText,
  },
  modalEmail: {
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: 20,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoContainerSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  accountName: {
    flex: 1,
    fontSize: 16,
    color: colors.headerText,
  },
  accountOption: {
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: colors.headerText,
  },
});