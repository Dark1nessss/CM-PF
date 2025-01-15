import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import AccountModal from '../components/AccountModal';
import MenuModal from '../components/MenuModal';
import JumpIn from '../components/JumpIn';
import Favorite from '../components/FavoriteCard';
import OtherPages from '../components/OtherPages';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen( visible ) {
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [otherPages, setOtherPages] = useState([]);
  
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

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error('Token is missing');
          return;
        }
  
        const [favoritesResponse, otherPagesResponse] = await Promise.all([
          fetch('http://localhost:5000/pages/favorites', {
            headers: { 
              Authorization: `Bearer ${token}`, 
              'Content-Type': 'application/json' 
            },
          }),
          fetch('http://localhost:5000/pages/otherPages', {
            headers: { 
              Authorization: `Bearer ${token}`, 
              'Content-Type': 'application/json' 
            },
          }),
        ]);
    
        if (favoritesResponse.ok && otherPagesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          const otherPagesData = await otherPagesResponse.json();
    
          setFavorites(favoritesData);
          setOtherPages(otherPagesData);
        } else {
          console.error('Failed to fetch pages', {
            favoritesError: await favoritesResponse.json(),
            otherPagesError: await otherPagesResponse.json(),
          });
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPages();
  }, []);

  return (
    <>
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.grayMid} />
      </View>
    ) : (
    <ScrollView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor={colors.background}
      />
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

      <JumpIn 
        items={favorites.map((item) => ({ ...item, name: item.title }))} 
        onSelect={(item) => console.log(`Selected: ${item.name}`)}
      />
      <Text style={styles.sectionTitle}>Favorites</Text>
      <Favorite items={favorites} />
      <Text style={styles.sectionTitle}>Other Pages...</Text>
      <OtherPages items={otherPages} />
      <AccountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <MenuModal 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
    </ScrollView>
    )}
    </>
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
    backgroundColor: colors.background,
  },
  loader: {
    color: colors.grayMid,
  }
});