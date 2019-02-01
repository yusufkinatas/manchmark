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

const CustomButton = ({ onPress, text, icon }) => {

  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        justifyContent: icon ? "flex-start" : "center"
      }}
      onPress={onPress}
    >
      {
        icon &&
        <View style={{ width: 45, justifyContent: "center", alignItems: "center" }} >
          <Icon name={icon} size={20} color={colors.secondaryLight3} style={{ marginRight: 10 }} />
        </View>
      }
      <Text style={styles.text} >{text}</Text>
    </TouchableOpacity>
  );
};

CustomButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string
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
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    width: _SCREEN.width * 0.60,
    marginBottom: 10
  },
  text: {
    fontSize: 15,
    color: colors.secondaryLight3,
  },

});

export default CustomButton;