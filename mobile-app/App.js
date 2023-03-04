
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {Navigation, HomeTab,Conversation} from './navigation';
import { NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [id, setId] = useState(null);
  const [conversationId, conversationSetId] = useState(null);

    // get user_id
  useEffect(() => {
    AsyncStorage.getItem('user_id')
      .then((value) => {
        if (value !== null) {
          console.log(value);
          setId(value);
          
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // get conversationId
  useEffect(() => {
    AsyncStorage.getItem('chat_id')
    AsyncStorage.getItem('chat_name')
      .then((value) => {
        if (value !== null) {
          console.log(value);
          conversationSetId(value);
          
        }
      })
      .catch((error) => console.log(error));
  }, []);


  return (

    <NavigationContainer>
      {conversationId != null ? <Conversation Conversation screenName={conversationId}/> :
      id == null ? <Navigation/>:<HomeTab/>}
      {/* {id == null ? <Navigation/>:<Conversation/>} */}
      </NavigationContainer>

  );
};

export default App;
