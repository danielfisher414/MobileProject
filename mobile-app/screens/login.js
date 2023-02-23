import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import emailValidator from 'email-validator';
import passwordValidator from 'password-validator';
import {PasswordBox} from '../loginValidation/passwordBox';
import { EmailBox } from '../loginValidation/emailBox';
import {SuccessBox} from '../loginValidation/successBox';

// import { createNativeStackNavigator } from '@react-navigation/native-stack’

class Login extends Component {
    constructor(props){
      super(props);
      this.state = {email:'',password:''};
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
        ReactDOM.render(<EmailBox/>, document.getElementById('emailValidation'));
        ReactDOM.render(<PasswordBox/>, document.getElementById('passwordValidation'));
      } else if(emailCheck === false ){
        ReactDOM.render(<EmailBox/>, document.getElementById('emailValidation'));
      } 
      else if(passwordCheck === false ){
        ReactDOM.render(<PasswordBox/>, document.getElementById('passwordValidation'));
        
      }
      else{
        ReactDOM.render(<SuccessBox/>, document.getElementById('successValidation'));
        bothCheck=true;
      }
  
      return bothCheck;
    }
  
    validationEmail = (email)=>{
      return emailValidator.validate(email);
    }
  
    login=()=>{
      this.validationTest(this.state.email,this.state.password);
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
          <button onClick={this.login}>Login</button>
          
          <div id='successValidation'></div>
          </div>
  
          {/* {this.state.password} */}
        </View>
      );
    }
  
  }
  
  export default App