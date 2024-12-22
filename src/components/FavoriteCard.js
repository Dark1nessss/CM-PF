import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const FavoriteCard = ({ title, subPages = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSubPages, setExpandedSubPages] = useState({});

  const toggleSubPage = (index) => {
    setExpandedSubPages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <View>
    <Text style={styles.sectionTitle}>Favorites</Text>
      <View style={styles.cardContainer}>
        {/* Main Section */}
        <View style={styles.mainSection}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Entypo
              name={isExpanded ? 'chevron-down' : 'chevron-right'}
              size={20}
              color={colors.icon}
            />
            <Feather name="file-text" size={20} color={colors.icon} style={styles.iconMargin} />
            <Text style={styles.mainTitle}>{title}</Text>
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

        {/* Sub Sections */}
        {isExpanded && (
          <View style={styles.subSectionContainer}>
            {subPages.length === 0 ? (
              <Text style={styles.noPagesText}>No pages inside</Text>
            ) : (
              subPages.map((subPage, index) => (
                <View key={index}>
                  {/* SubPage Row */}
                  <View style={styles.subSectionRow}>
                    <TouchableOpacity
                      style={[styles.row, styles.subRow]}
                      onPress={() => toggleSubPage(index)}
                    >
                      <Entypo
                        name={expandedSubPages[index] ? 'chevron-down' : 'chevron-right'}
                        size={20}
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

                  {/* SubPage SubSections */}
                  {expandedSubPages[index] ? (
                    subPage.subPages && subPage.subPages.length > 0 ? (
                      <View>
                        {subPage.subPages.map((nestedSubPage, nestedIndex) => (
                          <View key={nestedIndex} style={styles.subSectionRow}>
                            <View style={[styles.row, styles.subRow]}>
                              <Entypo name="chevron-right" size={20} color={colors.icon} />
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
                    ) : (
                      <Text style={styles.noPagesText}>No pages inside</Text>
                    )
                  ) : null}
                </View>
              ))
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
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
  },
  subSectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  noPagesText: {
    fontSize: 14,
    color: colors.headerText,
    fontStyle: 'italic',
    marginLeft: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subRow: {
    paddingLeft: 16,
  },
  iconMargin: {
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.placeholder,
    marginHorizontal: 16,
    marginVertical: 8,
  },
});

export default FavoriteCard;