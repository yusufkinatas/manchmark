import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, nav } from "../core"

const CustomButton = ({ onPress, text, icon, big, backgroundColor }) => {

  return (
    big ?
      <TouchableOpacity
        style={{ ...styles.bigButton, backgroundColor:  backgroundColor ? backgroundColor : colors.primary, justifyContent: icon ? "flex-start" : "center" }}
        onPress={onPress}
      >
        {
          icon &&
          <View style={{ justifyContent: "center", alignItems: "center" }} >
            <Icon name={icon} size={25} color={colors.secondaryLight3} style={{ marginRight: 10 }} />
          </View>
        }
        <Text style={styles.bigText} >{text}</Text>
      </TouchableOpacity>
      :
      <TouchableOpacity
        style={{ ...styles.button, backgroundColor:  backgroundColor ? backgroundColor : colors.primary, justifyContent: icon ? "flex-start" : "center" }}
        onPress={onPress}
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
  big: PropTypes.bool,
  backgroundColor: PropTypes.string
};
CustomButton.defaultProps = {
  onPress: () => { },
  text: 'Button Text',
  big: false
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
    backgroundColor:  colors.primary
  },
  bigButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    padding: 25,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 15,
    fontFamily: "roboto",
    color: colors.secondaryLight3,
    fontWeight: "bold",
  },
  bigText: {
    fontSize: 20,
    fontFamily: "roboto",
    color: colors.secondaryLight3,
    textAlign: "center",
    paddingHorizontal: 10,
    fontWeight: "bold"
  }

});

export default CustomButton;