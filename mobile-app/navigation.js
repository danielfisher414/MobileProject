import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/login';
import HomeScreen from './screens/HomeScreen';
import AboutMe from './screens/AboutMe';
import CreateAccount from './screens/CreateAccount';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AboutMe" component={AboutMe} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


// const HomeScreen = ({ route }) => {
//   const { isAuthenticated } = route.params;
//   return (
//     <View>
//       <Text>{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</Text>
//     </View>
//   );
// };


export default Navigation;


// const HomeScreen = () => {
//   const navigation = useNavigation();

//   return (
//     <View>
//       <Text>This is the home screen.</Text>
//       <Button
//         title="Go to Detail Screen"
//         onPress={() => navigation.navigate('Detail')}
//       />
//     </View>
//   );
// };