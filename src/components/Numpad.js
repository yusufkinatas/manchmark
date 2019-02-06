import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Feather';

import { store, _APP_SETTINGS, _SCREEN, nav } from "../core"



export default class Numpad extends Component {

  constructor(props) {
    super(props);
  }

  renderButton = (text) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}  >
        <TouchableWithoutFeedback onPressIn={() => this.props.onPress(text)} >
          <View style={styles.buttonInnerContainer} >
            <Text style={styles.buttonText} >{text}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  renderButtonWithIcon = (icon, name) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
        <TouchableWithoutFeedback onPressIn={() => this.props.onPress(name)} onLongPress={() => { if (name == "del") this.props.deleteAll() }} >
          <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Icon name={icon} color={colors.secondaryLight3} size={30} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container} >

        <View style={styles.horizontalContainer} >
          {this.renderButton("1")}
          {this.renderButton("2")}
          {this.renderButton("3")}
        </View>
        <View style={styles.horizontalContainer} >
          {this.renderButton("4")}
          {this.renderButton("5")}
          {this.renderButton("6")}
        </View>
        <View style={styles.horizontalContainer} >
          {this.renderButton("7")}
          {this.renderButton("8")}
          {this.renderButton("9")}
        </View>
        <View style={styles.horizontalContainer} >
          {this.renderButtonWithIcon("delete", "del")}
          {this.renderButton("0")}
          {this.renderButtonWithIcon("check", "enter")}
        </View>

      </View>
    );
  }
}

Numpad.propTypes = {
  onPress: PropTypes.func,
};

const colors = _APP_SETTINGS.colors;
var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  horizontalContainer: {
    flexDirection: "row",
    flex: 1,
  },
  buttonInnerContainer: {
    width: "93%",
    height: "93%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondaryLight,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.secondaryLight3,
  }

});