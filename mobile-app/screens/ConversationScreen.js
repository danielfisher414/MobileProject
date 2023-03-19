import React, { Component } from 'react';
import { Text, TextInput, View,Modal,TouchableWithoutFeedback } from 'react-native';
import { GiftedChat, Bubble, Avatar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class ConversationScreen extends Component {
  componentDidMount() {
    // this.getChatInfo();
    this.refreshInterval = setInterval(this.getChatInfo(), 100);
    // this.refreshInterval = setInterval(this.getAllConversations, 1000); // refresh every 5 seconds
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
      visible:false
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
          // console.log(this.state.chat_id,this.state.chat_name);
          // console.log(this.state.session_token);
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
        console.log(data);
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

    // console.log(JSON.stringify(newMessages));
    // console.log(newMessages[0].text);
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
  
  // renderBubble = props => {
  //   return (
  //     <Bubble
  //       {...props}
  //       wrapperStyle={{
  //         left: {
  //           backgroundColor: "#f0f0f0"
  //         }
  //       }}
  //     />
  //   );
  // };
  
  renderAvatar=(props)=> {
    const { currentMessage } = props;
    const authorId = currentMessage.user._id;
    console.log("im here hello "+authorId);
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

    console.log(authorId);
    console.log("current user id: " + this.state.user_id);
    if (authorId == this.state.user_id) {

      return (
        <TouchableWithoutFeedback onPress={() => this.handleBubblePress()}>
          
        <Bubble
          {...props}
          // wrapperStyle={{
          //   left: {
          //     backgroundColor: '#cccccc',
          //   },
          // }}
          // textStyle={{
          //   left: {
          //     color: 'black',
          //   },
          // }}
          position={'right'} //moves the position of the bubble
          // renderAvatar={() => null}
          style={{ marginRight: 60, marginBottom: 10 }} // add marginRight style
        />
        </TouchableWithoutFeedback>
      );
    } else {

      return (

        <Bubble
          {...props}
          
          // wrapperStyle={{
          //   left: {
          //     backgroundColor: '#cccccc',
          //   },
          // }}
          // textStyle={{
          //   left: {
          //     color: 'black',
          //   },
          // }}
          position={'left'} //moves the position of the bubble
          style={{ marginRight: 60, marginBottom: 10 }} // add marginRight style
        />

      );
    }
  }

  // handleOverlay =() =>{
  
  //   this.setState({ visible: !this.state.visible });
     
  // };
  
  handleBubblePress() {
    this.setState({ visible: true });
  }


  render() {
    // console.log("here-> :"+this.state.author_id);


    console.log("hi2");
    return (

      <View style={{ backgroundColor: "white", flex: 1 }}>
        {/* {alert(this.state.chat_id)} */}

        {/* <TouchableWithoutFeedback onPress={this.handleOverlay}> */}
        <GiftedChat

          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderBubble={this.renderBubble} // bubble render
          
          renderAvatar={this.renderAvatar}
          // showUserAvatar={true}
          // renderMessage={this.renderMessage}

        />
        <Modal animationType="fade" transparent={true} visible={this.state.visible}>
        <Text>This is an overlay</Text>
        </Modal>
        {/* </TouchableWithoutFeedback> */}
      </View>
    );

  }
}

export default ConversationScreen;
