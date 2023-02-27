import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './screens/login';
import HomeScreen from './screens/HomeScreen';
import AboutMe from './screens/AboutMe';
import CreateAccount from './screens/CreateAccount';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const Navigation = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeTab = () => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AboutMe" component={AboutMe} /> 
      </Tab.Navigator>
    </NavigationContainer>
  );
};



export {Navigation,HomeTab};

