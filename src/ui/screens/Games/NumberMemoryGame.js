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
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from "lodash";

import { store, _APP_SETTINGS, _SCREEN, utils, Generics } from "../../../core";
import CounterBar from "../../../components/CounterBar";
import CustomButton from "../../../components/CustomButton";
import GameResult from '../../../components/GameResult';
import Numpad from '../../../components/Numpad';

const gameColor = _APP_SETTINGS.games.find(g => g.name == "NumberMemoryGame").backgroundColor;

export default class NumberMemoryGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Number Memory',
        },
      }
    };
  }

  constructor(props) {
    super(props);
    this.numberLength = 2;
    this.state = {
      gameStatus: "info", //info - active - finished
      isGuessing: false,
      number: "",
      userAnswer: ""
    };
  }

  reinitialize = () => {
    this.numberLength = 2;
    this.setState({
      gameStatus: "info", //info - active - finished
      isGuessing: false,
      number: "",
      userAnswer: ""
    });
    clearTimeout(this.numberTimeout);
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    clearTimeout(this.numberTimeout);
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
    this.showNewNumber();
  }

  endGame = () => {
    this.setState({ gameStatus: "finished" });
  }

  showNewNumber = () => {
    this.numberLength++;
    var number = "";
    for (let i = 0; i < this.numberLength; i++) {
      number += utils.randomBetween(1, 9);
    }
    this.setState({ number, isGuessing: false, userAnswer: "" });
    this.numberTimeout = setTimeout(() => {
      this.setState({ isGuessing: true });
    }, (this.numberLength + 1) * 1000);
  }

  skipWaiting = () => {
    clearTimeout(this.numberTimeout);
    this.setState({ isGuessing: true });
  }

  onAnswer = () => {
    if (this.state.userAnswer == this.state.number) {
      this.showNewNumber();
    }
    else {
      this.endGame();
    }
  }

  onPress = (text) => {
    if (text == "del") {
      this.setState({ userAnswer: this.state.userAnswer.slice(0, this.state.userAnswer.length - 1) });
    }
    else if (text == "enter") {
      this.onAnswer();
    }
    else {
      this.setState({ userAnswer: this.state.userAnswer + text });
    }
  }

  deleteAll = () => {
    this.setState({ userAnswer: "" });
  }

  renderInfo = () => {
    return (
      <View style={Generics.container} >

        <View style={{ paddingBottom: 20 }} >
          <Text style={Generics.bigText} >Remember the numbers</Text>
        </View>
        <CustomButton backgroundColor={gameColor} text="Start" onPress={this.startGame} />
      </View>
    );
  }

  renderGame = () => {
    return (
      <View style={Generics.container}>
        {this.state.isGuessing ?
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={Generics.container} >
              <Text style={Generics.bigText} >What was the number?</Text>
              <Text
                style={{
                  minWidth: _SCREEN.width * 0.3,
                  borderBottomWidth: 1,
                  borderColor: gameColor,
                  padding: 5,
                  textAlign: 'center',
                  fontSize: 25,
                  fontFamily: "roboto",
                  color: colors.secondaryLight3,
                  marginBottom: 20
                }}
              >{this.state.userAnswer}</Text>
            </View>

            <View style={{ height: _SCREEN.height * 0.4, width: _SCREEN.width }} >
              <Numpad rippleColor={gameColor} onPress={this.onPress} deleteAll={this.deleteAll} />
            </View>
          </View>
          :
          <View style={{ justifyContent: "center", alignItems: "center" }} >
            <Text style={{ ...Generics.hugeText, textAlign: "center" }} >{this.state.number}</Text>
            <View style={{ height: 10 }}></View>
            <CounterBar time={(this.numberLength + 1) * 1000} width={_SCREEN.width * 0.8} color={gameColor} />
            <View style={{ height: 10 }}></View>
            <CustomButton backgroundColor={gameColor} text="Skip" onPress={this.skipWaiting} />
          </View>
        }

      </View>
    );
  }

  renderFinish = () => {
    return (
      <GameResult
        onRestart={this.reinitialize}
        game="NumberMemoryGame"
        score={this.numberLength - 1}
      />
    );
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