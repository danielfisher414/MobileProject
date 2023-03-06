import React, { Component } from 'react';
import "react-chat-elements/dist/main.css"
import { MessageBox, Input, Button } from 'react-chat-elements';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
class ConversationScreen extends Component {
  componentDidMount(){
    this.getChatInfo();
  }
  constructor(props) {
    super(props);
    this.state = {
      messages: [], // array of message objects
      inputText: '', // text in input box
      session_token:'',
      chat_id:'',
      chat_name:'',
    };
  }

  getChatInfo = () => {
    Promise.all([
      AsyncStorage.getItem('chat_id'),
      AsyncStorage.getItem('chat_name'),
      AsyncStorage.getItem('session_token'),
    ])
      .then(([chat_id, chat_name,session_token ]) => {
        if (chat_id && chat_name) {
          this.setState({ chat_id, chat_name,session_token });
          console.log(this.state.chat_id,this.state.chat_name);
          console.log(this.state.session_token);
          this.getAllConversations();
        } else {
          // handle missing values
          console.log(error);
        }
      })
      .catch((error) => console.log(error));
  };

  getAllConversations = () => {
    fetch('http://localhost:3333/api/1.0.0/chat/' + this.state.chat_id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': this.state.session_token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          // Success
          return response.json(); // Return the JSON response
        } else {
          // Error
          throw new Error('Something went wrong');
        }
      })
      .then((data) => {
        const messageList = data.messages.map((message) => {
          const authorId = message.author.user_id;
          const messageText = message.message;
          const messageId = message.message_id;
  
          return {
            position: authorId === this.state.user_id ? 'right' : 'left',
            type: 'text',
            text: messageText,
            date: new Date(),
          };
        });
  
        this.setState({ messages: messageList });
      })
      .catch((error) => {
        console.error(error.message); // Handle the error
      });
  };

  handleInput = (event) => {
    this.setState({ inputText: event.target.value });
  }

  handleSubmit = () => {
    const newMessage = {
      position: 'right',
      type: 'text',
      text: this.state.inputText,
      date: new Date(),
    };
    this.setState({
      messages: [...this.state.messages, newMessage],
      inputText: '',
    });
  }

  render() {
    return (
      <div>
        <MessageBox
          position={'left'}
          text={'Hi there!'}
          title={'Jane'}
          date={new Date()}
        />
        {this.state.messages.map((message, index) => (
          <MessageBox
            key={index}
            position={message.position}
            type={message.type}
            text={message.text}
            title={message.title}
            date={message.date}
          />
        ))}
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%" }}>
        <Input 
          placeholder="Type a message..."
          multiline={true}
          value={this.state.inputText}
          onChange={this.handleInput}
          rightButtons={
            <Button
              color="white"
              backgroundColor="black"
              text="Send"
              onClick={this.handleSubmit}
            />
          }
        />
          </div>
      </div>
    );
  }
}

export default ConversationScreen;


// getAllConversations = () => {
//   fetch('http://localhost:3333/api/1.0.0/chat/'+this.state.chat_id, {
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
//       data.messages.forEach((message) => {
//         const authorId = message.author.user_id;
//         const messageText = message.message;
//         const messageId = message.message_id;


        
//         console.log(`Author ID: ${authorId}, Message: ${messageText}, Message: ${messageId}`);

        
//         // this.setState({messages: messageText});
//         // renderMessage()
//       });
//     })
//     .catch(error => {
//       console.error(error.message); // Handle the error
//       // console.error(error.response); // Handle the error
//     });
// };