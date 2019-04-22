import React, {Component} from 'react';
import {Platform, StyleSheet, Button, View, TextInput, Text} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

//type Props = {};
export default class App extends Component {
  state ={
    placeName:"",
    places:[]
  }

  placeNameChangedHandler = (val) => {
    //alert(val);
    this.setState({
      placeName: val
    });
  };

  placeSubmitHandler = () => {
    if (this.state.placeName.trim() === "") {
      return;
    }

    this.setState(prevState => {
      return {
        places: prevState.places.concat(prevState.placeName)
      }
    })
  }

  render() {
    const placesOutput = this.state.places.map((place,index)=>(
        <Text key={index}>
          {place}
        </Text>
    ));
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={{width: 300}}
            placeholder="An awesome places"
            value={this.state.placeName} 
            onChangeText={this.placeNameChangedHandler} 
            style ={styles.placeInput}
          />
          <Button title="Add" style={styles.placeButton} onPress={this.placeSubmitHandler}/>
        </View>
        <View>
          {placesOutput}
        </View>
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
  },
  inputContainer: {
    //flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  placeInput: {
    width: "70%"
  },
  placeButton: {
    width: "30%"
  }
});
