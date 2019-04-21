import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

//type Props = {};
export default class App extends Component {
  state ={
    placeName:""
  }

  placeNameChangedHandler = (val) => {
    //alert(val);
    this.setState({
      placeName: val
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput 
          style={{width: 300}}
          placeholder="An awesome place"
          value={this.state.placeName} 
          onChangeText={this.placeNameChangedHandler} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
  }
});
