import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const PagesMenu = ({ visible, onClose, isFavorite }) => {
  // Define menu items based on the type of page
  const menuItems = isFavorite
    ? [
        { title: 'Copy link', icon: 'link' },
        { title: 'Remove from Favorites', icon: 'star-outlined' },
        { title: 'Move to', icon: 'chevron-right' },
      ]
    : [
        { title: 'Copy link', icon: 'link' },
        { title: 'Add to Favorites', icon: 'star' },
        { title: 'Duplicate', icon: 'copy' },
        { title: 'Move to', icon: 'chevron-right' },
        { title: 'Delete', icon: 'trash' },
      ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Options</Text>
              {menuItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.menuItem} onPress={() => console.log(item.title)}>
                  <Feather name={item.icon} size={20} color={colors.icon} style={styles.icon} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  icon: {
    width: 24,
  },
});

export default PagesMenu;