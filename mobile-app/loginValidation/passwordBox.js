import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PasswordBox = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password is not strong enough.</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>- Must have 8 or more characters</Text>
        <Text style={styles.listItem}>- Must have upper and lower case letters</Text>
        <Text style={styles.listItem}>- Must have digits and a special character</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'#f02b1d'
  },
  list: {
    marginLeft: 16,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 4,
    color:'#f02b1d'
  },
});

// export default PasswordBox;
