import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../src/screens/SignInScreen';
import HomeScreen from '../src/screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken'); // Use AsyncStorage
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* SignIn screen always present */}
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        
        {/* Only show Home if authenticated */}
        {isAuthenticated && (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
