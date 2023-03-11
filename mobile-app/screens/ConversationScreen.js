import React, { Component } from 'react';
import { Text, TextInput, View} from 'react-native';
import { GiftedChat, Bubble, Avatar } from 'react-native-gifted-chat';
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
      author_id:'',
      showAvatar:'',
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
        
      const messages = data.messages.map(message => ({
      
        _id: message.message_id,
        text: message.message,
        createdAt: new Date(message.timestamp),
        
        user: {
          
          id: message.author.user_id,
          name: message.author.first_name +" "+message.author.last_name,
            
        },
        
      }));
      
      // this.setState({})
      // alert("hello")
      // console.log("first test: "+this.state.messages[0].user.author_id)
      
      // console.log(messages);
      messages.forEach(message => {
        console.log("element: "+message.user.author_id);
        this.setState({ author_id: message.user.author_id});  
      });
      this.setState({ messages });
      

      // console.log("im here: "+this.state.messages[0].user.author_id);
      })
      .catch((error) => {
        console.error(error.message); // Handle the error
      });
  };


  onSend = (newMessages) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, newMessages),
    }));
  };

  renderAvatar=(props)=> {
    if(this.state.author_id==this.state.user_id){
      return null;
      
    }else{
      return (
        <Avatar
          {...props}
          hide={'left'}
          
        />
      );
    };
  };

  renderBubble=(props)=> {
    // alert(this.state.author_id);
    if(this.state.author_id==this.state.user_id){
      
    return (
      <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}
      >
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#cccccc',
          },
        }}
        textStyle={{
          left: {
            color: 'black',
          },
        }}
        position={'right'} //moves the position of the bubble
        renderAvatar={() => null}
      />
      </View>
    );
      }else{
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#cccccc',
              },
            }}
            textStyle={{
              left: {
                color: 'black',
              },
            }}
            position={'left'} //moves the position of the bubble
          />
        );
      }
  }

  render() {
    console.log("here-> :"+this.state.author_id);
    
    if(this.state.author_id==this.state.user_id){
      return (
      
        <View style={{ backgroundColor: "white", flex: 1 }}>
          {/* {alert(this.state.chat_id)} */}
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          
          // user={{
          //   _id: 1,
          // }}
          // {_id ==this.chat_id}
          renderBubble={this.renderBubble} // bubble render
        
          renderAvatar={null} // avatar comment this function for it to show
          
  
        />
        </View>
      );
    }
    return (
      
      <View style={{ backgroundColor: "white", flex: 1 }}>
        {/* {alert(this.state.chat_id)} */}
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        
        // user={{
        //   _id: 1,
        // }}
        // {_id ==this.chat_id}
        renderBubble={this.renderBubble} // bubble render
      
        renderAvatar={null} // avatar comment this function for it to show
        

      />
      </View>
    );
  }
}

export default ConversationScreen;
