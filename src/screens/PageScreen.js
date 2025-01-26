import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PageScreen() {
  const route = useRoute();
  const { pageId } = route.params;
  const [page, setPage] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error('Token is missing');
          return;
        }

        const response = await fetch(`http://localhost:5000/pages/page/${pageId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPage(data);
        } else {
          console.error('Error fetching page:', response.status);
        }
      } catch (error) {
        console.error('Error fetching page:', error);
      }
    };

    fetchPage();
  }, [pageId]);

  if (!page) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <Text>{page.title}</Text>
    </View>
  );
}