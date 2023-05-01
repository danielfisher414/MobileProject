import React from "react";
import { Text, StyleSheet, TouchableOpacity, TextInput, View, Button, Alert } from 'react-native';


export const EmailBox = () => {
    return(
        <View>
        <Text style={styles.label}>Please Enter A Valid Email</Text>
      </View>
    );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#f02b1d'
  },
});