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

import { store, _APP_SETTINGS, _SCREEN } from "../../core";
import CounterBar from "../../components/CounterBar";
import DelayedText from "../../components/DelayedText";

export default class PlaygroundScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: ""
    };
  }

  onChangeText = (text) => {

    console.log("before if", this.state.text);

    if (text.search("aaa") != -1) {
      console.log("if 1");
      this.textInputRef.clear();
    }
    else {
      console.log("if 2");
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
          ref={r => this.textInputRef = r}
          style={{
            color: colors.secondaryLight3,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary,
            width: _SCREEN.width * 0.5,
            fontSize: 20
          }}
          autoCapitalize={"none"}
          onChangeText={this.onChangeText}
          autoCorrect={false}
          autoFocus={true}
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