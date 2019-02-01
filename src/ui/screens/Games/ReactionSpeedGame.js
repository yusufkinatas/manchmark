import React, { Component } from 'react';
import { Navigation } from "react-native-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram, utils, Generics } from "../../../core";
import CustomButton from '../../../components/CustomButton';
import DelayedText from '../../../components/DelayedText';

export default class ReactionSpeedGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Reaction Speed',
        },
      }
    };
  }

  constructor(props) {
    super(props);

    this.answer = false;
    this.phase = 0;
    this.randomDelay = 0;
    this.startTime = 0;
    this.endTime = 0;
    this.reactionTime = [];

    this.state = {
      gameStatus: "info", // info - active - finished
      playingState: "waiting"
    };
  }

  reinitialize = () => {
    this.answer = false;
    this.phase = 0;
    this.randomDelay = 0;
    this.startTime = 0;
    this.endTime = 0;
    this.reactionTime = [];

    clearTimeout(this.timer);

    this.setState({ gameStatus: "info", playingState: "waiting" });
  }

  componentWillUpdate() {
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
  }

  renderInfo = () => {
    return (
      <View style={Generics.container} >
        <View style={{ paddingBottom: 20 }} >
          <Text style={Generics.bigText} >Press the screen as soon as the color changes!</Text>
        </View>
        <Text style={Generics.hintText} >There are 5 phases!</Text>
        <CustomButton text="Start" onPress={this.startGame} />
      </View>
    );
  }

  betweenPhases = () => {
    if (this.answer) {
      return (
        <View style={{ ...Generics.container, width: _SCREEN.width }}>
          <TouchableOpacity style={Generics.touchableArea} onPressIn={() => this.setState({ playingState: "waiting" })}>
            <Text style={Generics.hugeText}>{this.reactionTime[this.phase - 1]} ms</Text>
            <Text style={Generics.hintText} >Press the screen for the next phase!</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else {
      return (
        <View style={{ ...Generics.container, width: _SCREEN.width }}>
          <TouchableOpacity style={{ ...Generics.touchableArea, backgroundColor: colors.failure }} activeOpacity={1} onPressIn={() => this.setState({ playingState: "waiting" })}>
            <Text style={Generics.hugeText}>TOO EARLY!</Text>
            <Text style={Generics.hintText} >Press the screen for the next phase!</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderAnswerPhase = () => {
    // Ekran griyken x saniye sonra yesil olacak
    this.startTime = (new Date()).getTime();
    return (
      <View style={{ ...Generics.container, width: _SCREEN.width }}>
        <TouchableOpacity style={{ ...Generics.touchableArea, backgroundColor: colors.primary }} onPressIn={this.onAnswer}>
          <Text style={Generics.hugeText}>PRESS</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderWaitingPhase = (randomDelay) => {
    this.timer = setTimeout(() => {
      this.setState({ playingState: "answering" });
    }, randomDelay * 1000);
    return (
      <View style={{ ...Generics.container, width: _SCREEN.width }}>
        <TouchableOpacity style={Generics.touchableArea} text='tikla' onPressIn={this.onWrongAnswer}>
          <Text style={Generics.hugeText}>WAIT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onAnswer = () => {
    this.answer = true;
    this.endTime = (new Date()).getTime();
    this.reactionTime.push(this.endTime - this.startTime);
    this.phase++;
    this.setState({ playingState: "betweenPhases" });
  }

  onWrongAnswer = () => {
    this.answer = false;
    this.reactionTime.push(0);
    clearTimeout(this.timer);
    this.phase++
    this.setState({ playingState: "betweenPhases" });
  }

  renderGame = () => {

    let randomDelay = utils.randomDoubleBetween(1.25, 2.5);
    if (this.phase < 5) {
      switch (this.state.playingState) {
        case "waiting":
          return (this.renderWaitingPhase(randomDelay));
          break;
        case "answering":
          return (this.renderAnswerPhase());
          break;
        case "betweenPhases":
          return (this.betweenPhases());
          break;
        // code block
        default:
      }
    }
    else {
      this.setState({ gameStatus: "finished" });
    }
  }

  renderFinish() {
    return (
      <View style={Generics.container}>
        <DelayedText style={Generics.hugeText} delay={500}>Average: {this.findAverage()}ms</DelayedText>
        <DelayedText style={Generics.bigText} delay={1000}>Phase 1: {this.reactionTime[0]}ms</DelayedText>
        <DelayedText style={Generics.bigText} delay={1500}>Phase 2: {this.reactionTime[1]}ms</DelayedText>
        <DelayedText style={Generics.bigText} delay={2000}>Phase 3: {this.reactionTime[2]}ms</DelayedText>
        <DelayedText style={Generics.bigText} delay={2500}>Phase 4: {this.reactionTime[3]}ms</DelayedText>
        <DelayedText style={Generics.bigText} delay={3000}>Phase 5: {this.reactionTime[4]}ms</DelayedText>
        <View style={{ paddingTop: 20 }}>
          <CustomButton style={Generics.container} text="Restart" onPress={this.reinitialize} />
        </View>
      </View>
    );
  }

  findAverage = () => {
    let index;
    let average = 0;
    let count = 0;
    for (index = 0; index < this.reactionTime.length; index++) {
      if (this.reactionTime[index] != 0) {
        average += this.reactionTime[index];
        count++
      }
    }
    if (count != 0) {
      average = Math.round((average / count * 100)) / 100
    }
    return average;
  }

  render() {
    return (
      <View style={Generics.container}>
        {this.state.gameStatus == "info" && this.renderInfo()}
        {this.state.gameStatus == "active" && this.renderGame()}
        {this.state.gameStatus == "finished" && this.renderFinish()}
      </View>
    );
  }
}

const colors = _APP_SETTINGS.colors;