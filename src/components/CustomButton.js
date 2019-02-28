import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, nav, audio } from "../core"

const CustomButton = ({ onPress, text, icon, backgroundColor }) => {

  return (
    <TouchableOpacity
      style={{ ...styles.button, backgroundColor: backgroundColor ? backgroundColor : colors.primary, justifyContent: icon ? "flex-start" : "center" }}
      onPress={() => {
        onPress();
        audio.play("click_main.wav", 0.2);
      }}
    >
      {
        icon &&
        <View style={{ width: 45, justifyContent: "center", alignItems: "center" }} >
          <Icon name={icon} size={25} color={colors.secondaryLight3} style={{ marginRight: 10 }} />
        </View>
      }
      <Text style={styles.text} >{text}</Text>
    </TouchableOpacity>
  )

};

CustomButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string,
  backgroundColor: PropTypes.string
};

CustomButton.defaultProps = {
  onPress: () => { },
  text: 'Button Text',
};

const colors = _APP_SETTINGS.colors;
var styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    width: _SCREEN.width * 0.6,
    marginBottom: 10,
    elevation: 3,
    backgroundColor: colors.primary
  },
  text: {
    fontSize: 15,
    fontFamily: "roboto",
    color: colors.secondaryLight3,
    fontWeight: "bold",
  },
});

export default CustomButton;