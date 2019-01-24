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
      word: ["", "", ""],
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
    } while (this.usedWords.indexOf(randomWord) != -1 || randomWord.length < 3 || randomWord.length > 7);
    return randomWord;
  }

  startGame = () => {
    let tmpArray = ["", "", ""];
    tmpArray[0] = this.generateNewWord();
    tmpArray[1] = this.generateNewWord();
    tmpArray[2] = this.generateNewWord();

    this.setState({ gameStatus: "active", word: tmpArray });
    this.endGameTimeout = setTimeout(() => {
      this.endGame();
    }, TIMEOUT_MS);
  }

  endGame = () => {
    this.setState({ gameStatus: "finished" });
  }

  renderInfo = () => {
    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}} >
          <Text style={styles.bigText} >Write as much word as possible in {TIMEOUT_MS / 1000} seconds</Text>
          <CustomButton text="Start" onPress={this.startGame} /> 
        <Text style={styles.hintText} >Hint: You can write any of the 3 words in any order!</Text>
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
    if (text[text.length - 1] != ' '){
    this.userAnswer = text;
    }
    else {
      this.onAnswer(this.userAnswer);
      this.textInputRef.clear();
    }
  }

  onAnswer = () => {
    let newWord; 
    let tmpArray = this.state.word;

    switch(this.userAnswer) {
        case this.state.word[0]:
          this.usedWords.push(this.userAnswer);
          tmpArray[0] = this.generateNewWord();
          this.setState({word: tmpArray, score: this.state.score + 50});
          break;

          case this.state.word[1]:
          this.usedWords.push(this.userAnswer);
          tmpArray[1] = this.generateNewWord();
          this.setState({word: tmpArray, score: this.state.score + 50});
          break;

          case this.state.word[2]:
          this.usedWords.push(this.userAnswer);
          tmpArray[2] = this.generateNewWord();
          this.setState({word: tmpArray, score: this.state.score + 50});
          break;

          default:
          this.setState({ score: this.state.score - 20 });
          this.animateBackground("failure");
    }
  }

  renderGame = () => {
    const backgroundOpacity = this.backgroundAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
        <CounterBar time={TIMEOUT_MS} width={_SCREEN.width * 0.8} color={colors.primary} />
        <BouncingText style={styles.bigText}>Score: {this.state.score}</BouncingText>
        <View style={{ height: 10 }} />

        <View style={{ flexDirection: "row", backgroundColor: "#164e2b"}} >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <SwappingText style={styles.questionText} >{this.state.word[0]}</SwappingText>
          </View>

          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <SwappingText style={styles.questionText} >{this.state.word[1]}</SwappingText>
          </View>

          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <SwappingText style={styles.questionText} >{this.state.word[2]}</SwappingText>
          </View>
        </View>

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
          keyboardType="default"
        />
        <TouchableOpacity style={styles.button} onPress={this.onAnswer} >
          <Animated.View style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: this.state.backgroundColor,
            opacity: backgroundOpacity }}/>
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
  hintText: {
    fontSize: 14,
    position: "absolute",
    color: colors.secondaryLight2,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    bottom: 20
  },
  bigText: {
    fontSize: 20,
    color: colors.secondaryLight3,
    textAlign: "center",
    paddingHorizontal: 20
  },
  questionText: {
    fontSize: 30,
    color: colors.secondaryLight3,
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