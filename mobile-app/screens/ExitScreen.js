import React, { Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ExitScreen = () => {

  useEffect(() => {
    try {
      AsyncStorage.removeItem('chat_id');
      AsyncStorage.removeItem('chat_name');
      AsyncStorage.removeItem('chat_creator_id');
      console.log('Item removed successfully');
      window.location.reload(false);
    } catch (error) {
      console.log('Error removing item:', error);
    }
  });


    
    return(
      
        <View>
        </View>
    );
    
};

export default ExitScreen;
