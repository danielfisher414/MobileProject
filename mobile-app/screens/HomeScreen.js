import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';

class HomeScreen extends Component{

  handleAboutMe = () =>{
    const { navigation } = this.props;
    navigation.navigate('AboutMe');
  };
  
  render(){
    
    return(
      
        <View>
          <Text>Home Screen!</Text>
              <Button 
                title="Go to About Me"
                onPress={this.handleAboutMe}
      />
        </View>
    );
  }
}

export default HomeScreen;
