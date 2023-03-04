import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.aboutContainer}>
          <Text style={styles.name}>
            {this.state.first_name} {this.state.last_name}
          </Text>
          <Text style={styles.email}>{this.state.email}</Text>
        </View>
        <Button title="Logout" onPress={this.logout} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
});

export default AboutMe;
