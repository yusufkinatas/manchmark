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
  TouchableWithoutFeedback,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import validator from "validator";

import { store, _APP_SETTINGS, _SCREEN, Generics, user, api } from "../../core";
import CustomButton from '../../components/CustomButton';

export default class ChangeNicknameModal extends Component {

  static options(passProps) {
    return {
      screenBackgroundColor: 'transparent',
      modalPresentationStyle: 'overCurrentContext',
    };
  }

  constructor(props) {
    super(props);
    this.anim = new Animated.Value(0);
    this.state = {
      nickname: user.get().nickname,
      isLoading: false,
      errorText: "",
    }
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
    this.props.onDismiss();
  }

  onChooseNickname = () => {
    if (this.state.nickname.trim().length < 3 || this.state.nickname.trim().length > 20) {
      this.setState({ errorText: "Nickname must contain between 3 and 20 characters" });
    }
    else if (this.state.nickname == user.get().nickname) {
      this.dissmissModal();
      return;
    }
    else if (!validator.isAlphanumeric(this.state.nickname.trim())) {
      this.setState({ errorText: "Nickname can contain only english letters and numbers" });
    }
    else if (!user.get().isConnected) {
      this.setState({ errorText: "There is no internet connection" });
    }
    else {
      this.setState({ isLoading: true });
      user.changeNickname(this.state.nickname.trim())
        .then(() => { this.dissmissModal() })
        .catch(err => {
          console.log(err);
          this.setState({ errorText: "This nickname is already in use", isLoading: false });
        });
    }

  }

  render() {
    return (
      <View style={{ ...Generics.container, backgroundColor: colors.secondaryDark }} >
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
          {
            this.state.isLoading ?
              <ActivityIndicator size="large" color={colors.primary} />
              :
              <View style={{ justifyContent: "center", alignItems: "center", zIndex: 10 }} >
                <TextInput
                  onChangeText={t => this.setState({ nickname: t })}
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  style={{
                    width: _SCREEN.width * 0.6,
                    borderWidth: 1,
                    borderColor: colors.primary,
                    borderRadius: 5,
                    padding: 5,
                    fontSize: 20,
                    fontFamily: "roboto",
                    color: colors.secondaryLight3,
                    marginBottom: 5
                  }}
                  placeholder="Type your nickname"
                  placeholderTextColor={colors.secondaryLight2}
                  underlineColorAndroid={"transparent"}
                  value={this.state.nickname}
                />
                <Text style={Generics.errorText} >{this.state.errorText}</Text>
                <CustomButton text="CHANGE" onPress={this.onChooseNickname} />
                <CustomButton text="CLOSE" onPress={this.dissmissModal} />
              </View>
          }
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
    fontFamily: "roboto",
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
    fontFamily: "roboto",
    color: colors.secondaryLight2,
    textAlign: "left",
    paddingLeft: 5
  },
  copyRightText: {
    fontSize: 10,
    fontFamily: "roboto",
    color: colors.secondaryLight,
    textAlign: "left",
    paddingLeft: 5,
    marginBottom: 10
  }
})