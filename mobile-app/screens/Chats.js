import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert,Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Chats extends Component{
  componentDidMount(){
    this.getUserInfo();
  }
  constructor(props){
    super(props);
    this.state={user_id:'',session_token:'',visible:false,chatName:''};
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


  handleCreateChat = () =>{
    const requestBody = {
      name: this.state.chatName
    };

    fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': this.state.session_token
      },
      body: JSON.stringify(requestBody)
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
        
      })
      .catch(error => {
        console.error(error.message); // Handle the error
        // console.error(error.response); // Handle the error
      });
  };

  handleOverlay =() =>{
  
    this.setState({ visible: !this.state.visible });
     
  };
  handleChatNameTextChange = (newtext) => {
    this.setState({ chatName: newtext })
  };

  render(){
    return(
        <View>
          <Text>Chat</Text>
          <Button title='Create Chat' onPress={this.handleOverlay}/>

          {/* all chats visable */}
          <div id='allChatsBox' >
            
          </div>
          {/* end all chats visable */}

              {/* OVERLAY */}

          <Modal animationType="fade" transparent={true} visible={this.state.visible}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 60 }}>
              <Text>Name the chat!</Text>
              <div id='createChatInput'>
              <TextInput placeholder='chat name' onChangeText={this.handleChatNameTextChange}></TextInput>
              <Button title="Submit" onPress={this.handleCreateChat}/>
              </div>
              {/* END OF OVERLAY */}

              <Button title="Close" onPress={this.handleOverlay} />
            </View>
          </View>
        </Modal>

        </View>
    );
  }
}

export default Chats;
