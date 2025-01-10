import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, ScrollView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import AccountModal from '../components/AccountModal';
import MenuModal from '../components/MenuModal';
import Favorites from '../components/JumpIn';
import FavoriteCard from '../components/FavoriteCard';
import OtherPages from '../components/OtherPages';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen( visible ) {
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (visible) {
      fetchUserProfile();
    }
  }, [visible]);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/auth/profile', {
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

  const favoriteData = [
    {
      title: 'Meal Planer',
      subPages: [
        { title: 'Meat Diet' },
        { title: 'Fish Diet' },
      ],
    },
  ];

  const testData = [
    {
      title: 'Main Page 1',
      subPages: [
        { title: 'SubPage 1.1' },
        { title: 'SubPage 1.2' },
      ],
    },
    {
      title: 'Main Page 2',
      subPages: [
        { title: 'SubPage 2.1' },
        { title: 'SubPage 2.2' },
      ],
    },
    {
      title: 'Main Page 3',
      subPages: [
        { title: 'SubPage 3.1' },
        {
          title: 'SubPage 3.2',
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor={colors.background}
      />
      {loading ? (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
      ) : (
        <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.leftSection} onPress={() => setModalVisible(true)}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.title}>
            {user?.username ? `${user.username}'s NotY` : 'Unknown NotY'}
            </Text>
            <Text style={styles.subtitle}>
              {user?.email}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => setMenuVisible(true)}>
          <Entypo name="dots-three-horizontal" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>
      <Favorites
        items={[
          { name: 'Weekly Workout Plan' },
          { name: 'Travel Planner' },
          { name: 'Meal Planner' },
        ]}
        onSelect={(item) => console.log(`Selected: ${item.name}`)}
      />
      <Text style={styles.sectionTitle}>Favorites</Text>
      <FavoriteCard items={favoriteData} />
      <Text style={styles.sectionTitle}>Other Pages...</Text>
      <OtherPages items={testData} />
      </>
      )}
      <AccountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <MenuModal 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.headerText,
  },
  subtitle: {
    fontSize: 14,
    color: colors.placeholder,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.placeholder,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  iconContainer: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 16,
    color: colors.placeholder,
  },
});