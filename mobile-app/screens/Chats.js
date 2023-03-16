import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert,Modal, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Chats extends Component{
  componentDidMount(){
    this.getUserInfo();
  }
  constructor(props){
    super(props);
    this.state={user_id:'',session_token:'',visible:false,chatName:'',chats:[]};
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
          this.getAllConversations();
        } else {
          // handle missing values
          console.log(error);
        }
      })
      .catch((error) => console.log(error));
  };
  

  getAllConversations = () => {
    fetch('http://localhost:3333/api/1.0.0/chat', {
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
        data.forEach(value=>{
          // let name = value.name;
          this.handleShowAllChats(value.name);
        })
        console.log(data); // Handle the JSON response
        
      })
      .catch(error => {
        console.error(error.message); // Handle the error
        // console.error(error.response); // Handle the error
      });
  };

  handleShowAllChats = (element) => {
    // Update the state with the new element
    this.setState(prevState => ({
      chats: [...prevState.chats, element]
      
    }));
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
        if (response.status === 201) {
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
  handleClickedOnChatName = (chat,index)=>{
    console.log('Clicked:', index+=1,chat)
    this.handleChatScreen(index,chat);
  };

  handleChatScreen = (chat_id,chat_name) => {
    try {
      AsyncStorage.setItem('chat_id', chat_id)
      AsyncStorage.setItem('chat_name', chat_name)
        .then(() => {
          console.log('Value stored successfully!');
          // reloading the page
          window.location.reload(false);
        })
        .catch((error) => {
          console.log('AsyncStorage error: ', error);
        });
    } catch (error) {
      console.log('Something went wrong: ', error);
    }
  };

  render(){
    return(
        <View>
          <Text>Chat</Text>
          <Button title='Create Chat' onPress={this.handleOverlay}/>

          {/* all chats visable */}
          <div id="allChatsBox" style={{ height:'100%',touchAction: 'none'}}>

          {this.state.chats.map((chat, index) => (
            <TouchableOpacity onPress={() => this.handleClickedOnChatName(chat,index)}>
              
               <Text style={{ color: 'black', fontSize:'20px',textAlign:'center'}}>{chat}</Text>
            </TouchableOpacity>
          ))}
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
