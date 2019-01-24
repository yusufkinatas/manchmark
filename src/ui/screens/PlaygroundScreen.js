import React, { Component } from 'react';
import { Navigation } from "react-native-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
  Linking,
  Animated,
  Easing,
  FlatList,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram } from "../../core";
import CounterBar from "../../components/CounterBar";
import DelayedText from "../../components/DelayedText";

export default class PlaygroundScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pressCounter: 0,
    };

    this.textAnim = new Animated.Value(0);
  }

  pressed = () => {
    this.setState({ pressCounter: this.state.pressCounter + 1 });
    Animated.timing(this.textAnim, {
      duration: 250,
      toValue: 1,
      useNativeDriver: true,
      // easing: Easing.ease,
    }).start(() => {
      setTimeout(() => { this.textAnim.setValue(0) }, 250);
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
          style={{
            color: colors.secondaryLight3,
          }}
          autoCorrect={false}
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondaryDark
  },
  touchableArea: {
    position: "absolute",
    zIndex: 99,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  bigText: {
    fontSize: 20,
    color: colors.secondaryLight3,
    textAlign: "center",
    paddingHorizontal: 20
  },
})