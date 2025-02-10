import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { getApiUrl } from '../api';
import { AuthContext } from '../Auth'; 

export default function AccountModal({ visible, onClose }) {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutError, setLogoutError] = useState('');
  
  useEffect(() => {
    if (visible) {
      fetchUserProfile();
    }
  }, [visible]);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${getApiUrl()}/auth/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
      setLogoutError('An error occurred while logging out. Please try again.');
    } finally {
      onClose();
      if (Platform.OS === 'web') {
        window.location.reload();
      }
    }
  };

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
              {loading ? (
                <Text style={styles.modalEmail}>Loading...</Text>
              ) : (
                <>
                  <Text style={styles.modalTitle}>Accounts</Text>
                  <View style={styles.accountItem}>
                    <View style={styles.logoContainerSmall}>
                      <Text style={styles.logoText}>
                        {user?.username?.charAt(0).toUpperCase() || '?'}
                      </Text>
                    </View>
                    <Text style={styles.accountName}>
                      {user?.username ? `${user.username}'s NotY` : 'Unknown NotY'}
                    </Text>
                    <Entypo name="check" size={20} color={colors.primary} />
                  </View>
                </>
              )}
              <TouchableOpacity style={styles.accountOption}>
                <Text style={styles.optionText}>+ Add an account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.accountOption} onPress={handleLogout}>
                <Text style={[styles.optionText, { color: colors.accent }]}>
                  Log out
                </Text>
              </TouchableOpacity>
              {logoutError ? (
                <Text style={styles.errorText}>
                  {logoutError}
                </Text>
              ) : null}
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
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
});