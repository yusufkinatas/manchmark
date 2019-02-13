import React, { Component } from 'react';
import { Navigation } from "react-native-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Alert,
  Linking,
  TextInput,
  NetInfo,
  AppState
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { setRootViewBackgroundColor } from 'react-native-root-view-background';
import validator from "validator";
import _ from "lodash";

import { store, _APP_SETTINGS, _SCREEN, nav, api, utils, user, Generics } from "../../core";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";
import SplashScreen from 'react-native-splash-screen';

export default class MainScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      errorText: "",
      nickname: ""
    }

  }



  componentDidMount() {

    SplashScreen.hide();
    setRootViewBackgroundColor(colors.secondary);

    AppState.addEventListener("change", (state) => {
      if (state == "active") {
        NetInfo.isConnected.fetch().then(isConnected => {
          user.set({ isConnected });
          console.log("isConnected", isConnected)
        })
      }
    });

    NetInfo.isConnected.fetch().then(isConnected => {
      user.set({ isConnected })
      if (isConnected) {
        user.getFromStore()
          .then(_user => {

            if (_user && _user.nickname != null) {
              user.login();
              this.startGame();
            }
            else {
              user.login()
                .then(() => {
                  this.startGame();
                })
                .catch(err => {
                  console.log("cannot login", err);
                  this.setState({ isLoading: false });
                });
            }
          }).catch(err => console.log(err));
      }
      else {
        user.getFromStore()
          .then(_user => {
            this.startGame();
          }).catch(err => console.log(err));
      }

    }).catch(err => console.log(err))

  }

  addConnectionChangeListener = () => {
    NetInfo.addEventListener("connectionChange", (res) => {
      if (res && res.type != "none") {
        console.log("isConnected", true);
        user.set({ isConnected: true });
        user.compareLocalHighscores();
      }
      else {
        console.log("isConnected", false);
        user.set({ isConnected: false });
      }
    });
  }

  startGame = () => {
    console.log("USER", user.get());
    if (user.get().isConnected) {
      user.compareLocalHighscores();
      user.getAllRanks();
      user.getGlobalAverages();
      user.getGlobalHighscores();
    }
    this.addConnectionChangeListener();
    nav.showGame();
  }

  onChooseNickname = () => {
    if (this.state.nickname.trim().length < 3 || this.state.nickname.trim().length > 20) {
      this.setState({ errorText: "Username must be between 3 and 20 characters" });
    }
    else if (!validator.isAlphanumeric(this.state.nickname.trim())) {
      this.setState({ errorText: "Username can only contain english letters and numbers" });
    }
    else {
      this.setState({ isLoading: true });
      api.signup(this.state.nickname, user.get().deviceID)
        .then((res) => {
          var tmpUser = _.omit(res.data, ["tokens", "__v", "_id"]);
          tmpUser.authToken = res.headers["x-auth"];
          console.log("saving user", tmpUser);
          user.set(tmpUser, true);
          this.startGame();
        })
        .catch(err => {
          console.log("err", JSON.stringify(err, undefined, 2));
          console.log("err", err);
          this.setState({ errorText: "This username is already in use", isLoading: false });
        });
    }

  }

  renderLoading = () => {
    return (
      <LoadingIndicator />
    );
  }

  renderLoginForm = () => {
    return (
      <View style={{ alignItems: "center" }} >
        <Text style={Generics.bigText}>Pick a Username</Text>
        <View style={{ paddingTop: 10 }}></View>
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
        />
        <Text style={Generics.errorText} >{this.state.errorText}</Text>
        <CustomButton text="CHOOSE" onPress={this.onChooseNickname} />
      </View>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={Generics.container}>
        <View style={{ flex: 2, justifyContent: "center" }} >
          <Text style={{ ...Generics.header }} >MANCHMARK</Text>
        </View>

        <View style={{ flex: 3, alignItems: "center", paddingTop: 50 }} >
          {
            this.state.isLoading
              ?
              this.renderLoading()
              :
              this.renderLoginForm()
          }
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary
  },
  text: {
    fontSize: 15,
    fontFamily: "roboto",
    color: colors.secondaryLight3
  },
  bigText: {
    fontSize: 25,
    fontFamily: "roboto",
    color: colors.secondaryLight3
  },
  header: {
    fontFamily: "Roboto",
    fontSize: 40,
    textShadowColor: colors.secondaryDark,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3,
    width: _SCREEN.width,
    textAlign: "center",
    color: colors.secondaryLight3
  }
});