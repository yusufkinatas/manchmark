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
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram } from "../../../core";
import CustomButton from "../../../components/CustomButton";
import CounterBar from "../../../components/CounterBar";
import ProgressBar from "../../../components/ProgressBar";


const TIMEOUT_MS = 10000;
const TICK_FREQUENCY_MS = 1000;

export default class TouchSpeedGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Touch Speed',
        },
      }
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      pressCounter: 0,
      gameStatus: "paused", // active - finished - paused
      remainingTime: TIMEOUT_MS,
      progress: 1,
    };
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  componentWillMount() {
    setInterval(() => {
      this.setState({ remainingTime: this.state.remainingTime - TICK_FREQUENCY_MS })
    }, TICK_FREQUENCY_MS);
  }

  componentWillUnmount() {
    clearInterval(this.tick);
  }

  handleBackPress = () => {
    return this.state.gameStatus == "active" ? true : false;
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
    setTimeout(() => {
      this.setState({gameStatus: "finished"})
    }, TIMEOUT_MS)

  }

  pressed = () => {
    if (this.state.gameStatus != "active") return;
    this.setState({ pressCounter: this.state.pressCounter + 1 });
  }

  render() {
    let timePercentage = this.state.remainingTime / TIMEOUT_MS;
    return (
      <View style={styles.container} >
        {
          this.state.gameStatus == "paused" &&
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >

            <View style={{ paddingBottom: 20 }} >
              <Text style={styles.bigText} >Press the screen as fast as you can</Text>
            </View>
            <CustomButton text="Start" onPress={(this.startGame)} />
          </View>
        }

        {
          this.state.gameStatus == "active" &&
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity activeOpacity={1} onPressIn={this.pressed} style={styles.touchableArea} />
            <Text style={{ fontSize: 70, color: colors.primary, fontWeight: "bold" }} >{this.state.pressCounter}</Text>
            <CounterBar time={TIMEOUT_MS} width={_SCREEN.width / 2} color={colors.primary} />
          </View>
        }

        {
          this.state.gameStatus == "finished" &&
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
            <Text style={styles.bigText} >Congratulations!</Text>
            <Text style={styles.bigText} >{`You have pressed the screen ${this.state.pressCounter} times in ${TIMEOUT_MS/1000} seconds`}</Text>
          </View>
        }
      </View>
    );
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondaryDark,
  },
  touchableArea: {
    position: "absolute",
    zIndex: 99,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent"
  },
  text: {
    fontSize: 15,
    color: colors.secondaryLight3
  },
  bigText: {
    fontSize: 20,
    color: colors.secondaryLight3,
    textAlign: "center",
    paddingHorizontal: 20
  }
})