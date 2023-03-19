import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, Modal, VirtualizedList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// const friends = [
//   { id: 1, name: 'John Doe' },
//   { id: 2, name: 'Jane Smith' },
//   { id: 3, name: 'Bob Johnson' },
//   { id: 4, name: 'Alice Brown' },
//   { id: 5, name: 'Tom Wilson' },
//   { id: 6, name: 'Mary Davis' },
//   { id: 7, name: 'Peter Lee' },
//   { id: 8, name: 'Lucy Kim' },
//   { id: 9, name: 'David Chang' },
//   { id: 10, name: 'Tom Wilson' },
//   { id: 11, name: 'Mary Davis' },
//   { id: 12, name: 'Peter Lee' },
//   { id: 13, name: 'Lucy Kim' },
//   { id: 14, name: 'David Chang' },
// ];



const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

class Contact extends Component {
  componentDidMount() {
    this.getUserInfo();
  }
  constructor(props) {
    super(props);
    this.state = { user_id: '', session_token: '', searchQuery: '', friends: "", contactData: "",contactSearchOptions:false, contactOptions: false, searchForContacts: false,selectedContact:'' };
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
        } else {
          // handle missing values
          console.log(error);
        }
      })
      .catch((error) => console.log(error));
  };

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
        console.log(data); // Handle the JSON response
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

  //  getItem = (data, index) => ({
  //   id: data[index].id,
  //   title: data[index].name,
  // });

  getItem = (friends, index) => {

    const { title, email, id } = this.state.friends[index];
    return { title, email, id };
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
        console.log(data); // Handle the JSON response
        // create an array of contacts available
        const contacts = data.map((item) => ({
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

  handleSearchForContacts = () => {
    this.setState({ searchForContacts: !this.state.searchForContacts });
  };

  handleOverlayOptions = (contact) => {
    console.log(contact);
    this.setState({ selectedContact:contact, contactOptions: !this.state.contactOptions });
  };
  handleOverlayUserOptions= (contact) => {
    console.log(contact);
    this.setState({ selectedContact:contact, contactSearchOptions: !this.state.contactSearchOptions });
  };
  handleBlockContact=()=>{
    console.log('block test: '+this.state.selectedContact);
  };
  handleRemoveContact=()=>{
    console.log('remove test: '+this.state.selectedContact);
  };

  handleAddContact=()=>{
    console.log('add test: '+this.state.selectedContact);
  };

  render() {
    return (
      <View>

        <div >
          <Button onPress={this.handleSearchForContacts} title='Search for contacts' />
          {/* <Modal transparent={true}> */}
          <div style={styles.modelContainer}>

            {/* FRIENDS CONTACTS LIST */}
            <SafeAreaView style={styles.container}>
              <Text>Friends Contacts</Text>

              <VirtualizedList
                data={this.state.friends}
                getItemCount={this.getItemCount}
                getItem={this.getItem}

                renderItem={({ item }) => {
                  console.log(item);
                  return (
                    <TouchableOpacity onPress={()=>this.handleOverlayOptions(item.id)}>
                      <View style={{ padding: 10 }}>
                        <Item title={item.title + "\n" + item.email} />
                        {/* <Text>{item.email}</Text> */}
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => (item && item.id) ? item.id.toString() : ''}
              />
            </SafeAreaView>



          </div>
          {/* </Modal> */}
        </div>

        {/* model for overlay search for contacts */}
        <Modal animationType="fade" transparent={false} visible={this.state.searchForContacts}>
          {/* ALL CONTACTS DIV BOX */}
          <Button title='Close' onPress={this.handleSearchForContacts} />
          <SafeAreaView style={styles.container}>
            {/* <Text>Search All Users</Text> */}
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text) => this.searchFilterFunction(text)}
              value={this.state.searchQuery}
              placeholder="Search..."
            />
            <VirtualizedList
              data={this.state.contactData}
              getItemCount={this.getContactItemCount}
              getItem={this.getContactItem}

              renderItem={({ item }) => {

                if (item.id == this.state.user_id) { return null; } else {
                  return (
                    <TouchableOpacity onPress={()=>this.handleOverlayUserOptions(item.id)}>
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

          </SafeAreaView>
        </Modal>
        <div >
          <Modal style={styles.optionsContainer} animationType="fade" transparent={true} visible={this.state.contactOptions}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 60 }}>
                <Button onPress={this.handleBlockContact} title='Block Contact'/>
                <Button onPress={this.handleRemoveContact} title='Remove Contact'/>
                <Button title='Close' onPress={this.handleOverlayOptions}/>
              </View>
            </View>
          </Modal>
        </div>
        {/* this.state.contactSearchOptions */}
        <div >
          <Modal style={styles.optionsContainer} animationType="fade" transparent={true} visible={this.state.contactSearchOptions}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 60 }}>
                <Button onPress={this.handleAddContact} title='Add Contact'/>
                <Button onPress={this.handleBlockContact} title='Block Contact'/>
                {/* <Button onPress={this.handleRemoveContact} title='Remove Contact'/> */}
                <Button title='Close' onPress={this.handleOverlayUserOptions}/>
              </View>
            </View>
          </Modal>
        </div>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width:'50%',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',

  },
  modelContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    height: 500,
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
    backgroundColor: 'white',
    height: 100,
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
});

export default Contact;
