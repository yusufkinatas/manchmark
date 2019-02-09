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
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, api } from "../../core";
import CustomButton from "../../components/CustomButton";

export default class LeaderboardScreen extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Leaderboard',
        },
      }
    };
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <View style={Generics.container} >

        <Text style={Generics.bigText} >LEADERBOARD</Text>

      </View>
    )
  }
}