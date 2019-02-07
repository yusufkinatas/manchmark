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
  TextInput,
  NetInfo
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

    NetInfo.addEventListener("connectionChange", (res) => {
      console.log("connectionChange", res.type);
      if (res && res.type != "none") {
        console.log("isConnected", true);
        user.set({ isConnected: true });
      }
      else {
        user.set({ isConnected: false });
        console.log("isConnected", false);
      }
    })
  }

  componentDidMount() {
    SplashScreen.hide();
    setRootViewBackgroundColor(colors.secondary);

    NetInfo.isConnected.fetch().then(isConnected => {
      user.set({ isConnected });
      if (user.get().isConnected) {
        api.login(user.get().deviceID).then((res) => {
          var userData = _.omit(res.data, ["tokens", "__v", "_id"]);
          userData.authToken = res.headers["x-auth"];
          user.set(userData);
          this.startGame();
        }).catch(err => {
          //login olamazsa yeni bir cihaz demektir, yeni kayıt aç
          console.log(user.get().deviceID, err)
          this.setState({ isLoading: false });
        });
      }
      else {
        this.startGame();
      }

    });

  }

  startGame = () => {
    console.log("USER", user.get())
    nav.showGame();
  }

  onChooseNickname = () => {
    if (this.state.nickname.trim().length < 3 || this.state.nickname.trim().length > 20) {
      this.setState({ errorText: "Nickname must contain between 3 and 20 characters" });
    }
    else if (!validator.isAlphanumeric(this.state.nickname.trim())) {
      this.setState({ errorText: "Nickname can contain only english letters and numbers" });
    }
    else {
      this.setState({ isLoading: true });
      api.signup(this.state.nickname, user.get().deviceID)
        .then((res) => {
          var user = _.omit(res, ["tokens", "__v", "_id"]);
          user.authToken = res.headers["x-auth"];
          this.startGame(user);
        })
        .catch(err => {
          console.log("err", JSON.stringify(err, undefined, 2));
          console.log("err", err);
          this.setState({ errorText: "This nickname is already in use", isLoading: false });
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
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }} >
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
            color: colors.secondaryLight3,
            marginBottom: 5
          }}
          placeholder="Type your nickname"
          placeholderTextColor={colors.secondaryLight2}
          underlineColorAndroid={"transparent"}
        />
        <Text style={Generics.errorText} >{this.state.errorText}</Text>
        <CustomButton text="CHOOSE" onPress={this.onChooseNickname} />
        <CustomButton text="Temporarybutton" onPress={() => {
          alert("test")
        }} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container} >

        <View style={{ flex: 1, justifyContent: "center" }} >
          <Text style={styles.header} >MANCHMARK</Text>
        </View>

        <View style={{ flex: 6, justifyContent: "center", alignItems: "center" }} >
          {
            this.state.isLoading
              ?
              this.renderLoading()
              :
              this.renderLoginForm()
          }
        </View>

      </View>
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
    color: colors.secondaryLight3
  },
  bigText: {
    fontSize: 25,
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