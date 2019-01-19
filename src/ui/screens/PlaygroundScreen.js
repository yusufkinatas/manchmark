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
  Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram } from "../../core";

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
      duration: 500,
      toValue: 1,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start(() => {
      setTimeout(() => { this.textAnim.setValue(0) }, 250);
    });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity activeOpacity={1} style={styles.touchableArea} onPress={this.pressed} />
        <Animated.View
          style={{
            scaleX: this.textAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.5]
            }),
            scaleY: this.textAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.5]
            }),
            translateY: this.textAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -100]
            }),
            opacity: this.textAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            })
          }}
        >
          <Text style={{ fontSize: 70, color: "black", fontWeight: "bold" }} >{this.state.pressCounter}</Text>
        </Animated.View>
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
    backgroundColor: "gray"
  },
})