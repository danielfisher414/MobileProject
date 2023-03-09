import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AboutMe extends Component {
  componentDidMount() {
    this.getUserInfo();
  }

  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      user_id: '',
      session_token: '',
    };
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  setUserInfo = () => {
    fetch('http://localhost:3333/api/1.0.0/user/' + this.state.user_id, {
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
        console.log(data); // Handle the JSON response
        this.setState({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
        });
      })
      .catch((error) => {
        console.error(error); // Handle the error
      });
  };

  getUserInfo = () => {
    Promise.all([
      AsyncStorage.getItem('user_id'),
      AsyncStorage.getItem('session_token'),
    ])
      .then(([user_id, session_token]) => {
        if (user_id && session_token) {
          this.setState({ user_id, session_token }, () => {
            this.setUserInfo();
          });
        } else {
          // handle missing values
        }
      })
      .catch((error) => console.log(error));
  };

  logout = () => {
    try {
      AsyncStorage.removeItem('user_id');
      AsyncStorage.removeItem('session_token');
      console.log('Item removed successfully');
      window.location.reload(false);
    } catch (error) {
      console.log('Error removing item:', error);
    }
  };

  handleEditProfile = () =>{
    const { navigation } = this.props;
    navigation.navigate('Edit Profile');
  };
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
                  <Image
              style={styles.profilePic}
              source={{ uri: 'https://www.ateneo.edu/sites/default/files/styles/large/public/2021-11/istockphoto-517998264-612x612.jpeg?itok=aMC1MRHJ' }}
          />
          </View>
        <View style={styles.aboutContainer}>
          <Text style={styles.name}>
            {this.state.first_name} {this.state.last_name}
          </Text>
          <Text style={styles.email}>{this.state.email}</Text>
        </View>
        <Button title="Edit Profile" onPress={this.handleEditProfile}/>
        <Button title="Logout" onPress={this.logout} />
      </View>
    );
  }
}

    // container: {
    //     backgroundColor:'white',
    //     flex: 1,
    //     alignItems: 'center',
    //     // justifyContent: 'center',
    //     padding: 1,
    // },
    // container: {
    //   flex: 1,
    //   backgroundColor: 'white',
    //   padding: 20,
    //   gap:7
    // },
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    gap:7
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
    gap:7
  },
  profilePic: {
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 20,
},
  aboutContainer: {
    marginTop: 50,
    marginBottom: 30,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#777',
    marginBottom: 10,
  },
  // profileBtn: {
  //   // fontSize: 18,
  //   // color: '#777',
  //   justifyContent: 'space-between',
  // },
});

export default AboutMe;
