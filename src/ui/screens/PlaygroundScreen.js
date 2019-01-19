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
  PanResponder
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram } from "../../core";

export default class PlaygroundScreen extends Component {

  constructor(props) {
    super(props);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (e, gestureState) => {
        this.pressed();
      }
    });

    this.state = {
      pressCounter: 0,
    };
  }

  pressed = () => {
    this.setState({ pressCounter: this.state.pressCounter + 1 });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View
          {...this.panResponder.panHandlers}
          style={styles.touchableArea}
        />
        <Text style={{ fontSize: 70, color: "black", fontWeight: "bold" }} >{this.state.pressCounter}</Text>
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
    backgroundColor: "red"
  },
})