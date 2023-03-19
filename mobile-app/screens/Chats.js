import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert,Modal, TouchableOpacity,SafeAreaView,VirtualizedList,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Item = ({ title }) => (
  <View style={styles.chatContaier}>
    <Text style={styles.chatTitle}>{title}</Text>
  </View>
);

class Chats extends Component{
  componentDidMount(){
    this.getUserInfo();
  }
  constructor(props){
    super(props);
    this.state={user_id:'',session_token:'',visible:false,chatName:'',chats:[],chatsID:[]};
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
      .then((data) => {
        console.log("data: "+data)
        const newChat  = data.map((item) =>( {
          title:item.name,
          id: item.chat_id,
          last_message: item.last_message.message,
          // email:member.email
        }));
        this.setState(prevState=>({
          chats: [...prevState.chats, ...newChat],
        }))
        console.log(this.state.chats); // Use this.state.chats instead of prevState.chats
      })
      .catch(error => {
        console.error(error.message); // Handle the error
        // console.error(error.response); // Handle the error
      });
  };
  

  handleShowAllChats = (element, elementId) => {
    // Create a new object that includes both the chat and its ID
    const newChat = {
      chat: element,
      chatId: elementId,
    };
  
    // Update the state with the new chat and chat ID
    this.setState(prevState => ({
      chats: [...prevState.chats, newChat],
      chatsID: [...prevState.chatsID, elementId],
    }));
    console.log(chats)
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
    console.log('Clicked:', index,chat) //THIS IS WRONG URGENT FIX!!!!!!!1
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

  getChatItemCount = () => {
    return this.state.chats.length;
  };

  getChatItem = (data,index) => {
    // console.log(this.state.data[index].title);
    const { title,id,last_message } = this.state.chats[index];
    return { title, id,last_message };
    
    // return this.state.data[index];
  };

  render(){
    return(
        <View>
         
          <Button title='Create Chat' onPress={this.handleOverlay}/>

          {/* all chats visable */}
          {/* <div id="allChatsBox" style={{ height:'100%',touchAction: 'none'}}>

          {this.state.chats.map((chat, index) => (
            <TouchableOpacity onPress={() => this.handleClickedOnChatName(chat,index)}>
            
               <Text style={{ color: 'black', fontSize:'20px',textAlign:'center'}}>{chat.chat}</Text>
            </TouchableOpacity>
          ))}
        </div> */}

<div >
<SafeAreaView style={styles.container}>
    <VirtualizedList 
        data={this.state.chats}
        getItemCount={this.getChatItemCount}
        getItem={this.getChatItem}
        
        renderItem = {({ item }) => {
          console.log("ITEM HERE: "+item.title);
          // console.log("ITEM HERE: "+item.id);
          // console.log("ITEM HERE: "+item.last_message);
          return(
          <TouchableOpacity onPress={() => this.handleClickedOnChatName(item.title,item.id)}>

            <View style={{ padding: 10 }}>
            <Item title={item.title}/>
            </View>
          </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => (item && item.id) ? item.id.toString() : ''}
      />
    </SafeAreaView>
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

const styles = StyleSheet.create({
  chatContaier:{
    flex: 1,
      backgroundColor: 'white',
  padding: 10,
  borderRadius: 5,
  boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)'
  },
  container: {
    textAlign:'center',
    // flex: 1,
    // marginTop: StatusBar.currentHeight,
    // width:'50%',
    height:'25%',
    justifyContent:'center',
    alignContent:'center',
    
  },
    chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  modelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 80,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: 370,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 32,
    
  },
});

export default Chats;
