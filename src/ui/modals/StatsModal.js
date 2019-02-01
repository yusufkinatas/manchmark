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
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN } from "../../core";
import CustomButton from '../../components/CustomButton';

export default class StatsModal extends Component {

  constructor(props) {
    super(props);
  }

  static options(passProps) {
    return {
      screenBackgroundColor: 'transparent',
      modalPresentationStyle: 'overCurrentContext',
    };
  }

  render() {
    return (
      <View style={styles.container} >
        <TouchableOpacity
          style={styles.touchableArea}
          activeOpacity={1}
          onPressIn={() => Navigation.dismissModal(this.props.componentId)}
        />
        <View style={styles.innerContainer} >
          <Text style={styles.bigText} >Calculation Speed: %12.10</Text>
          <Text style={styles.bigText} >Personal Best: %20.25</Text>
          <CustomButton text="Close" onPress={() => Navigation.dismissModal(this.props.componentId)} />
        </View>
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
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  innerContainer: {
    width: _SCREEN.width * 0.8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary
  },
  touchableArea: {
    zIndex: -1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute"
  },
  closeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  bigText: {
    fontSize: 20,
    color: colors.secondaryLight3,
    textAlign: "center",
    marginBottom: 10
  },
})