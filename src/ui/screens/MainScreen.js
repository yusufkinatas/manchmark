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

import { store, _APP_SETTINGS, _SCREEN, ram, nav } from "../../core";
import CustomButton from "../../components/CustomButton";

export default class MainScreen extends Component {

  constructor(props) {
    super(props);
  }

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
      <View style={styles.container} >
        <View style={{ flex: 1, justifyContent: "center" }} >
          <CustomButton icon="superscript" text="Calculation Speed" onPress={() => this.pushScreen("CalculationSpeedGame")} />
          <CustomButton icon="list-ol" text="Number Memory" onPress={() => this.pushScreen("NumberMemoryGame")} />
          <CustomButton icon="bolt" text="Reaction Speed" onPress={() => this.pushScreen("ReactionSpeedGame")} />
          <CustomButton icon="hand-o-down" text="Touch Speed" onPress={() => this.pushScreen("TouchSpeedGame")} />
          <CustomButton icon="keyboard-o" text="Typing Speed" onPress={() => this.pushScreen("TypingSpeedGame")} />
          <CustomButton icon="font" text="Verbal Memory" onPress={() => this.pushScreen("VerbalMemoryGame")} />
          <CustomButton icon="image" text="Visual Memory" onPress={() => this.pushScreen("VisualMemoryGame")} />
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