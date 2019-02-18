import React, { Component } from 'react';
import { Navigation } from "react-native-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
  Linking,
  TouchableNativeFeedback,
  Share
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, user } from "../../core";
import CustomButton from "../../components/CustomButton";

export default class MainScreen extends Component {

  pushScreen = (screen) => {
    nav.pushScreen(this.props.componentId, screen);
  }

  shareGame = () => {
    Share.share({
      message: `Are you ready to test your limits on Manchmark?\nDownload now and see your rank among people in multiple games.\nGoogle Play: ${_APP_SETTINGS.playstoreURL}`,
      title: "Let's play Manchmark",
    }, {});
  }

  rateGame = () => {
    Linking.openURL(_APP_SETTINGS.playstoreLink)
  }

  showModal = (screen, passProps) => {
    Navigation.showModal({
      component: {
        name: screen,
        passProps,
        options: {
          animations: {
            showModal: {
              alpha: {
                from: 0,
                to: 1,
                duration: 250,
              },
            },
            dismissModal: {
              alpha: {
                from: 1,
                to: 0,
                duration: 250,
              },
            }
          }
        }
      }
    });
  }

  renderBottomButton = (icon, text, onPress) => {
    return (
      <View style={{ flex: 1, borderRadius: 5, overflow: "hidden", marginHorizontal: 10 }} >
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(colors.primary, true)} onPress={onPress} >
          <View style={{ paddingHorizontal: 5, justifyContent: "center", alignItems: "center" }} >
            <Icon name={icon} size={20} color={colors.secondaryLight2} />
            <Text style={{ ...Generics.text, fontSize: 12, color: colors.secondaryLight2 }} >{text}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  render() {
    return (
      <View style={Generics.container} >

        <View style={styles.topBarContainer} >

          <Text style={Generics.header}>Manchmark</Text>

          <View style={{ flexDirection: "row" }} >
            <Text style={{ ...Generics.bigText, paddingHorizontal: 0 }} >Welcome </Text>
            <TouchableOpacity onPress={() => this.showModal("ChangeNicknameModal", { onDismiss: () => this.forceUpdate() })} >
              <Text style={{ ...Generics.bigText, paddingHorizontal: 0, textDecorationLine: "underline" }} >{user.get().nickname}!</Text>
            </TouchableOpacity>
          </View>

        </View>


        <View style={Generics.container} >
          <CustomButton icon={"play"} text={"PLAY"} onPress={() => this.pushScreen("SelectGameScreen")} />
          <CustomButton icon={"users"} text={"FRIENDS"} onPress={() => this.pushScreen("FollowsScreen")} />
          <CustomButton icon={"list-ol"} text={"LEADERBOARD"} onPress={() => this.pushScreen("LeaderboardScreen")} />
          <CustomButton icon={"bar-chart"} text={"STATISTICS"} onPress={() => this.pushScreen("StatisticsScreen")} />
        </View>

        <View style={styles.bottomBarContainer} >
          {this.renderBottomButton("star", "Rate Us", this.rateGame)}
          {this.renderBottomButton("info", "About Us", () => this.showModal("AboutUsModal"))}
          {this.renderBottomButton("share-2", "Invite People", this.shareGame)}
        </View>

      </View>
    )
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({
  topBarContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30
  },
  bottomBarContainer: {
    flexDirection: "row",
    overflow: "hidden",
    width: _SCREEN.width,
    paddingBottom: 10
  }
});