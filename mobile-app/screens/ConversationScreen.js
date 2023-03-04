import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

class ConversationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageInput: '',
      messages: [],
    };
  }

  onSendMessage = () => {
    const { messageInput, messages } = this.state;
    if (messageInput.trim() !== '') {
      const newMessages = messages.slice();
      newMessages.push(messageInput);
      this.setState({ messages: newMessages, messageInput: '' });
    }
  };

  renderMessage = (message, index) => {
    return (
      <View style={styles.messageContainer} key={index}>
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    );
  };

  render() {
    const { messageInput, messages } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.messagesContainer}>
          {messages.map(this.renderMessage)}
        </View>
        <KeyboardAvoidingView
          style={styles.inputContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({ messageInput: text })}
            value={messageInput}
            placeholder="Type a message..."
            placeholderTextColor="#8a8a8f"
            returnKeyType="send"
            onSubmitEditing={this.onSendMessage}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={this.onSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#0084ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderTopColor: '#d9d9d9',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#f2f2f2',
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#0084ff',
    borderRadius: 18,
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ConversationScreen;
