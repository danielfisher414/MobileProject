import React, { Component } from 'react';
import { Text, TextInput, Dimensions, View, Button, Alert, Modal, VirtualizedList, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

class Contact extends Component {
  componentDidMount() {
    // this.getAllConversations();
    // this.getUserInfo();
    this.refreshInterval = setInterval(() => {
      // this.getAllFriendsContacts();
      this.getUserInfo();
    }, 1000);
  }

  constructor(props) {
    super(props);
    this.state = {
      user_id: '', session_token: '', searchQuery: '', friends: "",
      blockedContactData: "", contactData: "", searchBlockedUsers: false,
      contactSearchOptions: false, contactOptions: false, blockedUserOptions: false,
      searchForContacts: false, selectedContact: '', filteredFriends: [], filteredBlockedContact: [],
      searchText: '', blockedSearchText: '',
    };
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
          this.handleSearchUsers();
          this.handleUsersContact();
          this.handleSearchBlockedUsers();
        } else {
          // handle missing values
          console.log(error);
        }
      })
      .catch((error) => console.log(error));
  };

  addFriend = (friend) => {
    this.setState(prevState => ({
      friends: [...prevState.friends, friend]
    }));
  }

  handleUsersContact = () => {
    // this.removeUserContact();
    fetch('http://localhost:3333/api/1.0.0/contacts', {
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
        // console.log(data); // Handle the JSON response
        // create an array of contacts available
        const contacts = data.map((item) => ({
          id: item.user_id,
          title: `${item.first_name} ${item.last_name}`,
          email: item.email,
        }));
        this.setState({
          friends: contacts,
        });
      })
      .catch(error => {
        console.error(error); // Handle the error
      });
  }
  getItemCount = () => { return this.state.friends.length };

  getItem = (friends, index) => {

    const { title, email, id } = this.state.friends[index];
    return { title, email, id };
  };

  handleSearch = (text) => {
    const filteredFriends = this.state.friends.filter(
      (friend) => friend.title.toLowerCase().includes(text.toLowerCase()) || friend.email.toLowerCase().includes(text.toLowerCase())
    );
    this.setState({ filteredFriends, searchText: text });
  };
  handleBlockedSearch = (text) => {
    const filteredBlockedContact = this.state.blockedContactData.filter(

      (blockedContact) => blockedContact.title.toLowerCase().includes(text.toLowerCase()) || blockedContact.email.toLowerCase().includes(text.toLowerCase())
    );
    this.setState({ filteredBlockedContact, blockedSearchText: text });
  };


  handleSearchUsers = () => {
    // this.removeUserContact();
    fetch('http://localhost:3333/api/1.0.0/search?q=' + this.state.searchQuery, {
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
        // console.log(data); // Handle the JSON response
        const { friends, blockedContactData } = this.state;
        // Filter out contacts that are friends or blocked
        const contacts = data.filter(item => !friends.find(friend => friend.id === item.user_id) && !blockedContactData.find(blocked => blocked.id === item.user_id)).map(item => ({
          id: item.user_id,
          title: `${item.given_name} ${item.family_name}`,
          email: item.email,
        }));
        this.setState({
          contactData: contacts,
        });
      })
      .catch(error => {
        console.error(error); // Handle the error
      });
  }


  getContactItemCount = () => {
    return this.state.contactData.length;
  };

  getContactItem = (contactData, index) => {
    const { title, email, id } = this.state.contactData[index];
    return { title, email, id };
  };

  // START OF RECIEVING BLOCKED USERS

  handleSearchBlockedUsers = () => {
    // this.removeUserContact();
    fetch('http://localhost:3333/api/1.0.0/blocked', {
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
        console.log(data); // Handle the JSON response
        // create an array of contacts available
        const contacts = data.map((item) => ({
          id: item.user_id,
          title: `${item.first_name} ${item.last_name}`,
          email: item.email,
        }));
        this.setState({
          blockedContactData: contacts,
        });
        // console.log("blocked contacts: " + this.state.blockedContactData);
      })
      .catch(error => {
        console.error(error); // Handle the error
      });
  }

  getBlockedItemCount = () => {
    return this.state.blockedContactData.length;
  };

  getBlockedItem = (contactData, index) => {
    const { title, email, id } = this.state.blockedContactData[index];
    return { title, email, id };
  };

  // END OF Recieving BLOCKED USERS

  // START of BLOCKING USERS
  blockUser = () => {

    fetch('http://localhost:3333/api/1.0.0/user/' + this.state.selectedContact + '/block', {
      method: 'POST',
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
          return response.json(); // Return the JSON response
        } else {
          // Error
          console.log(response.status)
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
  // END of BLOCKING USERS

  // START OF UNBLOCKING USERS
  unBlockUser = () => {

    fetch('http://localhost:3333/api/1.0.0/user/' + this.state.selectedContact + '/block', {
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
          this.setState({ blockedUserOptions: false });
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
  // END OF UNBLOCKING USERS

  searchFilterFunction = (text) => {
    this.setState({
      searchQuery: text
    });
    this.handleSearchUsers();
  };
  createUserContact = (first_name, last_name, email) => {
    document.getElementById('users').innerHTML += first_name + " " + last_name + " " + email + '<br></br>';
  }
  removeUserContact = () => {
    document.getElementById('users').innerHTML = "";
  }
  handleSearchTextChange = (newtext) => {
    this.setState({ searchQuery: newtext })
  };
  // handleBlockedSearchTextChange = (newtext) => {
  //   this.setState({ blockedSearchText: newtext })
  // };

  handleSearchForContacts = () => {
    this.setState({ searchForContacts: !this.state.searchForContacts });
  };

  handleSearchForBlockedUsers = () => {
    this.setState({ searchBlockedUsers: !this.state.searchBlockedUsers });
  };

  handleOverlayOptions = (contact) => {
    console.log(contact);
    this.setState({ selectedContact: contact, contactOptions: !this.state.contactOptions });
  };
  handleblockedUserOverlayOptions = (contact) => {
    console.log(contact);
    this.setState({ selectedContact: contact, blockedUserOptions: !this.state.blockedUserOptions });
  };
  handleOverlayUserOptions = (contact) => {
    console.log(contact);
    this.setState({ selectedContact: contact, contactSearchOptions: !this.state.contactSearchOptions });
  };
  handleBlockContact = () => {
    console.log('block test: ' + this.state.selectedContact);
    this.blockUser();
    this.setState({ contactOptions: false });
    this.handleOverlayUserOptions();
    this.setState({ contactSearchOptions: false });
    // this.contactSearchOptions();
    // this.handleOverlayOptions();
  };
  handleRemoveContact = () => {
    console.log('remove test: ' + this.state.selectedContact);
    this.removeContactUser();
    this.handleOverlayOptions();
  };

  removeContactUser = () => {

    fetch('http://localhost:3333/api/1.0.0/user/' + this.state.selectedContact + '/contact', {
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

  addContactUser = () => {

    fetch('http://localhost:3333/api/1.0.0/user/' + this.state.selectedContact + '/contact', {
      method: 'POST',
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


  handleAddContact = () => {
    console.log('add test: ' + this.state.selectedContact);
    this.addContactUser();
    this.handleOverlayUserOptions();

  };


  render() {
    const screenWidth = Dimensions.get('window').width;
    const isSmallScreen = screenWidth <= 341;

    const friends = this.state.searchText ? this.state.filteredFriends : this.state.friends;
    const blockedContacts = this.state.blockedSearchText ? this.state.filteredBlockedContact : this.state.blockedContactData;



    return (
      <View style={{ backgroundColor: 'white', height: '100%' }}>

        <View style={styles.container}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Friends Contacts</Text>
            <TextInput
              style={styles.searchBar}
              placeholder="Search"
              onChangeText={(text) => this.handleSearch(text)}
              value={this.state.searchText}
            />
            <FlatList
              data={friends}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => this.handleOverlayOptions(item.id)}>
                  <View style={styles.item}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemEmail}>{item.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>

          <View style={{ marginBottom: 30 }}>
            <View style={{
              flex: 1,
              flexDirection: isSmallScreen ? 'column' : 'row',
              justifyContent: 'space-evenly',
              width: '100%'
            }}>
              <View style={{ marginHorizontal: 5 }}>
                <TouchableOpacity onPress={this.handleSearchForContacts}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Add A New Friend Contact</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={this.handleSearchForBlockedUsers}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>View Blocked Users</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>

        {/* model for overlay search for contacts */}
        <Modal animationType="fade" transparent={false} visible={this.state.searchForContacts}>
          {/* ALL CONTACTS View BOX */}

          <View style={styles.container}>
            {/* <Text>Search All Users</Text> */}
            <TextInput
              style={[styles.searchBar, { marginTop: 20 }]}

              onChangeText={(text) => this.searchFilterFunction(text)}
              value={this.state.searchQuery}
              placeholder="Search..."
            />
            <FlatList
              data={this.state.contactData}
              renderItem={({ item }) => {

                if (item.id == this.state.user_id) { return null; } else {
                  return (
                    <TouchableOpacity onPress={() => this.handleOverlayUserOptions(item.id)}>
                      <View style={{ padding: 10 }}>
                        <Item title={item.title + "\n" + item.email} />
                        {/* <Text>{item.email}</Text> */}
                      </View>
                    </TouchableOpacity>
                  );
                };
              }}

              keyExtractor={(item) => (item && item.id) ? item.id.toString() : ''}
            />

          </View>
          <Button title='Close' onPress={this.handleSearchForContacts} />
        </Modal>

        {/* model overlay for viewing blocked users */}

        <Modal animationType="fade" transparent={false} visible={this.state.searchBlockedUsers}>
          {/* BLOCKED USERS LIST */}
          <View style={styles.container}>
            {/* <View style={{ marginTop: 5 }}> */}
              <FlatList
                data={blockedContacts}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity onPress={() => this.handleblockedUserOverlayOptions(item.id)}>
                      <View style={{ padding: 10 }}>
                        <Item title={item.title + "\n" + item.email} />
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => (item && item.id) ? item.id.toString() : ''}
              />
            {/* </View> */}
          </View>
          <Button title='Close' onPress={this.handleSearchForBlockedUsers} />
        </Modal>

        {/* END of model overlay for viewing blocked users */}

        <View >
          <Modal style={styles.optionsContainer} animationType="fade" transparent={true} visible={this.state.contactOptions}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 50,borderRadius:5 }}>
                <View style={styles.optionButtons}>
                  <View style={{marginHorizontal:5}}>
                  <Button onPress={this.handleBlockContact} title='Block Contact' />
                  </View>
                  <View>
                  <Button onPress={this.handleRemoveContact} title='Remove Contact' />
                  </View>
                </View>
                <Button title='Close' onPress={this.handleOverlayOptions} />
              </View>
            </View>
          </Modal>
        </View>

        <View >
          <Modal style={styles.optionsContainer} animationType="fade" transparent={true} visible={this.state.blockedUserOptions}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 50,borderRadius:5 }}>
                <View style={styles.optionButtons}>
                  <Button onPress={this.unBlockUser} title='Unblock Contact' />
                </View>
                <Button title='Close' onPress={this.handleblockedUserOverlayOptions} />
              </View>
            </View>
          </Modal>
        </View>

        {/* this.state.contactSearchOptions */}
        <View >
          <Modal style={styles.optionsContainer} animationType="fade" transparent={true} visible={this.state.contactSearchOptions}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 50,borderRadius:5 }}>
                <View style={styles.optionButtons}>
                  <Button onPress={this.handleAddContact} title='Add Contact' />

                </View>
                {/* <Button onPress={this.handleRemoveContact} title='Remove Contact'/> */}
                <Button title='Close' onPress={this.handleOverlayUserOptions} />
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    // paddingBottom:30,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // width: '100%',
    height: 370,
    backgroundColor: 'white',
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  item: {
    backgroundColor: 'white',
    height: 80,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
    // backgroundColor: 'white',
    // borderRadius: 5,
    marginBottom: 10,
    textAlign: 'center',
    // backgroundColor: 'white',
    borderRadius: 5,
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)',
    // overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: '450',
  },
  optionsContainer: {
    width: 100,
    height: 200,
    backgroundColor: 'blue',
  },
  btnTitle: {
    fontSize: 16,
  },
  optionButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    margin: 10,
    // justifyContent: 'flex-start',
    justifyContent: 'space-evenly',
  },

  button: {
    backgroundColor: '#1E90FF',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: '85%',
    marginBottom: 30,

    // maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  // item: {
  //   margin: 10,
  //   // backgroundColor: 'white',
  //   padding: 10,
  //   // borderRadius: 5,
  //   marginBottom: 10,
  //   textAlign: 'center',
  //   // backgroundColor: 'white',
  //   padding: 10,
  //   borderRadius: 5,
  //   boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)',
  //   // overflow: 'hidden',

  // },
  itemTitle: {
    fontWeight: 'bold',
  },
  itemEmail: {
    fontStyle: 'italic',
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
});

export default Contact;
