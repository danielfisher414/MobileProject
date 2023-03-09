
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {Navigation, HomeTab,Conversation} from './navigation';
import { NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditProfile from './screens/EditProfile';
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
    Promise.all([
      AsyncStorage.getItem('chat_id'),
      AsyncStorage.getItem('chat_name'),
    ])
      .then(([chatId, chatName]) => {
        if (chatId !== null && chatName !== null) {
          console.log('chat_id:', chatId);
          console.log('chat_name:', chatName);
          conversationSetId(chatName);
        }
      })
      .catch((error) => console.log(error));
  }, []);


  return (
    // <EditProfile/>

    <NavigationContainer>
      {conversationId != null ? <Conversation Conversation screenName={conversationId}/> :
      id == null ? <Navigation/>:<HomeTab/>}
      </NavigationContainer>

  );
};

export default App;
