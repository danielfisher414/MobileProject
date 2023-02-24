import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/login';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const DetailScreen = ({ route }) => {
  const { isAuthenticated } = route.params;
  return (
    <View>
      <Text>{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</Text>
    </View>
  );
};


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