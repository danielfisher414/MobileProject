import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Navigation} from '../navigation';


class CreateAccount extends Component{
    constructor(props){
        super(props)
        this.state={firstName:'',lastName:'',email:'',password:''}
    }

    handleFirstNameTextChange=(newtext)=>{
        this.setState({firstName:newtext})
      };

    handleLastNameTextChange=(newtext)=>{
        this.setState({lastName:newtext})
      };

    handleEmailTextChange=(newtext)=>{
        this.setState({email:newtext})
    };

    handlePasswordTextChange=(newtext)=>{
        this.setState({password:newtext})
    };
    CreateAccount = () =>{
        alert(1);
    }
  
  render(){
    
    return(
      
        <View>
            {/* start of text inputs */}
            <div>       
            <h4>Enter First Name</h4>
            <TextInput placeholder='First Name'
            // onChangeText={this.handleEmailTextChange}
            value={this.state.firstName}
            />
            <div id='emailValidation'></div>
          </div>
          <div>       
            <h4>Enter Last Name</h4>
            <TextInput placeholder='Last Name'
            // onChangeText={this.handleEmailTextChange}
            value={this.state.lastName}
            />
            <div id='emailValidation'></div>
          </div>
          <div>       
            <h4>Enter Email</h4>
            <TextInput placeholder='Email'
            // onChangeText={this.handleEmailTextChange}
            value={this.state.email}
            />
            <div id='emailValidation'></div>
          </div>
          <div>       
            <h4>Enter Password</h4>
            <TextInput placeholder='Password'
            // secureTextEntry={true}
            // onChangeText={this.handlePasswordTextChange}
            value={this.state.password}
            />
            <div id='passwordValidation'></div>
            
          </div>

            {/* end of text inputs */}
              <Button
                title="Create Account"
                onPress={this.CreateAccount}
      />
        </View>
    );
  }
}

export default CreateAccount;