import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from 'react-chat-elements';

class EditProfile extends Component {
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
                <Text style={styles.headerName}>Edit Profile</Text>
                <Image
                    style={styles.profilePic}
                    source={{ uri: 'https://www.ateneo.edu/sites/default/files/styles/large/public/2021-11/istockphoto-517998264-612x612.jpeg?itok=aMC1MRHJ' }}
                />
                <Text style={styles.name}>John Doe</Text>
                <View style={styles.changeProfileInputs}>
                    <TextInput style={styles.editProfileInputs}
                     multiline={true} onChangeText={this.onChangeText} value={this.state.text}
                     placeholder='Drag Image or img link'
                    />
                    <TextInput style={styles.editProfileInputs} placeholder='first name' />
                    <TextInput style={styles.editProfileInputs} placeholder='last name' />
                    <TextInput style={styles.editProfileInputs} placeholder='email' />
                    <TextInput style={styles.editProfileInputs} placeholder='password' />
                    <Button title="Change Profile" />
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
    headerName: {
        fontSize: 20,
        marginBottom: 50,
        fontWeight: 'bold',
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    changeProfileInputs: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        // justifyContent: 'center',
        // borderWidth:1,
        // borderColor:'black',
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        width: '60%',
    },
    editProfileInputs: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginBottom: 20,
        padding: 5,
        // width:'50%',
    }
});

export default EditProfile;