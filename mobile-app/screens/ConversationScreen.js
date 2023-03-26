import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Clipboard,TextInput,Button, View,Modal,TouchableWithoutFeedback,TouchableOpacity,ViewPropTypes,StyleSheet,ActionSheetIOS, Platfor } from 'react-native';
import { GiftedChat, Bubble, Avatar  } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ConversationScreen extends Component {
  componentDidMount() {
    // this.getChatInfo();
    this.refreshInterval = setInterval(this.getChatInfo(), 100);
    this.refreshInterval = setInterval(this.getAllConversations, 1000); // refresh every 5 seconds
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }
  constructor(props) {
    super(props);
    this.state = {
      messages: [], // array of message objects
      inputText: '', // text in input box
      session_token: '',
      chat_id: '',
      chat_name: '',
      author_ids: null,
      showAvatar: '',
      visible:false,
      EditMessageOverlayVisible:false,
      currentMessage:'',
      // currentMessage:'',
      currentMessageID:'',
    };
  }

  getChatInfo = () => {
    Promise.all([
      AsyncStorage.getItem('chat_id'),
      AsyncStorage.getItem('chat_name'),
      AsyncStorage.getItem('session_token'),
      AsyncStorage.getItem('user_id'),
    ])
      .then(([chat_id, chat_name, session_token, user_id]) => {
        if (chat_id && chat_name) {
          this.setState({ chat_id, chat_name, session_token, user_id });
          this.getAllConversations();
        } else {
          // handle missing values
          console.log(error);
        }
      })
      .catch((error) => console.log(error));
  };

  getAllConversations = () => { // need to find a way to do this on effect due to needing to refresh the app to show
    // newer chat data
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
        // console.log(data);
        const messages = data.messages.map(message => ({

          _id: message.message_id,
          text: message.message,
          createdAt: new Date(message.timestamp),

          user: {

            _id: message.author.user_id,
            name: message.author.first_name + " " + message.author.last_name,

          },

        }));

        const authorIds = messages.map((message) => message.user.id);

        this.setState({ messages, author_ids: authorIds });

      })
      .catch((error) => {
        console.error(error.message); // Handle the error
      });
  };


  onSend = (newMessages) => {

    const messageSent = newMessages[0].text;
    // console.log("chatmsg "+newMessages[0]);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, newMessages),
    }), () => {
      // Make network request to post new message
      const lastMessage = newMessages[0];
      const { text, user, createdAt } = lastMessage;
      const data = { text, user, createdAt };
      
      
      fetch('http://localhost:3333/api/1.0.0/chat/'+this.state.chat_id+'/message', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': this.state.session_token
        },
        body: JSON.stringify({
          message: messageSent,
        })
        
      });
      this.getAllConversations();

    });
  };
  
  renderAvatar=(props)=> {
    const { currentMessage } = props;
    const authorId = currentMessage.user._id;

    if(authorId==this.state.user_id){
      return null;
      
    }else{
      return (
        <Avatar
          {...props}
          position= "left"
          style={{ marginLeft: 8, marginRight: 8 }}
        />
      );
    };
  };

  renderBubble = props => {
    const { currentMessage } = props;
    const authorId = currentMessage.user._id;


    if (authorId == this.state.user_id) {

      return (
          
        <Bubble
          {...props}
          position={'right'} //moves the position of the bubble
          // renderAvatar={() => null}
          style={{ marginRight: 60, marginBottom: 20 }} // add marginRight style
        />
      );
    } else {

      return (

        <Bubble
          {...props}
          
          position={'left'} //moves the position of the bubble
          style={{ marginRight: 60, marginBottom: 10 }} // add marginRight style
        />

      );
    }
  }
  handleDeleteMessage = () => {
    
    fetch('http://localhost:3333/api/1.0.0/chat/'+this.state.chat_id+'/message/'+this.state.currentMessageID, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': this.state.session_token
      },
    })
      .then(response => {
        if (response.status === 200) {
          // Success
          console.log('success')
          return response; // Return the JSON response
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

  handleEditedMessage = () => {
    fetch('http://localhost:3333/api/1.0.0/chat/'+this.state.chat_id+'/message/'+this.state.currentMessageID, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': this.state.session_token,
      },
      body: JSON.stringify({
        message: this.state.currentMessage,
      }),
    })
    .then(response => {
      if (response.status === 200) {
        // Success
        console.log('success')
        return response; // Return the JSON response
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

  handleEditMessageOverlay =() =>{
  
    this.setState({ EditMessageOverlayVisible: !this.state.EditMessageOverlayVisible });
     
  };

  handleSubmitEditMessage=() =>{
  
    this.setState({ EditMessageOverlayVisible: !this.state.EditMessageOverlayVisible });
    // this.setState({ currentMessage: !this.state.currentMessage });
     this.handleEditedMessage();
  };
  
  handleBubblePress() {
    this.setState({ visible: true });
  }


  onLongPress=(context, currentMessage)=> {
    this.setState({currentMessageID:currentMessage._id})
    console.log(currentMessage);
    console.log(this.state.chat_id);
    // const message = currentMessage;
    const options = ['Copy Text','Delete Message','Edit Message', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    console.log("cancelButtonIndex: "+cancelButtonIndex)
    context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex
    }, (buttonIndex) => {
        switch (buttonIndex) {
            case 0:
              console.log("buttonIndex: "+buttonIndex);
              Clipboard.setString(currentMessage.text);
                break;
            case 1:
                this.handleDeleteMessage();
                break;
            case 2:
              this.handleEditMessageOverlay();
              this.setState({currentMessage:currentMessage.text});
              break;
            case 3:
                break;
        }
    });
}

handleEditMessageChange=(newtext)=>{
  this.setState({currentMessage:newtext})
};

  render() {

    // console.log("hi2");
    return (

      <View style={{ backgroundColor: "white", flex: 1 }}>
        <GiftedChat

          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderBubble={this.renderBubble} // bubble render
          onLongPress={this.onLongPress}
          renderAvatar={this.renderAvatar}
        />
        {/* OVERLAY */}
        <Modal animationType="fade" transparent={true} visible={this.state.EditMessageOverlayVisible}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 60 }}>
              <Text>Edit message!</Text>
              <div id='editMessageBox'>
              <TextInput onChangeText={this.handleEditMessageChange} value={this.state.currentMessage}></TextInput>
           
              </div>
              <Button title="Submit" onPress={this.handleSubmitEditMessage} />
              <Button title="Close" onPress={this.handleEditMessageOverlay} />
            </View>
          </View>
        </Modal>
        {/* END OF OVERLAY */}
      </View>
    );

  }
}

export default ConversationScreen;
