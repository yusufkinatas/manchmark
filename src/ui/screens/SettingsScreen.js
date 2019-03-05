import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

import _ from "lodash";
import { _APP_SETTINGS, _SCREEN, Generics, translate, user, utils, audio } from "../../core";
import CustomButton from "../../components/CustomButton";

const colors = _APP_SETTINGS.colors;

export default class StatisticsScreen extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate("settings"),
        },
      }
    };
  }

  constructor(props) {
    super(props);
    
    this.state = {
      soundEnabled: user.get().localSettings.soundEnabled,
      hapticEnabled: user.get().localSettings.hapticEnabled,
    };
  }


  toggleSound = () => {
    audio.play("click.wav", 0.15);
    if (this.state.soundEnabled) {
      this.setState({ "soundEnabled": false });
      user.set({ localSettings: { ...user.get().localSettings, soundEnabled: false } }, true);
    }
    else {
      this.setState({ "soundEnabled": true });
      user.set({ localSettings: { ...user.get().localSettings, soundEnabled: true } }, true);
    }
  }

  toggleHaptic = () => {
    audio.play("click.wav", 0.15);
    if (this.state.hapticEnabled) {
      this.setState({ "hapticEnabled": false });
      user.set({ localSettings: { ...user.get().localSettings, hapticEnabled: false } }, true);
    }
    else {
      this.setState({ "hapticEnabled": true });
      user.set({ localSettings: { ...user.get().localSettings, hapticEnabled: true } }, true);
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={Generics.container} >

        <View style={{ alignItems: "center" }} >
          <Text style={Generics.bigText} >{translate("sounds")}</Text>
          <TouchableOpacity
            style={{
              height: 100, width: 100, borderRadius: 50, elevation: 5, backgroundColor: this.state.soundEnabled ? colors.primary : colors.failure, alignItems: "center", justifyContent: "center",
              marginTop: 10
            }}
            onPress={this.toggleSound}
          >
            <Icon name={this.state.soundEnabled ? "volume-2" : "volume-x"} color={colors.secondaryLight3} size={50} />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", marginTop: 10 }} >
          <Text style={Generics.bigText} >{translate("vibration")}</Text>
          <TouchableOpacity
            style={{
              height: 100, width: 100, borderRadius: 50, elevation: 5, backgroundColor: this.state.hapticEnabled ? colors.primary : colors.failure, alignItems: "center", justifyContent: "center",
              marginTop: 10
            }}
            onPress={this.toggleHaptic}
          >
            <Icon2 name={"vibrate"} color={colors.secondaryLight3} size={50} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    )
  }
}