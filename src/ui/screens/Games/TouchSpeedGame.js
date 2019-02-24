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

import { store, _APP_SETTINGS, _SCREEN, Generics, user, translate } from "../../../core";
import CustomButton from "../../../components/CustomButton";
import CounterBar from "../../../components/CounterBar";
import BouncingText from "../../../components/BouncingText";
import DelayedText from "../../../components/DelayedText";
import GameResult from '../../../components/GameResult';


const TIMEOUT_MS = 10000;
const gameColor = _APP_SETTINGS.games.find(g => g.name == "TouchSpeedGame").backgroundColor;

export default class TouchSpeedGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate("TouchSpeedGame"),
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
    let oldUserStat = user.get().statistics;
    let touchStats = oldUserStat.TouchSpeedGame;

    user.set({
      statistics: {
        ...oldUserStat, ["TouchSpeedGame"]: {
          amountPlayed: oldUserStat.TouchSpeedGame.amountPlayed + 1,
          totalTouchCount: oldUserStat.TouchSpeedGame.totalTouchCount + this.state.pressCounter
        }
      }
    }, true);

    this.setState({ gameStatus: "finished" });
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
  }

  renderInfo = () => {
    return (
      <View style={Generics.container} >

        <View style={{ paddingBottom: 20 }} >
          <Text style={Generics.bigText} >Press the screen as fast as you can</Text>
        </View>
        <CustomButton backgroundColor={gameColor} text="Start" onPress={this.startGame} />
        <Text style={Generics.hintText}>You can use more than one finger!</Text>
      </View>
    );
  }

  renderGame = () => {
    return (
      <View style={{ ...Generics.container, width: _SCREEN.width }}>
        <TouchableOpacity activeOpacity={1} onPressIn={this.pressed} style={Generics.touchableArea} />
        <BouncingText style={{ ...styles.pressCountText, color: gameColor }} >{this.state.pressCounter}</BouncingText>
        <CounterBar ref={r => this.counterBarRef = r} width={_SCREEN.width * 0.8} color={gameColor} />
      </View>
    );
  }

  renderFinish = () => {
    return (
      <GameResult
        onRestart={this.reinitialize}
        game="TouchSpeedGame"
        score={this.state.pressCounter}
      />
    );
  }

  pressed = () => {
    if (this.state.gameStatus != "active") return;

    if (!this.endGameTimeout) {
      this.counterBarRef.start(TIMEOUT_MS);
      this.endGameTimeout = setTimeout(() => {
        this.endGame();
      }, TIMEOUT_MS);
    }

    this.setState({ pressCounter: this.state.pressCounter + 1 });
  }

  render() {
    return (
      <View style={Generics.container} >

        {this.state.gameStatus == "info" && this.renderInfo()}

        {this.state.gameStatus == "active" && this.renderGame()}

        {this.state.gameStatus == "finished" && this.renderFinish()}

      </View>
    );
  }
}

const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({
  pressCountText: {
    fontSize: 70,
    fontFamily: "roboto",
    fontWeight: "bold",
    width: _SCREEN.width,
    textAlign: "center"
  }
})