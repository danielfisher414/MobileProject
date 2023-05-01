import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export default class LockedOverlay extends Component {

    handleCloseUnauthroisedOverlay = () => {
        window.location.reload(false);
      };
    
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 60 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20,textAlign:'center' }}>This Is Only Authorized For The Chat Creator</Text>
            <View style={{alignContent:'center',alignItems:'center'}}>
            <TouchableOpacity onPress={()=>this.handleCloseUnauthroisedOverlay()}>
              <Text style={{ color: 'blue' }}>Close</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}