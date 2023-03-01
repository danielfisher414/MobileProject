import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Contact extends Component{
  componentDidMount(){
    this.getUserInfo();
  }
  constructor(props){
    super(props);
    this.state = { user_id:'',session_token:'',data:'',searchQuery:''};
    // this.getUserInfo = this.getUserInfo.bind(this);
  }

  getUserInfo = () => {
    Promise.all([
      AsyncStorage.getItem('user_id'),
      AsyncStorage.getItem('session_token'),
    ])
      .then(([user_id, session_token]) => {
        if (user_id && session_token) {
          this.setState({ user_id, session_token });
        } else {
          // handle missing values
          console.log(error);
        }
      })
      .catch((error) => console.log(error));
  };

  handleSearchUsers = () =>{
    this.removeUserContact();
    fetch('http://localhost:3333/api/1.0.0/search?q='+this.state.searchQuery, {
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
      // given_name = data.given_name;
      
      data.forEach(user =>{
        // console.log(user.email);
        this.createUserContact(user.given_name, user.family_name, user.email);
      });

      // console.log(data[0].email);
      // document.getElementById('users').innerHTML += data[0].email;
    })
    .catch(error => {
      console.error(error); // Handle the error
    });
  }

  createUserContact = (first_name, last_name, email) =>{
    document.getElementById('users').innerHTML += first_name +" "+ last_name +" "+ email + '<br></br>';
  }
  removeUserContact =() =>{
    document.getElementById('users').innerHTML = "";
  }
  handleSearchTextChange = (newtext) =>{
    this.setState({ searchQuery: newtext })
  };
  render(){
    return(
        <View>
          <Text>Contact</Text>
          {/* <Button title='Logout' onPress={this.logout}/> */}
          <TextInput placeholder='Search'
              onChangeText={this.handleSearchTextChange}
            />
          <Button title='search' onPress={this.handleSearchUsers}/>
          <div id='users'></div>
        </View>
    );
  }
}


export default Contact;
