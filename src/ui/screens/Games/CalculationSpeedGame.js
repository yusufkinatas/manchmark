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
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, utils, Generics, user, translate } from "../../../core";
import CounterBar from "../../../components/CounterBar";
import CustomButton from "../../../components/CustomButton";
import SwappingText from "../../../components/SwappingText";
import BouncingText from "../../../components/BouncingText";
import GameResult from '../../../components/GameResult';
import Numpad from '../../../components/Numpad';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'react-native-admob'

const TIMEOUT_MS = 30000;
const QUESTION_FUNCTIONS = [
  (x, y, z) => ({
    text: `${x} + ${y} = ?`,
    answer: x + y
  }),
  (x, y, z) => ({
    text: `${x} - ${y} = ?`,
    answer: x - y
  }),
  (x, y, z) => {
    if (x > 1 && y > 1 && y < 10 && x < 10) {
      return {
        text: `${x} X ${y} = ?`,
        answer: x * y
      }
    }
    return { answer: -1 }
  },
  (x, y, z) => {
    if (y != 1 && x != y && x <= 30) {
      return {
        text: `${x} ÷ ${y} = ?`,
        answer: x / y
      }
    }
    return { answer: -1 }
  },
]

const gameColor = _APP_SETTINGS.games.find(g => g.name == "CalculationSpeedGame").backgroundColor;

export default class CalculationSpeedGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate("CalculationSpeedGame"),
        },
      }
    };
  }

  constructor(props) {
    super(props);
    this.correctAnswerCount = 0;
    this.state = {
      gameStatus: "info", //info - active - finished
      score: 0,
      question: "",
      trueAnswer: 0,
      text: ""
    };
    this.backgroundAnim = new Animated.Value(0);
  }

  reinitialize = () => {
    this.correctAnswerCount = 0;
    this.setState({
      gameStatus: "info",
      score: 0,
      question: "",
      trueAnswer: 0
    });

    this.backgroundAnim = new Animated.Value(0);
    clearTimeout(this.endGameTimeout);
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    clearTimeout(this.endGameTimeout);
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
    this.endGameTimeout = setTimeout(() => {
      this.endGame();
    }, TIMEOUT_MS);
    this.showNewQuestion();
  }

  endGame = () => {
    let oldUserStat = user.get().statistics;
    user.set({
      statistics: {
        ...oldUserStat, ["CalculationSpeedGame"]: {
          amountPlayed: oldUserStat.CalculationSpeedGame.amountPlayed + 1,
          totalCalculation: oldUserStat.CalculationSpeedGame.totalCalculation + this.correctAnswerCount
        }
      }
    }, true);
    user.updateStatistics();
    this.setState({ gameStatus: "finished" });
  }

  renderInfo = () => {
    return (
      <View style={Generics.container} >
        <View style={{ paddingBottom: 20 }} >
          <Text style={Generics.bigText} >{translate("answerMuchInXSeconds").replace("2", TIMEOUT_MS / 1000)}</Text>
        </View>
        <CustomButton backgroundColor={gameColor} text="Start" onPress={this.startGame} />
        <Text style={Generics.hintText} >{translate("dontRush")}</Text>
      </View>
    );
  }

  showNewQuestion = () => {
    let x, y, z;
    let randomQuestion;
    let randomIndex = Math.floor(Math.random() * QUESTION_FUNCTIONS.length);
    do {
      x = utils.randomBetween(1, 50);
      y = utils.randomBetween(1, 50);
      z = utils.randomBetween(1, 50);
      randomQuestion = QUESTION_FUNCTIONS[randomIndex](x, y, z);
      this.trueAnswer = randomQuestion.answer;
    } while (this.trueAnswer < 0 || (this.trueAnswer - Math.floor(this.trueAnswer)) != 0);
    this.setState({ question: randomQuestion.text, text: "" });
  }

  animateBackground = (status) => {
    this.setState({ backgroundColor: status == "failure" ? colors.failure : gameColor });
    Animated.timing(this.backgroundAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(this.backgroundAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    });
  }

  onAnswer = () => {
    if (this.state.text == this.trueAnswer) {
      this.setState({ score: this.state.score + 50 });
      this.correctAnswerCount++;
      this.showNewQuestion();
      this.animateBackground("green");
    }
    else {
      this.setState({ score: this.state.score - 20, text: "" });
      this.animateBackground("failure");
    }
  }

  onPress = (text) => {
    if (text == "del") {
      this.setState({ text: this.state.text.slice(0, this.state.text.length - 1) });
    }
    else if (text == "enter") {
      this.onAnswer();
    }
    else {
      this.setState({ text: this.state.text + text });
    }
  }

  deleteAll = () => {
    this.setState({ text: "" });
  }

  renderGame = () => {
    const backgroundOpacity = this.backgroundAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <View style={Generics.container}>

        <View style={Generics.container} >
          <CounterBar time={TIMEOUT_MS} width={_SCREEN.width * 0.8} color={gameColor} />
          <View style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, overflow: "hidden" }} >
            <Animated.View style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: this.state.backgroundColor,
              opacity: backgroundOpacity
            }} />
            <BouncingText style={Generics.bigText} >{translate("score")} : {this.state.score}</BouncingText>
          </View>
          <View style={{ height: 10 }} />
          <SwappingText style={Generics.questionText} >{this.state.question}</SwappingText>

          <Text
            style={{
              minWidth: _SCREEN.width * 0.3,
              borderBottomWidth: 1,
              borderColor: gameColor,
              padding: 5,
              textAlign: 'center',
              fontSize: 25,
              color: colors.secondaryLight3,
              marginBottom: 20
            }}
          >{this.state.text}</Text>
        </View>

        <View style={{ height: _SCREEN.height * 0.4, width: _SCREEN.width }} >
          <Numpad onPress={this.onPress} deleteAll={this.deleteAll} rippleColor={gameColor} />
        </View>

      </View>
    );
  }

  renderFinish = () => {
    return (
      <GameResult
        onRestart={this.reinitialize}
        game="CalculationSpeedGame"
        score={this.state.score}
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

var styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: "roboto",
    color: colors.secondaryLight3
  }
})