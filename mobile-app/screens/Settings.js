import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, Modal,SearchBar,FlatList, VirtualizedList,SafeAreaView,StatusBar,TouchableOpacity,StyleSheet  } from 'react-native';
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

// const getItemCount = () => friends.length;
// const getItem = (data, index) => ({
//   id: data[index].id,
//   title: data[index].name,
// });

// const Item = ({title}) => (
//   <View style={styles.item}>
//     <Text style={styles.title}>{title}</Text>
//   </View>
// );

const Item = ({ title }) => (
  <View>
    <Text>{title}</Text>
  </View>
);

class Settings extends Component {
  componentDidMount() {
    this.getChatInfo();
    
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
      visible: false,
      addUserName: '',
      deleteUserName: '',
      visible: false,
      data: "",
      searchQuery:'',
      
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

  getItemCount = () => {
    return this.state.data.length;
  };

  getItem = (data,index) => {
    // console.log(this.state.data[index].title);
    return this.state.data[index].title;
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
        }));
        this.setState({
          data: contacts,
        });
      })
      .catch((error) => {
        console.error(error); // Handle the error
      });
  };

  handleDeleteAUserFromChatOverlay = () => {
    this.setState({ visible: !this.state.visible });
    
    this.getContacts();
    this.setState({searchQuery:''});
  };

  addUserhandleOverlay = () => {
    this.setState({ visible: !this.state.visible });
    
    this.getContacts();
    this.setState({searchQuery:''});
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

  handleChatNameChange = () => {
    try {

      AsyncStorage.setItem('chat_name', this.state.chat_name)
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

  // getItemCount = (data) => data.length;

  // getItem = (data, index) => data[index];
  
  //  Item = ({title}) => (
  //   <View style={styles.item}>
  //     <Text style={styles.title}>{title}</Text>
  //   </View>
  // );

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


  // end of add user functions

  render() {


    return (

      <View>
        <Text>Add a user to the chat</Text>
        <TextInput placeholder='Type Their Email'
          onChangeText={this.addUserNameTextChange}
          value={this.state.addUserName}
        />
        <Button onPress={this.addUserhandleOverlay} title="add user" />

        <Text>Remove a user from the chat</Text>
        <TextInput placeholder='Type Their Email'
          onChangeText={this.deleteUserNameTextChange}
          value={this.state.deleteUserName}
        />
        <Button onPress={this.handleDeleteAUserFromChatOverlay} title="Delete a user" />

        <Text>Change Chat Name</Text>
        <TextInput placeholder='chat name'
          onChangeText={this.changeChatName}
          value={this.state.chat_name}
        />
        <Button onPress={this.handleChatNameChange} title="Change chat name" />
        
        <Modal animationType="fade" transparent={true} visible={this.state.visible}   >
        <div style={styles.modelContainer}>

              {/* <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>Select a friend</Text>
              </View> */}
    <SafeAreaView style={styles.container}>
    <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.searchFilterFunction(text)}
          value={this.state.searchQuery}
          placeholder="Search..."
        />
    {/* <SearchBar
          placeholder="Search..."
          onChangeText={searchFilterFunction}
          value={this.state.searchQuery}
        /> */}
    <VirtualizedList
        data={this.state.data}
        getItemCount={this.getItemCount}
        getItem={this.getItem}
        
        renderItem = {({ item }) => {
          // console.log("hi im a ITEM: "+item.title);
          return(
          <TouchableOpacity>
            <View style={{ padding: 10 }}>
              <Item title={item} />
            </View>
            </TouchableOpacity>
          );
        }}
    keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
    
              <Button title="Close" onPress={this.addUserhandleOverlay} />
 
              </div>
        </Modal>
        
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    // width:'50%',
    height:'80%',
    justifyContent:'center',
    alignContent:'center',
    
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
    height: '90%',
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

export default Settings;
