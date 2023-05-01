import React, { Component } from 'react';
import { Text, FlatList, TextInput, View, Button, Alert, Modal, TouchableOpacity, SafeAreaView, VirtualizedList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Chats extends Component {
  componentDidMount() {
    // this.getAllConversations();
    // this.getUserInfo();
    this.refreshInterval = setInterval(() => {
      this.getAllConversations();
      this.getUserInfo();
    }, 1000);
  }
  constructor(props) {
    super(props);
    this.state = { user_id: '', session_token: '', showBadRequestMsg: false, visible: false, chatName: '', chats: [], chatsID: [] };
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
          // console.log(error);
        }
      })
    // .catch((error) => console.log(error));
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
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(data => {
        console.log(data)
        const newChats = data.filter(chat => !this.state.chatsID.includes(chat.chat_id))
          .map(chat => ({
            title: chat.name,
            id: chat.chat_id,
            last_message: chat.last_message.message,
            creator_id: chat.creator.user_id,
            creator_name: chat.creator.email
          }));
        this.setState(prevState => ({
          chats: [...prevState.chats, ...newChats],
          chatsID: [...prevState.chatsID, ...newChats.map(chat => chat.id)]
        }));
      })
      .catch(error => {
        console.error(error.message);
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

  handleCreateChat = () => {

    if (this.state.chatName.length == 0) {
      this.setState({ showBadRequestMsg: true });
      return;
    } else {
      this.setState({ showBadRequestMsg: false });
    }

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


  handleOverlay = () => {

    this.setState({ visible: !this.state.visible });

  };
  handleChatNameTextChange = (newtext) => {
    this.setState({ chatName: newtext })
  };
  handleClickedOnChatName = (chat, index, creator_id) => {
    console.log('Clicked: ' + creator_id)
    this.handleChatScreen(index, chat, creator_id);
  };

  handleChatScreen = (chat_id, chat_name, creator_id) => {
    try {
      AsyncStorage.setItem('chat_id', chat_id)
      AsyncStorage.setItem('chat_name', chat_name)
      AsyncStorage.setItem('chat_creator_id', creator_id)
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


  render() {
    return (
      <View style={{ backgroundColor: 'white', height: '100%' }}>
        <Button title='Create Chat' onPress={this.handleOverlay} />

        <View style={{ backgroundColor: 'white', flex: 1 }}>
          <FlatList
            data={this.state.chats}
            renderItem={({ item }) => (
              // <TouchableOpacity onPress={() => this.handleClickedOnChatName(item.title, item.id,item.creator_id)}>
              //   <View style={{ padding: 10, textAlign: 'center' }}>
              //     <Item title={item.title} />
              //   </View>
              // </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleClickedOnChatName(item.title, item.id, item.creator_id)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15 }}>
                  <View style={{ flex: 1, textAlign: 'center' }}>
                    <View style={{
                      padding: 10, 
                      borderRadius: 10,
                      borderRadius: 5,
                      boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)',
                      // overflow: 'hidden',
                    }}>
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
                      {item.last_message != null ? (<View><Text style={{ fontSize: 14, color: '#888' }}>Last message: {item.last_message}</Text></View>) : null}


                      <Text style={{ fontSize: 14, color: '#888' }}>Created by: {item.creator_name}</Text>
                    </View>
                  </View>

                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
        {/* end all chats visable */}

        {/* OVERLAY */}

        <Modal animationType="fade" transparent={true} visible={this.state.visible}>
          <View style={styles.overlay}>
            <View style={styles.content}>
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.title}>Name the chat!</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder='Chat name'
                  onChangeText={this.handleChatNameTextChange}
                  value={this.state.chatName}
                />
                <View>
                  {this.state.showBadRequestMsg ? (
                    <Text style={styles.labelError}>Please Type In A Chat Name</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this.handleCreateChat}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.handleOverlay}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* End of OVERLAY */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatContaier: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)',
    overflow: 'hidden'
  },
  container: {
    textAlign: 'center',
    backgroundColor: 'white',
    // flex: 1,
    // marginTop: StatusBar.currentHeight,
    // width:'50%',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',

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
    height: '100%',
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
    fontSize: 24,
    fontWeight: 'bold',

  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    justifyContent: 'space-evenly'
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  labelError: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#f02b1d'
  },
  // title: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  // },
});

export default Chats;
