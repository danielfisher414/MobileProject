import React from 'react';
import { Text, View, TouchableOpacity  } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './screens/login';
import HomeScreen from './screens/HomeScreen';
import AboutMe from './screens/AboutMe';
import CreateAccount from './screens/CreateAccount';
import Chats from './screens/Chats';
import Contacts from './screens/Contacts';
import Settings from './screens/Settings';
import ConversationScreen from './screens/ConversationScreen';
import ExitScreen from './screens/ExitScreen';
// import AboutMe from './screens/CreateAccount';
import { Ionicons } from '@expo/vector-icons';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


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

const HomeTab= () => {
  return (
    <NavigationContainer independent={true}>
            <Tab.Navigator

      >
      {/* <Tab.Screen name="Home" component={HomeScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" color={color} size={size} />
                ),
              }}
              /> */}
      <Tab.Screen name="Chats" component={Chats} 
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbox" color={color} size={size} />
                      ),
                    }}/>
      <Tab.Screen name="Contacts" component={Contacts} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="people" color={color} size={size} />
        ),
      }}/>
      <Tab.Screen name="AboutMe" component={AboutMe} 
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={size} />
                      ),
                    }}/> 
      </Tab.Navigator>
    </NavigationContainer>
  );
};


const Conversation = ({ screenName }) => {
  return (
    <NavigationContainer  independent={true}>
      <Drawer.Navigator >
        <Drawer.Screen name={ screenName } component={ConversationScreen} />
        <Drawer.Screen name="Settings" component={Settings} />
        <Drawer.Screen name="Exit" component={ExitScreen}/>
      </Drawer.Navigator>
      </NavigationContainer>
  );
};

export {Navigation,HomeTab,Conversation};

