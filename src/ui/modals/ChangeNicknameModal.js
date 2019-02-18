import React, { Component } from 'react';
import { Navigation } from "react-native-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
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
    let _nickname = this.state.nickname.trim().toLocaleLowerCase();
    if (_nickname.length < 3 || _nickname.length > 20) {
      this.setState({ errorText: "Username must be between 3 and 20 characters" });
    }
    else if (_nickname == user.get().nickname) {
      this.dissmissModal();
      return;
    }
    else if (!validator.isAlphanumeric(_nickname)) {
      this.setState({ errorText: "Username can only contain english letters and numbers" });
    }
    else if (!user.get().isConnected) {
      this.setState({ errorText: "There is no internet connection" });
    }
    else {
      this.setState({ isLoading: true });
      user.changeNickname(_nickname)
        .then(() => { this.dissmissModal() })
        .catch(err => {
          console.log(err);
          this.setState({ errorText: "This username is already in use", isLoading: false });
        });
    }

  }

  onChangeText = (text) => {
    this.setState({ nickname: text });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ ...Generics.container, backgroundColor: "rgba(0,0,0,0.6)" }}>
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
                <Text style={Generics.bigText}>Change Username</Text>
                <View style={{ paddingTop: 10 }}></View>
                <TextInput
                  onChangeText={this.onChangeText}
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
                    color: colors.secondaryLight2,
                    marginBottom: 5
                  }}
                  placeholder="Type your nickname"
                  placeholderTextColor={colors.secondaryLight2}
                  underlineColorAndroid={"transparent"}
                  value={this.state.nickname}
                />
                <Text style={Generics.errorText} >{this.state.errorText}</Text>
                <CustomButton text="CHANGE" onPress={this.onChooseNickname} />
                <Text style={{ ...Generics.bigText, color: colors.secondaryLight2, fontSize: 15, textDecorationLine: "underline" }} onPress={this.dissmissModal}>CLOSE</Text>

              </View>
          }
        </Animated.View>
      </KeyboardAvoidingView>
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