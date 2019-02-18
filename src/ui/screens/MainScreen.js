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
  TouchableNativeFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, user } from "../../core";
import CustomButton from "../../components/CustomButton";

export default class MainScreen extends Component {

  pushScreen = (screen) => {
    nav.pushScreen(this.props.componentId, screen);
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
          <View style={{ borderRadius: 50, overflow: "hidden" }}>
            <TouchableNativeFeedback style={styles.smallButtonContainer} background={TouchableNativeFeedback.Ripple(colors.primary, true)} onPress={() => this.showModal("AboutUsModal")} >
              <View style={{ width: 50, height: 40, justifyContent: "center", alignItems: "center" }} >
                <Icon name="info" size={20} color={colors.secondaryLight3} />
              </View>
            </TouchableNativeFeedback>
          </View>
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
    justifyContent: "space-around",
    width: _SCREEN.width,
    paddingBottom: 10
  },
  smallButtonContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  }
});