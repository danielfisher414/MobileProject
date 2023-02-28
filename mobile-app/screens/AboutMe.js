import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AboutMe extends Component{

  logout =() =>{
    // alert(10);
    try {
      AsyncStorage.removeItem('id', 662);
      console.log('Item removed successfully');
      window.location.reload(false);
    } catch (error) {
      console.log('Error removing item:', error);
    }
  }
  render(){
    return(
        <View>
          <Text>About Me</Text>
          <Button title='Logout' onPress={this.logout}/>
        </View>
    );
  }
}

export default AboutMe;
