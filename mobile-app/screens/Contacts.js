import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Contact extends Component{

  render(){
    return(
        <View>
          <Text>Contact</Text>
          {/* <Button title='Logout' onPress={this.logout}/> */}
        </View>
    );
  }
}

export default Contact;
