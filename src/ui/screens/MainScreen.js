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
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram, nav } from "../../core";
import CustomButton from "../../components/CustomButton";

export default class MainScreen extends Component {

  constructor(props) {
    super(props);
  }

  pushScreen = (screen) => {
    nav.pushScreen(this.props.componentId, screen);
  }

  render() {
    return (
      <View style={styles.container} >
        <CustomButton text="Calculation Speed" onPress={() => this.pushScreen("CalculationSpeedGame")} />
        <CustomButton text="Number Memory" onPress={() => this.pushScreen("NumberMemoryGame")} />
        <CustomButton text="Reaction Speed" onPress={() => this.pushScreen("ReactionSpeedGame")} />
        <CustomButton text="√ Touch Speed √" onPress={() => this.pushScreen("TouchSpeedGame")} />
        <CustomButton text="Typing Speed" onPress={() => this.pushScreen("TypingSpeedGame")} />
        <CustomButton text="√ Verbal Memory √" onPress={() => this.pushScreen("VerbalMemoryGame")} />
        <CustomButton text="Visual Memory" onPress={() => this.pushScreen("VisualMemoryGame")} />
      </View>
    )
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
  text: {
    fontSize: 15,
    color: colors.secondaryLight3
  },


});