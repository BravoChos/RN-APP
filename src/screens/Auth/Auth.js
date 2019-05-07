import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground } from 'react-native';

import startMainTabs from '../MainTabs/startMainTabs';
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import MainText from "../../components/UI/MainText/MainText";
import BackgroundImage from  '../../assets/background.jpg';
import ButtonWithBackground from "../../components/UI/ButtonWithBackground/ButtonWithBackground";

class AuthScreen extends Component {
    loginHandler = () => {
        startMainTabs();
    }

    render () {
        return (
            <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
                <View style={styles.container}>
                    <MainText>
                        <HeadingText>Please Log In</HeadingText>
                    </MainText>
                    <ButtonWithBackground color="#29aaf4" onPress={() => alert("Hello")}>
                        Switch to Login
                    </ButtonWithBackground>
                    <View style={styles.inputContainer}>
                        <DefaultInput
                            placeholder="Your E-Mail Address"
                            style={styles.input}
                        />
                        <DefaultInput placeholder="Password" style={styles.input} />
                        <DefaultInput placeholder="Confirm Password" style={styles.input} />
                    </View>
                    <ButtonWithBackground color="#29aaf4" onPress={this.loginHandler}>
                        Submit
                    </ButtonWithBackground>
                </View>
          </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    backgroundImage: {
        width: "100%",
        flex: 1,
    },
    inputContainer: {
        width: "80%"
    },
    input: {
        backgroundColor: "#eee",
        borderColor: "#bbb"
    }
});

export default AuthScreen;