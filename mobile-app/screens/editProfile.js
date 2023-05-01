import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, Modal, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from 'react-chat-elements';
import passwordValidator from 'password-validator';

import emailValidator from 'email-validator';


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
            password: '',
            user_id: '',
            session_token: '',
            visible: false,
            testOriginalPassword: '',
            newPassword: '',
            newPassword2: '',
            userProfilePic: 'https://www.ateneo.edu/sites/default/files/styles/large/public/2021-11/istockphoto-517998264-612x612.jpeg?itok=aMC1MRHJ',
            isValidEmail: true,
            isValidFirstName: true,
            isValidLastName: true,
            passwordChanged: null,
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

    validationEmail = (email) => {
        return emailValidator.validate(email);
    }


    handleUpdateProfile = () => {

        let emailCheck = this.validationEmail(this.state.email);

        if (this.state.first_name.length == 0) {
            this.setState({ isValidFirstName: false })
            return;
        } else {
            this.setState({ isValidFirstName: true })
        }

        if (this.state.last_name.length == 0) {
            this.setState({ isValidLastName: false })
            return;
        } else {
            this.setState({ isValidLastName: true })
        }

        if (emailCheck == false) {
            this.setState({ isValidEmail: false })
            return;
        } else {
            this.setState({ isValidEmail: true })
        }



        fetch('http://localhost:3333/api/1.0.0/user/' + this.state.user_id, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Authorization': this.state.session_token,
            },
            body: JSON.stringify({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
            }),
        })
            .then(response => {
                if (response.status === 200) {
                    // Success
                    window.location.reload(false);
                    if (response.headers.get("Content-Type").indexOf("application/json") !== -1) {

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
                if (typeof data === "object") {
                    console.log(data); // Handle the JSON response
                    this.setState({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,

                    });

                } else {
                    console.log(data); // Handle the plain text response
                }
            })
            .catch(error => {
                console.error(error); // Handle the error
            });
    };
    handleUpdatePassword = () => {
        let validatePassword = this.validatePassword(this.state.newPassword);
        if (this.state.newPassword === this.state.newPassword2 && validatePassword) {



            this.setState({ password: this.state.newPassword });

            fetch('http://localhost:3333/api/1.0.0/user/' + this.state.user_id, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Authorization': this.state.session_token,
                },
                body: JSON.stringify({
                    password: this.state.password
                }),
            })
                .then(response => {
                    console.log(response.status)
                    if (response.status === 200) {
                        // Success
                        console.log(this.state.password);
                        this.setState({ passwordChanged: true })

                    } else {
                        this.setState({ passwordChanged: false })
                    }
                })
                .catch(error => {
                    console.error(error); // Handle the error
                });

        } else {
            this.setState({ passwordChanged: false })
        }

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

    goBack = () => {
        const { navigation } = this.props;
        navigation.navigate('Profile');
    };

    handleFirstNameTextChange = (newtext) => {
        this.setState({ first_name: newtext })
    };

    handleLastNameTextChange = (newtext) => {
        this.setState({ last_name: newtext })
    };

    handleEmailTextChange = (newtext) => {
        this.setState({ email: newtext })
    };

    handlePasswordTextChange = (newtext) => {
        this.setState({ password: newtext })
    };
    handleOverlay = () => {
        this.setState({ visible: !this.state.visible });
    };

    handleFirstNameTextChange = (newtext) => {
        this.setState({ first_name: newtext })
    };

    handleFirstNewPassword = (newtext) => {
        this.setState({ newPassword: newtext })
    };

    handle2ndNewPassword = (newtext) => {
        this.setState({ newPassword2: newtext })
    };

    handleOriginalPassword = (newtext) => {
        this.setState({ testOriginalPassword: newtext })
    };


    validatePassword = (password) => {
        const schema = new passwordValidator();

        schema
            .is().min(8)  // Minimum length 8
            .is().max(100)  // Maximum length 100
            .has().uppercase()  // Must have uppercase letters
            .has().lowercase()  // Must have lowercase letters
            .has().digits()  // Must have digits
            .has().symbols()
            .has().not().spaces()  // Should not have spaces
            .is().not().oneOf(['Passw0rd', 'Password123']);  // Blacklist these values

        if (schema.validate(password)) {
            return true;
        } else {
            return false;
        }
    }

    handleFileUpload = (file) => {
        // Create a new FormData object
        // console.log(file)


        // const formData = new FormData();
        // formData.append('file', file);

        // console.log("formData: " + file.toString());
        // Make a POST request to upload the file
        fetch('http://localhost:3333/api/1.0.0/user/' + this.state.user_id + '/photo', {
            method: 'POST',
            headers: {
                Accept: '/',
                'Content-Type': 'image/png',
                'X-Authorization': this.state.session_token,
            },
            body: file
        })
            .then(response => {

                if (response.status === 200) {
                    // Success

                    this.handleGetUserPhoto();
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


    render() {
        return (
            <View style={styles.container}>

                {/* <Text style={styles.headerName}>Edit Profile</Text> */}

                <Image
                    style={styles.profilePic}
                    source={{ uri: this.state.userProfilePic }}
                />
                <Text style={styles.name}>{this.state.first_name} {this.state.last_name}</Text>
                <View style={styles.changeProfileInputs}>

                    <View style={styles.pictureBox}>
                        <Text style={styles.btnTitle}>Choose an img</Text>
                        <input
                            style={{ margin: 0, padding: 0 }}
                            type="file"
                            onChange={(event) => this.handleFileUpload(event.target.files[0])}
                        />
                    </View>
                    <View >
                        <View>
                            <Text style={styles.btnTitle}>First Name</Text>
                            <TextInput style={styles.editProfileInputs} placeholder='first name'
                                onChangeText={this.handleFirstNameTextChange}
                                value={this.state.first_name} />
                            {this.state.isValidFirstName == false ? (<View><Text style={styles.labelError}>Please Type In A First Name</Text></View>) : null}
                        </View>
                        <View>
                            <Text style={styles.btnTitle}>Last Name</Text>
                            <TextInput style={styles.editProfileInputs} placeholder='last name'
                                onChangeText={this.handleLastNameTextChange}
                                value={this.state.last_name} />
                            {this.state.isValidLastName == false ? (<View><Text style={styles.labelError}>Please Type In A Last Name</Text></View>) : null}
                        </View>
                        <View>
                            <Text style={styles.btnTitle}>Email</Text>
                            <TextInput style={styles.editProfileInputs} placeholder='email'
                                onChangeText={this.handleEmailTextChange}
                                value={this.state.email} />
                            {this.state.isValidEmail == false ? (<View><Text style={styles.labelError}>Please Type In A Valid Email</Text></View>) : null}


                        </View>

                    </View>
                    <View style={styles.profileButtons}>
                        <Button title='Change Password' onPress={this.handleOverlay} />
                        <Button title="Change Profile" onPress={this.handleUpdateProfile} />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Button title="Go Back" onPress={this.goBack} />
                    </View>

                </View>

                {/* OVERLAY */}
                <Modal animationType="fade" transparent={true} visible={this.state.visible}>
                    <View style={styles.overlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Change Password</Text>
                            {/* <View style={styles.inputContainer}>
                                <Text style={styles.label}>Original Password</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={this.handleOriginalPassword}
                                    value={this.state.testOriginalPassword}
                                    secureTextEntry={true}
                                />
                            </View> */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={this.handleFirstNewPassword}
                                    value={this.state.newPassword}
                                    secureTextEntry={true}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Verify New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={this.handle2ndNewPassword}
                                    value={this.state.newPassword2}
                                    secureTextEntry={true}
                                />
                            </View>
                            {this.state.passwordChanged === true ? (<View><Text style={{ color: '#34C759' }}>Password Has Changed</Text></View>) :
                                this.state.passwordChanged === false ? (<View><Text style={{ color: '#DC143C' }}>Password Has Not Changed</Text></View>) : null}
                            <View style={styles.buttonContainer}>
                                <Button title="Change Password" onPress={this.handleUpdatePassword} />
                                <View style={{ marginTop: 10 }}>
                                    <Button title="Close" onPress={this.handleOverlay} />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* END OF OVERLAY */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        padding: 1,
    },
    headerName: {
        fontSize: 20,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    profilePic: {
        alignItems: 'center',
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
        marginTop: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        // marginBottom: 20,
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
        width: '80%',
    },
    pictureBox: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        marginVertical: 10,
        // alignContent:'center',
        // textAlign:'center',
    },
    profileButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'flex-start',
        // justifyContent: 'flex-start',
        justifyContent: 'space-evenly',

        // borderWidth:1,
        // borderColor:'black',
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // width: '80%',
    },
    editProfileInputs: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginBottom: 10,
        padding: 5,
        // width:'50%',
    },
    btnTitle: {
        fontSize: 16,

    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%'
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%'
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 10,
        width: '100%'
    },
    labelError: {
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#f02b1d'
    },
});

export default EditProfile;