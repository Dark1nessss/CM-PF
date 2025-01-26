import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignInScreen from '../src/screens/SignInScreen';
import HomeScreen from '../src/screens/HomeScreen';
import PageScreen from '../src/screens/PageScreen';
import { colors } from '../src/theme/colors';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await fetch('http://localhost:5000/auth/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          await AsyncStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao validar token:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" style={styles.loader}/>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Page"
              component={PageScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false }}
            initialParams={{ onLoginSuccess: handleLoginSuccess }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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
