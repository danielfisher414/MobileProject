import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Modal } from 'react-native';
import { EmailBox } from '../loginValidation/emailBox';
import { PasswordBox } from '../loginValidation/passwordBox';
import { SuccessBox } from '../loginValidation/successBox';
import emailValidator from 'email-validator';
import passwordValidator from 'password-validator';

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {success:false, firstName: '', lastName: '', email: '', password: '', overlayMessage:'',firstNameErrorMsg: '', lastNameErrorMsg: '', showBadRequestMsg: false, successMsg: false, emailError: false, passwordError: false };
  }

  firstNameValidation = (firstName) => {
    if (firstName.length > 0) {
      return true;
    } else { return false; }
  }
  lastNameValidation = (lastName) => {
    if (lastName.length > 0) {
      return true;
    } else { return false; }
  }

  validationTest = (firstName, lastName, email, password) => {

    let validationCheck = false;
    let emailCheck = this.validationEmail(email);
    let passwordCheck = this.validatePassword(password);
    let firstNameCheck = this.firstNameValidation(firstName);
    let lastNameCheck = this.lastNameValidation(lastName);;

    if (firstNameCheck == false) {
      this.setState({ firstNameErrorMsg: 'Please Enter A Valid First Name' })
    } else {
      this.setState({ firstNameErrorMsg: '' })
    }
    if (lastNameCheck == false) {
      this.setState({ lastNameErrorMsg: 'Please Enter A Valid Last Name' })
    } else {
      this.setState({ lastNameErrorMsg: '' })
    }
    if (emailCheck == false) {
      this.setState({ emailError: true });
      // this.setState({ passwordError: true });
    } else {
      this.setState({ emailError: false });
      // this.setState({ passwordError: false });
    }
    if (passwordCheck == false) {
      // this.setState({ emailError: true });
      this.setState({ passwordError: true });
    } else {
      // this.setState({ emailError: false });
      this.setState({ passwordError: false });
    }

    
    // if (emailCheck === false && passwordCheck === false) {
    //   // this.setState({emailError:'Please enter a valid email address'});
    //   // ReactDOM.render(<EmailBox />, document.getElementById('emailValidation'));
    //   this.setState({emailError:true});
    //   this.setState({passwordError:true});
    //   // ReactDOM.render(<PasswordBox />, document.getElementById('passwordValidation'));

    // } else if (emailCheck === false) {
    //   // ReactDOM.render(<EmailBox />, document.getElementById('emailValidation'));
    //   this.setState({emailError:true});
    // }
    // else if (passwordCheck === false) {
    //   this.setState({passwordError:true});
    //   // ReactDOM.render(<PasswordBox />, document.getElementById('passwordValidation'));
    // }
    if (firstNameCheck === true && lastNameCheck === true && emailCheck === true && passwordCheck === true) {
      validationCheck = true;
    }
    return validationCheck;
  }

  validationEmail = (email) => {
    return emailValidator.validate(email);
  }

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

  createAccount = () => {
    if (this.validationTest(this.state.firstName, this.state.lastName, this.state.email, this.state.password) == true) {

      fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          email: this.state.email,
          password: this.state.password,
        }),
      })
        .then(response => {
           if (response.status === 201) {
            // throw new Error('Bad Request');
            // alert("The User Already Exists");
            // overlay show
            this.setState({overlayMessage:'Success Your Account Has Been Created'})
            this.setState({ showBadRequestMsg: true });
            this.setState({ success: true });
          }else if (response.status === 400) {
            // throw new Error('Bad Request');
            // alert("The User Already Exists");
            this.setState({overlayMessage:'Sorry But That Account Already Exists \n Please Change Email Address'})
            this.setState({ showBadRequestMsg: true });
          }
          // return response.json();
        })
    }
  };

  handleFirstNameTextChange = (newText) => {
    this.setState({ firstName: newText });
  };

  handleLastNameTextChange = (newText) => {
    this.setState({ lastName: newText });
  };

  handleEmailTextChange = (newText) => {
    this.setState({ email: newText });
  };

  handlePasswordTextChange = (newText) => {
    this.setState({ password: newText });
  };
  handleOverlay = () => {
    if(this.state.success==true){
      this.props.navigation.goBack();
    }else{this.setState({ showBadRequestMsg: !this.state.showBadRequestMsg })};
  };

  render() {
    return (
      <View style={styles.container}>
        {/* Start of Overlay */}
        
        {this.state.showBadRequestMsg ? (
          <Modal animationType="fade" transparent={true} visible={this.state.showBadRequestMsg}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>{this.state.overlayMessage}</Text>
                <Button title="Close" onPress={this.handleOverlay} />
              </View>
            </View>
          </Modal>
        ) : null}

        {/* End of Overlay */}
        
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              onChangeText={this.handleFirstNameTextChange}
              value={this.state.firstName}
            />
            <Text style={styles.labelError}>{this.state.firstNameErrorMsg}</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              onChangeText={this.handleLastNameTextChange}
              value={this.state.lastName}
            />
            <Text style={styles.labelError}>{this.state.lastNameErrorMsg}</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              onChangeText={this.handleEmailTextChange}
              value={this.state.email}
            />
            {this.state.emailError ? (<EmailBox />) : null}
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={this.handlePasswordTextChange}
              value={this.state.password}
            />
            {this.state.passwordError ? (<PasswordBox />) : null}
          </View>

          <View style={{ marginBottom: 20 }}>
            <Button style={styles.CreatAccountBtn} title="Create Account" onPress={this.createAccount} />
            {/* <Button onPress={this.goBack} title="goBack"/> */}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginTop: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  labelError: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#f02b1d'
  },
});

export default CreateAccount;
