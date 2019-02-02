import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import PropTypes from 'prop-types';

import { store, _APP_SETTINGS, _SCREEN, nav, Generics } from "../core"

const colors = _APP_SETTINGS.colors;

const LoadingIndicator = ({ text }) => {

  return (
    <View>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={Generics.bigText} >{text}</Text>
    </View>
  );

};

LoadingIndicator.propTypes = {
  text: PropTypes.string,
};
LoadingIndicator.defaultProps = {
  text: 'Loading...',
};



export default LoadingIndicator;