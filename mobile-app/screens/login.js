import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Text, StyleSheet, TouchableOpacity, Modal, TextInput, View, Button, Alert } from 'react-native';
import emailValidator from 'email-validator';
import passwordValidator from 'password-validator';
import { PasswordBox } from '../loginValidation/passwordBox';
import { EmailBox } from '../loginValidation/emailBox';
import { SuccessBox } from '../loginValidation/successBox';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', id: '', token: '', showBadRequestMsg: false, successMsg: false, emailError: false, passwordError: false };
    this.handleLogin = this.handleLogin.bind(this);
  };



  handleLogin = () => {
    try {
      AsyncStorage.setItem('user_id', this.state.id)
      AsyncStorage.setItem('session_token', this.state.token)
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

  createAccount = () => {
    const { navigation } = this.props;
    navigation.navigate('CreateAccount');
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

  validationTest = (email, password) => {
    this.setState({ showBadRequestMsg: false })
    let bothCheck = false;
    let emailCheck = this.validationEmail(email);
    let passwordCheck = this.validatePassword(password);

    if (emailCheck === true && passwordCheck === true) {
      // this.setState({emailError:'Please enter a valid email address'});
      // ReactDOM.render(<EmailBox />, document.getElementById('emailValidation'));
      this.setState({ emailError: false });
      this.setState({ passwordError: false });
      // ReactDOM.render(<PasswordBox />, document.getElementById('passwordValidation'));
      // this.setState({successMsg:true});
      bothCheck = true;
    }

    if (emailCheck === false) {
      this.setState({ emailError: true });

    } else if (emailCheck === true) {
      this.setState({ emailError: false });

    }
    if (passwordCheck === false) {
      this.setState({ passwordError: true });

    } else if (passwordCheck === true) {
      this.setState({ passwordError: false });

    }

    return bothCheck;
  }

  validationEmail = (email) => {
    return emailValidator.validate(email);
  }

  login = () => {


    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then(response => {
        if (response.status === 200) {
          // Success
          this.setState({ showBadRequestMsg: false })
          return response.json(); // Return the JSON response
        } else if (response.status === 400) {
          // alert('invalid email/password');
          this.setState({ showBadRequestMsg: true })
        }
      })
      .then(data => {
        // retrieving the user id and token
        this.state.id = data.id;
        this.state.token = data.token;
        this.handleLogin();
      })
      .catch(error => {
        console.error(error); // Handle the error
      });




  };

  handleEmailTextChange = (newtext) => {
    this.setState({ email: newtext })
  };

  handlePasswordTextChange = (newtext) => {
    this.setState({ password: newtext })
  };


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>WhatsThat?</Text>
        </View>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>

          <View>

            <Text style={styles.label}>Enter Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={this.handleEmailTextChange}
            />

            {/* <TextInput placeholder='email'
              onChangeText={this.handleEmailTextChange}
              value={this.state.email}
            /> */}
            {/* <div id='emailValidation'></div> */}
            {this.state.emailError ? (<EmailBox />) : null}
            {/* {this.state.emailError ? (
            <Text style={styles.error}>{this.state.emailError}</Text>
          ) : null} */}

          </View>
          <View>

            <Text style={styles.label}>Enter Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={this.state.password}
              onChangeText={this.handlePasswordTextChange}
            />

            {/* <TextInput placeholder='password'
              secureTextEntry={true}
              onChangeText={this.handlePasswordTextChange}
              value={this.state.password}
            /> */}
            {/* <div id='passwordValidation'></div> */}
            {/* <View style={{width:'80%',alignContent:'center'}}>
            {this.state.passwordError ? (<PasswordBox/>):null}
            </View> */}
          </View>

          {/* test */}
          {this.state.showBadRequestMsg ? (
            <Text style={styles.labelError}>Invalid Email/Password</Text>
          ) : null}
        </View>
        <View style={{ width: '80%' }}>
          <TouchableOpacity style={styles.button} onPress={this.login}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createAccountButton} onPress={this.createAccount}>
            <Text style={styles.createAccountButtonText}>Create an account</Text>
          </TouchableOpacity>
          {/* end of test */}
          {/* <Button title="Login" onPress={this.login} /> */}
          {/* <Button title="Create An Account" onPress={this.createAccount} /> */}
          {/* <Button title="hangleLogin" onPress={this.handleLogin} /> */}
          {this.state.successMsg ? (<SuccessBox />) : null}
          {/* <div id='successValidation'></div> */}
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
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    height: 50,
    margin:20,
  },
  titleText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    // alignItems: 'center',
    marginBottom: 30,
    marginLeft: 70,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    paddingRight: 30,
    width: '80%',
    alignContent: 'center',

  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createAccountButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  createAccountButtonText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  labelError: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#f02b1d'
  },
});

export default Login;