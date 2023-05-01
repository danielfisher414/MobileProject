import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
// import ApiService from '../services/ApiService'

class AboutMe extends Component {
  componentDidMount() {
    // this.refreshInterval = setInterval(this.getUserInfo(), 1000);
    // this.refreshInterval = setInterval(this.handleGetUserPhoto(), 1000);
      this.handleGetUserPhoto();
      this.getUserInfo();
    // this.refreshInterval = setInterval(() => {
    //   this.handleGetUserPhoto();
    //   this.getUserInfo();
    // }, 1000);
    // this.apiService.getUserInfo()
    // .then(() => {
    //   const { user_id, session_token } = this.apiService.getState();
    //   this.setState({ user_id, session_token });
    // })
    // .catch((error) => console.log(error));
  }

  constructor(props) {
    super(props);
    // this.apiService = new ApiService();
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      user_id: '',
      session_token: '',
      userProfilePic: 'https://www.ateneo.edu/sites/default/files/styles/large/public/2021-11/istockphoto-517998264-612x612.jpeg?itok=aMC1MRHJ',
    };
    // this.getUserInfo = this.getUserInfo.bind(this);
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
            this.handleGetUserPhoto();
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


  handleGetUserPhoto = () => {
    // Create a new FormData object
    // console.log(file)



    // Make a POST request to upload the file
    fetch('http://localhost:3333/api/1.0.0/user/' + this.state.user_id + '/photo', {
        method: 'GET',
        headers: {
            Accept: 'image/png',
            'Content-Type': 'image/png',
            'X-Authorization': this.state.session_token,
        },
    })
        .then(response => {

            if (response.status === 200) {
                // Success
                // alert(response.blob());
                return response.blob(); // Return the JSON response
            } else {
                // Error

                throw new Error('Something went wrong');
            }
        })
        .then(data => {
            console.log("data here: " + data); // Handle the JSON response
            
            
            const imageUrl = URL.createObjectURL(data);
            console.log(imageUrl);
            
            this.setState({ userProfilePic: imageUrl })
            
        })
        .catch(error => {
            console.error(error.message); // Handle the error
            // console.error(error.response); // Handle the error
        });
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
              source={{ uri: this.state.userProfilePic }}
          />
          </View>
          <View>
        <View style={styles.aboutContainer}>
          <Text style={styles.name}>
            {this.state.first_name} {this.state.last_name}
          </Text>
          <Text style={styles.email}>{this.state.email}</Text>
        </View>
        <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
          <TouchableOpacity style={styles.button} onPress={this.handleEditProfile}><Text style={styles.buttonText}>Edit Profile</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}  onPress={this.logout}><Text  style={styles.buttonText}>Logout</Text></TouchableOpacity>
        </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 30,
    gap:7
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 15,
    gap:7
  },
  profilePic: {
    alignItems: 'center',
    width: 230,
    height: 230,
    borderRadius: 130,
    marginBottom: 10,
    marginTop: 20,
  },
  aboutContainer: {
    marginTop: 30,
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
  button:{
    backgroundColor:'#1e90ff',
    padding:15,
    borderRadius:5
  },
  buttonText:{
    color:'white',
    fontWeight:'bold'
  }

});

export default AboutMe;
