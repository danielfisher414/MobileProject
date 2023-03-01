import React, {Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AboutMe extends Component{
  componentDidMount(){
    this.getUserInfo();
  }
  constructor(props){
    super(props);
    this.state = { first_name: '', last_name: '' ,email: '',user_id:'',session_token:''};
    this.getUserInfo = this.getUserInfo.bind(this);
  }
// http://localhost:3333/api/1.0.0/user/{id}

setUserInfo = () =>{

  
  fetch('http://localhost:3333/api/1.0.0/user/'+this.state.user_id, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization': this.state.session_token
  },
})
  .then(response => {
    if (response.status === 200) {
      // Success

      return response.json(); // Return the JSON response
    } else {
      // Error
      throw new Error('Something went wrong');
    }
  })
  .then(data => {
    console.log(data); // Handle the JSON response
    this.setState({ first_name: data.first_name, last_name: data.last_name ,email: data.email });
  })
  .catch(error => {
    console.error(error); // Handle the error
  });
}

getUserInfo = () => {
  Promise.all([
    AsyncStorage.getItem('user_id'),
    AsyncStorage.getItem('session_token'),
  ])
    .then(([user_id, session_token]) => {
      if (user_id && session_token) {
        this.setState({ user_id, session_token }, () => {
          this.setUserInfo();
        });
      } else {
        // handle missing values
      }
    })
    .catch((error) => console.log(error));
};



  logout =() =>{
    // alert(10);
    try {
      AsyncStorage.removeItem('user_id');
      AsyncStorage.removeItem('session_token');
      console.log('Item removed successfully');
      window.location.reload(false);
    } catch (error) {
      console.log('Error removing item:', error);
    }
  };

  render(){
    return(
        <View>
          {/* <Text>About Me</Text> */}
          <Text>{this.state.first_name}</Text>
          <Text>{this.state.last_name}</Text>
          <Text>{this.state.email}</Text>
          <Button title='Logout' onPress={this.logout}/>
        </View>
    );
    }
}

export default AboutMe;




