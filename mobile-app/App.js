
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {Navigation, HomeTab} from './navigation';
import { NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [id, setId] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('user_id')
      .then((value) => {
        if (value !== null) {
          setId(value);
          
        }
      })
      .catch((error) => console.log(error));
  }, []);



  return (

    <NavigationContainer>
      {id != null ? <HomeTab/>:<Navigation/>}
      </NavigationContainer>

  );
};

export default App;
