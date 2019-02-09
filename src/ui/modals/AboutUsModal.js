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

import { store, _APP_SETTINGS, _SCREEN, Generics } from "../../core";
import CustomButton from '../../components/CustomButton';

export default class AboutUsModal extends Component {

  static options(passProps) {
    return {
      screenBackgroundColor: 'transparent',
      modalPresentationStyle: 'overCurrentContext',
    };
  }

  constructor(props) {
    super(props);
    this.anim = new Animated.Value(0);
  }

  componentWillMount() {
    Animated.timing(this.anim, {
      duration: 250,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }

  dissmissModal = () => {
    Animated.timing(this.anim, {
      duration: 250,
      toValue: 0,
      useNativeDriver: true
    }).start();
    Navigation.dismissModal(this.props.componentId);
  }

  render() {
    return (
      <View style={{ ...Generics.container, backgroundColor: "rgba(0,0,0,0.6)" }} >
        <TouchableOpacity
          style={styles.touchableArea}
          activeOpacity={1}
          onPressIn={this.dissmissModal}
        />
        <Animated.View
          style={{
            ...styles.innerContainer,
            translateY: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [_SCREEN.height * 0.15, 0]
            })
          }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ overflow: "hidden", borderColor: colors.secondaryLight, borderRadius: 50, borderWidth: 1, elevation: 20 }}>
              <Image
                source={require('../../../assets/icon-flat.png')}
                style={styles.imageStyle}
              />
            </View>
            <View>
              <Text style={styles.bigText}>Manchmark</Text>
              <Text style={styles.smallText}>{_APP_SETTINGS.versionString}</Text>
            </View>
          </View>
          <View style={{ paddingTop: 20 }}>
            <View style={{ marginBottom: 5, flexDirection: "row" }}>
              <Text style={styles.smallText} >Yusuf Kınataş</Text>
              <Text style={styles.smallText} >&</Text>
              <Text style={styles.smallText} >Yağız Akyüz</Text>
            </View>
            <Text style={styles.copyRightText}>© Copyright 2018, All Rights Reserved.</Text>
          </View>
          <CustomButton text="Close" onPress={this.dissmissModal} />
        </Animated.View>
      </View>
    );
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({
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
    fontSize: 25,
    color: colors.secondaryLight3,
    textAlign: "center",
    paddingTop: 5,
    paddingLeft: 5
  },
  imageStyle: {
    height: 50,
    width: 50
  },
  smallText: {
    fontSize: 12,
    color: colors.secondaryLight2,
    textAlign: "left",
    paddingLeft: 5
  },
  copyRightText: {
    fontSize: 10,
    color: colors.secondaryLight,
    textAlign: "left",
    paddingLeft: 5,
    marginBottom: 10
  }
})