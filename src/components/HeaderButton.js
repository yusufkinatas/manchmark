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

const HeaderButton = ({ onPress, text, icon, backgroundColor, disabled }) => {

  return (
    <View style={{ paddingRight: 10, backgroundColor: "transparent" }} >
      <TouchableOpacity
        disabled={disabled}
        style={{ ...styles.button, backgroundColor: backgroundColor ? backgroundColor : colors.primary }}
        onPress={onPress}
      >
        <Icon name={icon} size={20} color={colors.secondaryLight3} style={{left:4}} />
      </TouchableOpacity>
    </View>
  )
};

HeaderButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string,
  backgroundColor: PropTypes.string,
  disabled: PropTypes.bool
};
HeaderButton.defaultProps = {
  onPress: () => { },
  icon: "user"
};

const colors = _APP_SETTINGS.colors;
var styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    padding: 5,
    width: 35,
    height: 35,
    elevation: 3,
  },
  text: {
    fontSize: 15,
    fontFamily: "roboto",
    color: colors.secondaryLight3,
    fontWeight: "bold",
  },
});

export default HeaderButton;