import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const PagesMenu = ({ visible, onClose, isFavorite, onMoveToFavorites, onMoveToPrivate, selectedPage }) => {
  const menuItems = isFavorite
    ? [
        { title: 'Copy link', icon: 'link', isSeparated: true },
        { title: 'Remove from Favorites', icon: 'star', onPress: () =>{ 
          if (!selectedPage || !selectedPage._id) {
            console.error("No page selected or invalid ID");
            return;
          }
          onMoveToPrivate(selectedPage._id);
          }
        },
        { title: 'Move to', icon: 'chevron-right' },
      ]
    : [
        { title: 'Copy link', icon: 'link', isSeparated: true },
        { title: 'Add to Favorites', icon: 'star', onPress: () => { 
          if (!selectedPage || !selectedPage._id) {
            console.error("No page selected or invalid ID");
            return;
          }
          onMoveToFavorites(selectedPage._id);
          }
        },
        { title: 'Duplicate', icon: 'copy' },
        { title: 'Move to', icon: 'chevron-right' },
        { title: 'Delete', icon: 'trash', isDestructive: true },
      ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Feather name="file-text" size={20} color={colors.text} />
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerTitle}>
                    {selectedPage ? selectedPage.title : 'Error on Fetch'}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    {selectedPage ? selectedPage.source : 'Error on Fetch'}
                  </Text>
                </View>
              </View>

              {/* Menu Items */}
              {menuItems.map((item, index) => {
                const isTopItem =
                  index === 0 || (menuItems[index - 1]?.isSeparated && !item.isSeparated);
                const isBottomItem =
                  index === menuItems.length - 1 || menuItems[index + 1]?.isSeparated;

                return (
                  <View key={index} style={[item.isSeparated && styles.separatedContainer]}>
                    <TouchableOpacity
                      style={[
                        styles.menuItem,
                        isTopItem && styles.groupedItemTop,
                        isBottomItem && styles.groupedItemBottom,
                        item.isDestructive && styles.destructiveItem,
                      ]}
                      onPress={() => {
                        console.log(`Clicked: ${item.title}`);
                        if (item.onPress) {
                          item.onPress();
                        }
                        onClose();
                      }}
                    >
                      <View style={styles.iconContainer}>
                        <Feather
                          name={item.icon}
                          size={20}
                          color={item.isDestructive ? colors.accent : colors.icon}
                        />
                      </View>
                      <Text
                        style={[
                          styles.menuItemText,
                          item.isDestructive && styles.destructiveText,
                        ]}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
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
    backgroundColor: colors.grayBlack,
    padding: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  separatedContainer: {
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: colors.grayModal,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupedItemTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
  },
  groupedItemBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayModal,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  destructiveItem: {
    backgroundColor: colors.grayModal,
    borderBottomWidth: 0,
    borderRadius: 8,
  },
  destructiveText: {
    color: colors.accent,
  },
});

export default PagesMenu;