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
import BouncingText from "../../../components/BouncingText";
import DelayedText from "../../../components/DelayedText";


const TIMEOUT_MS = 10000;

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
      gameStatus: "info", // info - active - finished
      remainingTime: TIMEOUT_MS,
      progress: 1
    };
  }

  reinitialize = () => {
    this.setState({
      pressCounter: 0,
      gameStatus: "info", // info - active - finished
      remainingTime: TIMEOUT_MS,
      progress: 1
    });
    clearInterval(this.tick);
    clearTimeout(this.endGameTimeout);
  }

  componentWillMount() {

  }

  componentWillUnmount() {
    clearInterval(this.tick);
    clearTimeout(this.endGameTimeout);
  }

  handleBackPress = () => {
    return this.state.gameStatus == "active" ? true : false;
  }

  endGame = () => {
    this.setState({ gameStatus: "finished" });
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
    this.endGameTimeout = setTimeout(() => {
      this.endGame();
    }, TIMEOUT_MS)

  }

  renderInfo = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >

        <View style={{ paddingBottom: 20 }} >
          <Text style={styles.bigText} >Press the screen as fast as you can</Text>
        </View>
        <CustomButton text="Start" onPress={this.startGame} />
      </View>
    );
  }

  renderGame = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: _SCREEN.width }}>
        <TouchableOpacity activeOpacity={1} onPressIn={this.pressed} style={styles.touchableArea} />
        <BouncingText style={styles.pressCountText} >{this.state.pressCounter}</BouncingText>
        <CounterBar time={TIMEOUT_MS} width={_SCREEN.width * 0.8} color={colors.primary} />
      </View>
    );
  }

  renderFinish = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
        <DelayedText delay={300} style={styles.bigText} >
          {`You have pressed the screen ${this.state.pressCounter} times in ${TIMEOUT_MS / 1000} seconds`}
        </DelayedText>
        <View style={{ paddingTop: 20}}>
          <CustomButton style={{ flex: 1, alignItems: "center", justifyContent: "center" }} text="Restart" onPress={this.reinitialize}/>
        </View>
      </View>
    );
  }

  pressed = () => {
    if (this.state.gameStatus != "active") return;
    this.setState({ pressCounter: this.state.pressCounter + 1 });
  }

  render() {
    return (
      <View style={styles.container} >

        {this.state.gameStatus == "info" && this.renderInfo()}

        {this.state.gameStatus == "active" && this.renderGame()}

        {this.state.gameStatus == "finished" && this.renderFinish()}

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
    backgroundColor: colors.secondary,
  },
  touchableArea: {
    position: "absolute",
    zIndex: 99,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
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
  },
  pressCountText: {
    fontSize: 70,
    color: colors.primary,
    fontWeight: "bold",
    width: _SCREEN.width,
    textAlign: "center"
  }
})