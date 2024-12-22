import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { colors } from '../theme/colors';

export default function JumpIn({ items = [], onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jump Back In</Text>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSelect(item)}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.cardImage} />
            ) : (
              <View style={styles.iconWrapper}>
                <Text style={styles.iconText}>{item.icon || '📄'}</Text>
              </View>
            )}
            <Text style={styles.cardText} numberOfLines={1}>
              {item.name || 'Untitled'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.placeholder,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    width: 140,
    height: 120,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: '70%',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.modalBackground,
    height: '70%',
  },
  iconText: {
    fontSize: 30,
    color: colors.text,
  },
  cardText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.secondary,
  },
});