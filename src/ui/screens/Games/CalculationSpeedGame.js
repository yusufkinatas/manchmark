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
  TextInput,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, utils, Generics } from "../../../core";
import CounterBar from "../../../components/CounterBar";
import CustomButton from "../../../components/CustomButton";
import SwappingText from "../../../components/SwappingText";
import BouncingText from "../../../components/BouncingText";

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

export default class CalculationSpeedGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Calculation Speed',
        },
      }
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      gameStatus: "info", //info - active - finished
      score: 0,
      question: "",
      trueAnswer: 0
    };
    this.backgroundAnim = new Animated.Value(0);
  }

  reinitialize = () => {
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
    this.setState({ gameStatus: "finished" });
  }

  renderInfo = () => {
    return (
      <View style={Generics.container} >
        <View style={{ paddingBottom: 20 }} >
          <Text style={Generics.bigText} >Answer as much as possible in {TIMEOUT_MS / 1000} seconds</Text>
        </View>
        <CustomButton text="Start" onPress={this.startGame} />
      </View>
    );
  }

  showNewQuestion = () => {
    let x, y, z;
    let randomQuestion;
    do {
      x = utils.randomBetween(1, 50);
      y = utils.randomBetween(1, 50);
      z = utils.randomBetween(1, 50);
      randomQuestion = QUESTION_FUNCTIONS[Math.floor(Math.random() * QUESTION_FUNCTIONS.length)](x, y, z);
      if (this.textInputRef) {
        this.textInputRef.clear();
      }
      this.trueAnswer = randomQuestion.answer;
    } while (this.trueAnswer < 0 || (this.trueAnswer - Math.floor(this.trueAnswer)) != 0);
    this.setState({ question: randomQuestion.text });
  }

  animateBackground = (status) => {
    this.setState({ backgroundColor: status == "failure" ? colors.failure : colors.primary });
    Animated.timing(this.backgroundAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(this.backgroundAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }).start();
    });
  }

  onChangeText = (text) => {
    this.userAnswer = text;
  }

  onAnswer = () => {
    if (this.userAnswer == this.trueAnswer) {
      this.setState({ score: this.state.score + 50 });
      this.showNewQuestion();
      this.animateBackground("green");
    }
    else {
      this.setState({ score: this.state.score - 20 });
      this.textInputRef.clear();
      this.animateBackground("failure");
    }
  }

  renderGame = () => {
    const backgroundOpacity = this.backgroundAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <View
        style={Generics.container}>
        <CounterBar time={TIMEOUT_MS} width={_SCREEN.width * 0.8} color={colors.primary} />
        <BouncingText style={Generics.bigText} >Score: {this.state.score}</BouncingText>
        <View style={{ height: 10 }} />
        <SwappingText style={Generics.questionText} >{this.state.question}</SwappingText>
        <TextInput
          ref={ref => (this.textInputRef = ref)}
          onChangeText={this.onChangeText}
          autoCapitalize={"none"}
          autoCorrect={false}
          autoFocus={true}
          style={{
            width: _SCREEN.width / 3,
            borderBottomWidth: 1,
            borderColor: colors.primary,
            padding: 5,
            textAlign: 'center',
            fontSize: 25,
            color: colors.secondaryLight3,
            marginBottom: 20
          }}
          underlineColorAndroid={"transparent"}
          keyboardType="phone-pad" />
        <TouchableOpacity style={Generics.button} onPress={this.onAnswer} >
          <Animated.View style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: this.state.backgroundColor,
            opacity: backgroundOpacity
          }} />
          <Text style={styles.text} >ANSWER</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderFinish = () => {
    return (
      <View style={Generics.container} >
        <Text style={Generics.bigText} >{`Your score is ${this.state.score}`}</Text>
        <View style={{ paddingTop: 20 }}>
          <CustomButton style={Generics.container} text="Restart" onPress={this.reinitialize} />
        </View>
      </View>
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
    color: colors.secondaryLight3
  }
})