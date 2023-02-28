import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Chat extends Component{

  render(){
    return(
        <View>
          <Text>Chat</Text>
          {/* <Button title='Logout' onPress={this.logout}/> */}
        </View>
    );
  }
}

export default Chat;
