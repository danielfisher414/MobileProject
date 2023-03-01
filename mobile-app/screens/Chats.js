import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert,Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Chats extends Component{
  componentDidMount(){
    this.getUserInfo();
  }
  constructor(props){
    super(props);
    this.state={user_id:'',session_token:'',visible:false};
    this.getUserInfo = this.getUserInfo.bind(this);
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
  // handleCreateChat = () =>{

  //   fetch('http://localhost:3333/api/1.0.0/search?q='+this.state.searchQuery, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'X-Authorization': this.state.session_token
  //     },
  //   })
  //     .then(response => {
  //       if (response.status === 200) {
  //         // Success
    
  //         return response.json(); // Return the JSON response
  //       } else {
  //         // Error
  //         throw new Error('Something went wrong');
  //       }
  //     })
  //     .then(data => {
  //       console.log(data); // Handle the JSON response
        
  //       data.forEach(user =>{
  //         this.createUserContact(user.given_name, user.family_name, user.email);
  //       });
  //     })
  //     .catch(error => {
  //       console.error(error); // Handle the error
  //     });
  // };

  handleOverlay =() =>{
  
    this.setState({ visible: !this.state.visible });
     
  };

  render(){
    return(
        <View>
          <Text>Chat</Text>
          <Button title='Create Chat' onPress={this.handleOverlay}/>
          
          <Modal animationType="fade" transparent={true} visible={this.state.visible}>
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 60 }}>
              <Text>Name the chat!</Text>
              
              <div id='createChatInput'>
              <TextInput placeholder='chat name'></TextInput>
              <Button title="Submit"/>
              </div>

              <Button title="Close" onPress={this.handleOverlay} />
            </View>
          </View>
        </Modal>

        </View>
    );
  }
}

export default Chats;
