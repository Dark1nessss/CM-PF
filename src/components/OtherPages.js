import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const OtherPages = ({ items = [] }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [expandedSubPages, setExpandedSubPages] = useState({});
  const [fadeAnims] = useState(() => 
    Object.fromEntries(items.map((_, index) => [index, new Animated.Value(0)]))
  );

  const toggleExpanded = (index) => {
    setExpandedItems((prev) => {
      const newState = { ...prev, [index]: !prev[index] };
      
      Animated.timing(fadeAnims[index], {
        toValue: newState[index] ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Close subpages when main page is closed
      if (!newState[index]) {
        setExpandedSubPages((prevSubPages) => {
          const newSubPages = { ...prevSubPages };
          items[index].subPages?.forEach((_, subIndex) => {
            delete newSubPages[`${index}-${subIndex}`];
          });
          return newSubPages;
        });
      }

      return newState;
    });
  };

  const toggleSubPage = (itemIndex, subPageIndex) => {
    const key = `${itemIndex}-${subPageIndex}`;
    setExpandedSubPages((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getSubPageContent = (item, index) => {
    if (!item.subPages || item.subPages.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.noPagesText}>No pages inside</Text>
        </View>
      );
    }

    return item.subPages.map((subPage, subIndex) => (
      <View key={subIndex}>
        <View style={styles.subSectionRow}>
          <TouchableOpacity
            style={[styles.row, styles.subRow]}
            onPress={() => toggleSubPage(index, subIndex)}
          >
            <Entypo
              name={expandedSubPages[`${index}-${subIndex}`] ? 'chevron-down' : 'chevron-right'}
              size={24}
              color={colors.icon}
            />
            <Feather name="file-text" size={20} color={colors.icon} style={styles.iconMargin} />
            <Text style={styles.mainTitle}>{subPage.title}</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <TouchableOpacity>
              <Entypo name="dots-three-horizontal" size={20} color={colors.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="plus" size={20} color={colors.icon} style={styles.iconMargin} />
            </TouchableOpacity>
          </View>
        </View>

        {expandedSubPages[`${index}-${subIndex}`] && subPage.subPages?.length > 0 && (
          <View>
            {subPage.subPages.map((nestedSubPage, nestedIndex) => (
              <View key={nestedIndex} style={styles.subSectionRow}>
                <View style={[styles.row, styles.nestedRow]}>
                  <Entypo name="chevron-right" size={24} color={colors.icon} />
                  <Feather name="file-text" size={20} color={colors.icon} style={styles.iconMargin} />
                  <Text style={styles.mainTitle}>{nestedSubPage.title}</Text>
                </View>
                <View style={styles.row}>
                  <TouchableOpacity>
                    <Entypo name="dots-three-horizontal" size={20} color={colors.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Entypo name="plus" size={20} color={colors.icon} style={styles.iconMargin} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    ));
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
                <Entypo
                  name={expandedItems[index] ? 'chevron-down' : 'chevron-right'}
                  size={24}
                  color={colors.icon}
                />
                <Feather name="file-text" size={20} color={colors.icon} style={styles.iconMargin} />
                <Text style={styles.mainTitle}>{item.title}</Text>
              </TouchableOpacity>
              <View style={styles.row}>
                <TouchableOpacity>
                  <Entypo name="dots-three-horizontal" size={20} color={colors.icon} style={styles.iconMargin} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Entypo name="plus" size={20} color={colors.icon} style={styles.iconMargin} />
                </TouchableOpacity>
              </View>
            </View>

            {expandedItems[index] && (
              <Animated.View
                style={[
                  styles.subSectionContainer,
                  {
                    opacity: fadeAnims[index],
                  }
                ]}
              >
                {getSubPageContent(item, index)}
              </Animated.View>
            )}
          </View>
        </View>
      ))}
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
  mainSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.headerText,
    marginLeft: 8,
  },
  subSectionContainer: {
    paddingLeft: 24,
    overflow: 'hidden',
  },
  subSectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingLeft: 40,
    paddingVertical: 8,
  },
  noPagesText: {
    fontSize: 14,
    color: colors.headerText,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subRow: {
    paddingLeft: 16,
  },
  nestedRow: {
    paddingLeft: 32,
  },
  iconMargin: {
    marginLeft: 16,
  },
});

export default OtherPages;