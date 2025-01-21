import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import PagesMenu from './PagesMenu';

const FavoriteCard = ({ items = [] }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [expandedSubPages, setExpandedSubPages] = useState({});
  const [fadeAnims, setFadeAnims] = useState({});
  const [rotationAnims, setRotationAnims] = useState({});
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    const initAnimations = {};
    const initRotations = {};

    items.forEach((item, index) => {
      initAnimations[index] = new Animated.Value(0);
      initRotations[index] = new Animated.Value(0);

      if (item.subPages) {
        item.subPages.forEach((_, subIndex) => {
          const key = `${index}-${subIndex}`;
          initAnimations[key] = new Animated.Value(0);
          initRotations[key] = new Animated.Value(0);
        });
      }
    });

    setFadeAnims(initAnimations);
    setRotationAnims(initRotations);
  }, [items]);

  const toggleExpanded = (index) => {
    setExpandedItems((prev) => {
      const newState = { ...prev, [index]: !prev[index] };

      Animated.timing(fadeAnims[index], {
        toValue: newState[index] ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.timing(rotationAnims[index], {
        toValue: newState[index] ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      return newState;
    });
  };

  const toggleSubPage = (itemIndex, subPageIndex) => {
    const key = `${itemIndex}-${subPageIndex}`;
    setExpandedSubPages((prev) => {
      const newState = { ...prev, [key]: !prev[key] };

      Animated.timing(fadeAnims[key], {
        toValue: newState[key] ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.timing(rotationAnims[key], {
        toValue: newState[key] ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      return newState;
    });
  };

  const getRotationStyle = (anim) =>
    anim?.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg']
    });

  const renderSubPages = (subPages, itemIndex) => {
    return subPages.map((subPage, subIndex) => {
      const key = `${itemIndex}-${subIndex}`;

      return (
        <View key={key}>
          <View style={styles.subSectionRow}>
            <TouchableOpacity
              style={[styles.row, styles.subRow]}
              onPress={() => toggleSubPage(itemIndex, subIndex)}
            >
              <Animated.View
                style={{
                  transform: [{ rotate: getRotationStyle(rotationAnims[key]) }],
                }}
              >
                <Entypo
                  name={'chevron-right'}
                  size={20}
                  color={colors.icon}
                />
              </Animated.View>
              <Feather
                name="file-text"
                size={20}
                color={colors.icon}
                style={styles.iconMargin}
              />
              <Text
                style={styles.mainTitle}
                onPress={() => console.log(subPage.title)}
              >
                {subPage.title}
              </Text>
            </TouchableOpacity>
            <View style={styles.row}>
              <TouchableOpacity>
                <Entypo
                  name="dots-three-horizontal"
                  size={20}
                  color={colors.icon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {expandedSubPages[key] && subPage.subPages?.length > 0 && (
            <Animated.View
              style={[
                styles.nestedContainer,
                { opacity: fadeAnims[key] },
              ]}
            >
              {renderSubPages(subPage.subPages, `${itemIndex}-${subIndex}`)}
            </Animated.View>
          )}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index}>
          {index > 0 && <View style={styles.divider} />}
          <View style={styles.itemContainer}>
            <View style={styles.mainSection}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => toggleExpanded(index)}
              >
                <Animated.View
                  style={{
                    transform: [{ rotate: getRotationStyle(rotationAnims[index]) }],
                  }}
                >
                  <Entypo
                    name={'chevron-right'}
                    size={24}
                    color={colors.icon}
                  />
                </Animated.View>
                <Feather
                  name="file-text"
                  size={20}
                  color={colors.icon}
                  style={styles.iconMargin}
                />
                <Text
                  style={styles.mainTitle}
                  onPress={() => console.log(item.title)}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
              <View style={styles.row}>
                <TouchableOpacity onPress={toggleMenu}>
                  <Entypo
                    name="dots-three-horizontal"
                    size={20}
                    color={colors.icon}
                    style={styles.iconMargin}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {expandedItems[index] && (
              <Animated.View
                style={[
                  styles.subSectionContainer,
                  { opacity: fadeAnims[index] },
                ]}
              >
                {item.subPages && renderSubPages(item.subPages, index)}
              </Animated.View>
            )}
          </View>
        </View>
      ))}
      <PagesMenu 
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        isFavorite={true} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  itemContainer: {
    padding: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.headerText,
    marginLeft: 8,
  },
  subSectionContainer: {
    paddingLeft: 24,
  },
  subSectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  nestedContainer: {
    paddingLeft: 16,
  },
  iconMargin: {
    marginLeft: 16,
  },
});

export default FavoriteCard;