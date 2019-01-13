import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
  UIManager,
  Linking
} from 'react-native';
import { store, _APP_SETTINGS, _SCREEN, ram } from "../../core";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class MainScreen extends Component {

  constructor(props) {
    super(props);

    //for animations on androidw
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  render() {
    return (
      <View style={styles.container} >
        <Icon name="heart" color="red" size={30} />
        <Text style={{ fontSize: 30, color: "black" }} >MAIN SCREEN</Text>
        <Icon name="heart" color="red" size={30} />
      </View>
    )
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

})