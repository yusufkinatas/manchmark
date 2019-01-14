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
  UIManager,
  Linking
} from 'react-native';
import { store, _APP_SETTINGS, _SCREEN, ram } from "../../core";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class MainScreen extends Component {

  constructor(props) {
    super(props);
    //for animations on android
    UIManager.setLayoutAnimationEnabledExperimental(true);


    this.onClickPushOptionsScreen = this.onClickPushOptionsScreen.bind(this);
  }

  onClickPushOptionsScreen = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'ReactionSpeedScreen'
      }
    });
  }

  render() {
    return (
      <View style={styles.container} >
        {/* <Text style={{ fontSize: 20, color: colors.primary }} >MAIN SCREEN</Text> */}
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.primary,
            padding: 10,
            borderRadius: 50,
            width: _SCREEN.width * 0.65
          }}
          onPress={() => {
            this.onClickPushOptionsScreen();
          }}
        >
          <Text style={{
            fontSize: 15,
            color: colors.secondaryLight3
          }} >
            Reaction Speed
          </Text>
        </TouchableOpacity>
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
  }

})