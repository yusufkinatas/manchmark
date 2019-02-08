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
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { store, _APP_SETTINGS, _SCREEN, nav, Generics } from "../../core";
import CustomButton from "../../components/CustomButton";

export default class MainScreen extends Component {

  pushScreen = (screen) => {
    nav.pushScreen(this.props.componentId, screen);
  }

  showModal = (screen) => {
    Navigation.showModal({
      component: {
        name: screen,
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
        </View>

        <View style={Generics.container} >
          {_APP_SETTINGS.games.map(g => {
            return (
              <CustomButton icon={g.icon} text={g.fullName} onPress={() => this.pushScreen(g.name)} />
            )
          })}
        </View>

        <View style={styles.bottomBarContainer} >
          <TouchableOpacity style={styles.smallButtonContainer} onPress={() => this.showModal("StatsModal")} >
            <Icon name="list" size={20} color={colors.secondaryLight3} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButtonContainer} onPress={() => this.showModal("AboutUsModal")} >
            <Icon name="info" size={20} color={colors.secondaryLight3} />
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({
  topBarContainer: {
    marginTop: 70,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: _SCREEN.width * 0.4,
    paddingBottom: 10,
  },
  smallButtonContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  }
});