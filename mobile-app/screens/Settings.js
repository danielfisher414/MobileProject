import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, Modal, SearchBar, FlatList, VirtualizedList, SafeAreaView, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LockedOverlay from '../SettingsComponents/LockedScreen';



class Settings extends Component {
  componentDidMount() {
    this.getChatInfo();

    this.refreshInterval = setInterval(() => {
      this.getChatMembers();
      // this.getUserInfo();
    }, 1000);
    // this.refreshInterval = setInterval(this.getAllConversations, 1000); // refresh every 5 seconds
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
      overlayAddUserVisible: false,
      overlayDeleteUserVisible: false,
      addUserName: '',
      deleteUserName: '',
      data: "",
      searchQuery: '',
      chatMembers: "",
      user_id: '',
      chat_creator_id: '',
      
    };
  }


  getChatInfo = () => {
    Promise.all([
      AsyncStorage.getItem('chat_id'),
      AsyncStorage.getItem('chat_name'),
      AsyncStorage.getItem('session_token'),
      AsyncStorage.getItem('user_id'),
      AsyncStorage.getItem('chat_creator_id'),
    ])
      .then(([chat_id, chat_name, session_token, user_id, chat_creator_id]) => {
        if (chat_id && chat_name) {
          this.setState({ chat_id, chat_name, session_token, user_id, chat_creator_id });
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

  getItemCount = () => {
    return this.state.data.length;
  };

  getItem = (data, index) => {
    // console.log(this.state.data[index].title);
    const { title, email, id } = this.state.data[index];
    return { title, email, id };

    // return this.state.data[index];
  };

  getChatMembersItemCount = () => {
    return this.state.chatMembers.length;
  };

  getChatMembersItem = (data, index) => {
    // console.log(this.state.data[index].title);
    const { title, email, id } = this.state.chatMembers[index];
    return { title, email, id };

    // return this.state.data[index];
  };

  getContacts = () => {
    console.log(this.state.session_token)
    fetch("http://localhost:3333/api/1.0.0/contacts", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Authorization": this.state.session_token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          // Success
          return response.json(); // Return the JSON response
        } else {
          // Error
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        console.log(data); // Handle the JSON response
        // create an array of contacts available
        const contacts = data.map((item) => ({
          id: item.user_id,
          title: `${item.first_name} ${item.last_name}`,
          email: item.email,
          isMember: false, // Set the initial value to false
        }));
        this.setState({
          data: contacts,
        });

        // Call the function to get the chat members after getting the contacts
        this.getChatMembers();
      })
      .catch((error) => {
        console.error(error); // Handle the error
      });
  };

  getChatMembers = () => {
    // console.log(this.state.session_token)
    fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chat_id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Authorization": this.state.session_token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          // Success
          return response.json(); // Return the JSON response
        } else {
          // Error
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        // Handle the JSON response
        // create an array of contacts available

        const memberNames = data.members
          .filter((member) => (parseInt(member.user_id)) !== (parseInt(this.state.user_id)))
          .map((member) => ({
            id: member.user_id,
            title: `${member.first_name} ${member.last_name}`,
            email: member.email,
          }));

        console.log(memberNames);

        // Loop through the contacts and set the isMember property to true for the matching contacts
        const updatedContacts = this.state.data.map((contact) => {
          if (memberNames.find((member) => member.id === contact.id)) {
            return {
              ...contact,
              isMember: true,
            };
          } else {
            return contact;
          }
        });

        this.setState({
          chatMembers: memberNames,
          data: updatedContacts, // Update the state with the updated contacts array
        });
      })
      .catch((error) => {
        console.error(error); // Handle the error
      });
  };



  addUserFromChatHandleOverlay = () => {
    this.setState({ overlayAddUserVisible: !this.state.overlayAddUserVisible });

    this.getContacts();
    this.setState({ searchQuery: '' });
  };

  handleDeleteAUserFromChatOverlay = () => {
    this.setState({ overlayDeleteUserVisible: !this.state.overlayDeleteUserVisible });
    this.getContacts();
    this.getChatMembers();
    this.setState({ searchQuery: '' });
  };


  patchAUserFromChat = () => {
    fetch('http://localhost:3333/api/1.0.0/chat/' + this.state.chat_id, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': this.state.session_token,
      },
      body: JSON.stringify({
        name: this.state.chat_name,
      }),
    })
      .then(response => {
        if (response.status === 200) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json(); // Parse response body as JSON
          } else {
            return response.text(); // Return response body as plain text
          }
        } else {
          // Error
          throw new Error('Something went wrong');
        }
      })
      .then(data => {
        // Handle the parsed response data here
        console.log(data);
      })
      .catch(error => {
        // Handle any errors here
        console.error(error);
      });
  };

  handleChangeChatName = () => {
    fetch('http://localhost:3333/api/1.0.0/chat/' + this.state.chat_id, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': this.state.session_token,
      },
      body: JSON.stringify({
        name: this.state.chat_name,
      }),
    })
      .then(response => {
        if (response.status === 200) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json(); // Parse response body as JSON
          } else {
            return response.text(); // Return response body as plain text
          }
        } else {
          // Error
          throw new Error('Something went wrong');
        }
      })
      .then(data => {
        // Handle the parsed response data here
        console.log(data);
      })
      .catch(error => {
        // Handle any errors here
        console.error(error);
      });
  };

  deleteUserFromChat = (userId) => {
    console.log(userId.toString());
    console.log(this.state.chat_id);
    console.log(this.state.session_token);
    fetch('http://localhost:3333/api/1.0.0/chat/' + this.state.chat_id + '/user/' + userId.toString(), {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': this.state.session_token,
      },
    })
      .then(response => {

        if (response.status === 200) {
          // Success

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

  handleChatNameChange = () => {
    try {

      AsyncStorage.setItem('chat_name', this.state.chat_name)
        .then(() => {
          console.log('Value stored successfully!');
          // reloading the page
          this.handleChangeChatName();
          window.location.reload(false);
        })
        .catch((error) => {
          console.log('AsyncStorage error: ', error);
        });
    } catch (error) {
      console.log('Something went wrong: ', error);
    }
  };

  addUserNameTextChange = (newtext) => {
    this.setState({ addUserName: newtext })
  };

  deleteUserNameTextChange = (newtext) => {
    this.setState({ deleteUserName: newtext })
  };
  changeChatName = (newtext) => {
    this.setState({ chat_name: newtext })
  };

  // add user functions
  renderFriendItem = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        <Text>{item.name}</Text>
      </View>
    );
  };

  toggleModal = () => {
    this.setState((prevState) => ({ isModalVisible: !prevState.isModalVisible }));
  };

  loadMoreData = () => {
    const { data } = this.state;
    const newData = friends.slice(this.lastIndex + 1, this.lastIndex + 6); // Load next 5 items
    this.lastIndex += 5; // Update lastIndex
    this.setState({ data: [...data, ...newData] }); // Concatenate existing data with new data
  };

  searchFilterFunction = (text) => {
    this.setState({
      searchQuery: text
    });
    this.getContacts();
  };

  AddUserToChat = (userId) => {
    console.log(userId.toString());
    console.log(this.state.chat_id);
    console.log(this.state.session_token);
    fetch('http://localhost:3333/api/1.0.0/chat/' + this.state.chat_id + '/user/' + userId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': this.state.session_token,
      },
    })
      .then(response => {

        if (response.status === 200) {
          // Success

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

  handleAddUserToChat = (item) => {
    console.log(item + " " + " " + this.state.chat_id);
    this.AddUserToChat(item);

  }
  handleDeleteUserFromChat = (item) => {
    this.getChatMembers();

    this.deleteUserFromChat(item);
  }

  // end of add user functions

  render() {

    return (

      <View style={styles.wholecontainer}>
        <View>
        {this.state.chat_creator_id !== this.state.user_id && <LockedOverlay />}

        
            <View>
              <View style={styles.section}>
                <Text style={styles.heading}>Add A Friend Contact To The Chat</Text>

                <Button onPress={this.addUserFromChatHandleOverlay} title="add user" />
              </View>

              <View style={styles.section}>
                <Text style={styles.heading}>Remove A User From The Chat</Text>

                <Button onPress={this.handleDeleteAUserFromChatOverlay} title="Delete a user" />
              </View>

              <View style={styles.section}>
                <Text style={styles.heading}>Change Chat Name</Text>
                <TextInput placeholder='chat name'
                  onChangeText={this.changeChatName}
                  value={this.state.chat_name}
                  style={styles.chatName}
                />
                <Button onPress={this.handleChatNameChange} title="Change chat name" />
              </View>

              {/* Add A USER OVERLAY */}
              <Modal animationType="fade" transparent={true} visible={this.state.overlayAddUserVisible}>
                <View style={styles.modalContainer}>
                  <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.titleText}>Add A Friend Contact To The Chat</Text>
                    </View>
                    <FlatList
                      style={{ height: 300 }}
                      data={this.state.data}
                      renderItem={({ item }) => {

                        return (
                          <TouchableOpacity onPress={() => this.handleAddUserToChat(item.id)}>
                            <View style={styles.itemContainer}>
                              {item.isMember==true ? (
                                <View style={styles.currentMemberItem}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemEmail}>{item.email}</Text>

                                </View>
                              ):(
                                <View>
                              <Text style={styles.itemTitle}>{item.title}</Text>
                              <Text style={styles.itemEmail}>{item.email}</Text>
                              </View>
    )}
                            </View>
                          </TouchableOpacity>
                        );
                      }}
                      keyExtractor={(item) => (item && item.id) ? item.id.toString() : ''}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={this.addUserFromChatHandleOverlay}>
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* DELETE A USER OVERLAY */}
              <Modal animationType="fade" transparent={true} visible={this.state.overlayDeleteUserVisible}   >
                <View style={styles.modalContainer}>
                  <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.titleText}>Remove A User From The Chat</Text>
                    </View>
                    <FlatList
                      style={{ height: 300 }}
                      data={this.state.chatMembers}
                      renderItem={({ item }) => {

                        return (
                          <TouchableOpacity onPress={() => this.handleDeleteUserFromChat(item.id)}>
                            <View style={styles.itemContainer}>
                              <Text style={styles.itemTitle}>{item.title}</Text>
                              <Text style={styles.itemEmail}>{item.email}</Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }}
                      keyExtractor={(item) => (item && item.id) ? item.id.toString() : ''}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={this.handleDeleteAUserFromChatOverlay}>
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
       
        </View>
      </View>


    );
  }
}

const styles = StyleSheet.create({

  wholecontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    // width:'50%',
    backgroundColor: 'white',
    height: '80%',
    justifyContent: 'center',
    alignContent: 'center',

  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  titleContainer: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  titleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  itemContainer: {
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemEmail: {
    fontSize: 14,
    color: '#8C8C8C',
  },
  closeButton: {
    backgroundColor: '#4285F4',
    alignSelf: 'center',
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 5,

  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,

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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    textAlign: 'center',
    marginTop: 40,
    borderRadius: 5,
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.7)',
    padding: 20,
    margin: 10
    // marginBottom: 20,
  },
  chatName: {
    textAlign: 'center',
    borderRadius: 5,
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.7)',
    padding: 10,
    margin: 10,
  },
  currentMemberItem:{
    backgroundColor:'#90EE90',
    borderRadius:5,
    paddingVertical:8
  }
});

export default Settings;
