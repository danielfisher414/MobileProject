
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import {Navigation, HomeTab} from './navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const App = () => {
  const [showNavigation, setShowNavigation] = useState(false);


  return (

    <NavigationContainer>
      {showNavigation ? <Navigation/>:<HomeTab/>}
    </NavigationContainer>

  );
};

export default App;
