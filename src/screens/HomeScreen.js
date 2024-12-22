import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import AccountModal from '../components/AccountModal';
import MenuModal from '../components/MenuModal';
import Favorites from '../components/JumpIn';
import FavoriteCard from '../components/FavoriteCard';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor={colors.background}
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.leftSection} onPress={() => setModalVisible(true)}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>D</Text>
          </View>
          <View>
            <Text style={styles.title}>Dark1ness's NotY</Text>
            <Text style={styles.subtitle}>frankhorn99@gmail.com</Text>
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
      <FavoriteCard
        title="Weekly Workout Plan"
        subPages={[
          { title: 'Untitled' },
        ]}
      />
      <AccountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <MenuModal 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
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
});