import React from 'react';
import { Text, StyleSheet, TouchableOpacity, TextInput, View, Button, Alert } from 'react-native';

export const SuccessBox = ()=>{
    return(

            <View>
        <Text style={styles.label}>Success</Text>
      </View>
    );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});