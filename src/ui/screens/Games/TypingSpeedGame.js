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

import { store, _APP_SETTINGS, _SCREEN, ram, utils } from "../../../core";
import CounterBar from "../../../components/CounterBar";
import CustomButton from "../../../components/CustomButton";
import SwappingText from "../../../components/SwappingText";
import BouncingText from "../../../components/BouncingText";

const TIMEOUT_MS = 30000;
const WORDS = require("../../../res/wordsEn.json").wordsEn;

export default class TypingSpeedGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Typing Speed',
        },
      }
    };
  }

  constructor(props) {
    super(props);
    this.usedWords = [];

    this.state = {
      gameStatus: "info", //info - active - finished
      score: 0,
      question: "",
      trueAnswer: 0
    };
    this.backgroundAnim = new Animated.Value(0);
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    clearTimeout(this.endGameTimeout);
  }

  generateNewWord = () => {
    let randomWord;
    do {
      randomWord = WORDS[utils.randomBetween(0, WORDS.length)];
    } while (this.usedWords.indexOf(randomWord) != -1 || randomWord.length < 3);
    return randomWord;
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
    this.endGameTimeout = setTimeout(() => {
      this.endGame();
    }, TIMEOUT_MS);
  }

  endGame = () => {
    this.setState({ gameStatus: "finished" });
  }

  renderInfo = () => {
    return (
      <View style={{ flex: 1 }} >
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}  >
          <Text style={styles.bigText} >Write as much word as possible in {TIMEOUT_MS / 1000} seconds</Text>
          <CustomButton text="Start" onPress={this.startGame} />
        </View>
        <Text style={{ position: "absolute", bottom: 10, textAlign: "center", color: "white", left: 0, right: 0 }} >Hint: You can write any one of the 3 words in any order!</Text>
      </View>
    );
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
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CounterBar time={TIMEOUT_MS} width={_SCREEN.width * 0.8} color={colors.primary} />
        <BouncingText style={styles.bigText} >Score: {this.state.score}</BouncingText>
        <View style={{ height: 10 }} />
        <SwappingText style={styles.questionText} >{this.state.word}</SwappingText>
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
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.button} onPress={this.onAnswer} >
          <Animated.View style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: this.state.backgroundColor,
            opacity: backgroundOpacity
          }}
          />
          <Text style={styles.text} >ANSWER</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderFinish = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
        <Text style={styles.bigText} >{`Your score is ${this.state.score}`}</Text>
      </View>
    );
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
    justifyContent: "space-between",
    backgroundColor: colors.secondary
  },
  text: {
    fontSize: 15,
    color: colors.secondaryLight3
  },
  smallText: {
    fontSize: 15,
    textAlign: "center",
    justifyContent: "flex-end",
    color: colors.secondaryLight3,
    position: 'absolute',
    height: 40,
    left: 0,
    top: _SCREEN.height - 100,
    width: _SCREEN.width,
  },
  bigText: {
    fontSize: 20,
    color: colors.secondaryLight3,
    textAlign: "center",
    paddingHorizontal: 20
  },
  questionText: {
    fontSize: 35,
    color: colors.secondaryLight3,
    fontWeight: "bold",
    width: _SCREEN.width,
    textAlign: "center"
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    width: _SCREEN.width * 0.65,
    marginBottom: 10,
  },
})