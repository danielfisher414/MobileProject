import React, { Component } from 'react';
import ReactDOM  from 'react-dom';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import emailValidator from 'email-validator';
import passwordValidator from 'password-validator';
import {PasswordBox} from '../loginValidation/passwordBox';
import { EmailBox } from '../loginValidation/emailBox';
import {SuccessBox} from '../loginValidation/successBox';
import { useNavigation } from '@react-navigation/native';
import {Navigation} from '../navigation';
// import { createNativeStackNavigator } from '@react-navigation/native-stack’

class Login extends Component {
    constructor(props){
      super(props);
      this.state = {email:'',password:''};
    };

    
  handleLogin = () => {
    const { navigation } = this.props;
    const isAuthenticated = true;
    navigation.navigate('Home', { isAuthenticated });
  };

  createAccount= () => {
    const { navigation } = this.props;
    navigation.navigate('CreateAccount');
  };
  
  validatePassword = (password) =>{
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

    validationTest = (email,password)=>{
      
      

      let bothCheck=false;
      let emailCheck=this.validationEmail(email);
      let passwordCheck=this.validatePassword(password);
  
      

      if(emailCheck===false && passwordCheck===false){
       
        // here
        ReactDOM.render(<EmailBox/>, document.getElementById('emailValidation'));
        ReactDOM.render(<PasswordBox/>, document.getElementById('passwordValidation'));
        
      } else if(emailCheck === false ){
        ReactDOM.render(<EmailBox/>, document.getElementById('emailValidation'));
      } 
      else if(passwordCheck === false ){
       
        ReactDOM.render(<PasswordBox/>, document.getElementById('passwordValidation'));
        
      }
      else{
        // this.handleLogin();
        ReactDOM.render(<SuccessBox/>, document.getElementById('successValidation'));
        bothCheck=true;
        
        
      }

      
  
      return bothCheck;
    }
  
    validationEmail = (email)=>{
      return emailValidator.validate(email);
    }
  
    login=()=>{
      
      if(this.validationTest(this.state.email,this.state.password)==true){
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
            // go to main page
            this.handleLogin();
            // return response.json(); // Return the JSON response
          } else {
            // Error
            alert(this.state.email+" "+this.state.password)
            throw new Error('Something went wrong');
          }
        })
        .then(data => {
          console.log(data); // Handle the JSON response
        })
        .catch(error => {
          console.error(error); // Handle the error
        });
          
      }
      

    };
    
    handleEmailTextChange=(newtext)=>{
      this.setState({email:newtext})
    };
  
    handlePasswordTextChange=(newtext)=>{
      this.setState({password:newtext})
    };
  
    render() {
      return (
        <View>
          <div>
          <div>       
            <h4>Enter Email</h4>
            <TextInput placeholder='email'
            onChangeText={this.handleEmailTextChange}
            value={this.state.email}
            />
            <div id='emailValidation'></div>
          </div>
          <div>       
            <h4>Enter Password</h4>
            <TextInput placeholder='password'
            secureTextEntry={true}
            onChangeText={this.handlePasswordTextChange}
            value={this.state.password}
            />
            <div id='passwordValidation'></div>
            
          </div>
          <Button title="Login" onPress={this.login}/>
          <Button title="Create An Account" onPress={this.createAccount}/>

          
          <div id='successValidation'></div>
          </div>
  
          
        </View>
      );
    }
  
  }
  
  export default Login;