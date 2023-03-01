import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';

class CreateAccount extends Component{
    constructor(props){
        super(props)
        this.state={firstName:'',lastName:'',email:'',password:''}
    }

    createAccount = () =>{
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
    });
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

  render(){
    
    return(
      
        <View>
           
            <div>       
            <h4>Enter First Name</h4>
            <TextInput placeholder='First Name'
            onChangeText={this.handleFirstNameTextChange}
            value={this.state.firstName}
            />
            <div id='emailValidation'></div>
          </div>
          <div>       
            <h4>Enter Last Name</h4>
            <TextInput placeholder='Last Name'
            onChangeText={this.handleLastNameTextChange}
            value={this.state.lastName}
            />
            <div id='emailValidation'></div>
          </div>
          <div>       
            <h4>Enter Email</h4>
            <TextInput placeholder='Email'
            onChangeText={this.handleEmailTextChange}
            value={this.state.email}
            />
            <div id='emailValidation'></div>
          </div>
          <div>       
            <h4>Enter Password</h4>
            <TextInput placeholder='Password'
            onChangeText={this.handlePasswordTextChange}
            value={this.state.password}
            />
            <div id='passwordValidation'></div>
            
          </div>

              <Button
                title="Create Account"
                onPress={this.createAccount}
      />
        </View>
    );
  }
}

export default CreateAccount;
