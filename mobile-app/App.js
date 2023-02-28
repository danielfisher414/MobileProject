
import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import {Navigation, HomeTab} from './navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const setToken =(token) =>{
    this.token = token;
  }
  const getToken =() =>{
    return this.token;
  }

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

  // this.setNavigation(false);

  return (

    <NavigationContainer>
      {id != null ? <HomeTab/>:<Navigation/>}
      {/* <Button title="hi" onPress={this.checkLoggedIn}/> */}
    </NavigationContainer>

  );
};

export default App;
