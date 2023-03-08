import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet, Image } from 'react-native';
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
    render() {
        return (
          <View style={styles.container}>
            <Image
              style={styles.profilePic}
              source={{ uri: 'https://www.example.com/profile-picture.jpg' }}
            />
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.bio}>Software Engineer</Text>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statTitle}>Followers</Text>
                <Text style={styles.statValue}>1,234</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statTitle}>Following</Text>
                <Text style={styles.statValue}>567</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statTitle}>Posts</Text>
                <Text style={styles.statValue}>89</Text>
              </View>
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
        padding: 20,
      },
      profilePic: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      bio: {
        fontSize: 18,
        marginBottom: 20,
      },
      statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      stat: {
        alignItems: 'center',
      },
      statTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      statValue: {
        fontSize: 16,
      },
    });

