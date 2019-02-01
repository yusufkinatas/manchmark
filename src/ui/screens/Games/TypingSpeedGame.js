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

import { store, _APP_SETTINGS, _SCREEN, ram, utils, Generics } from "../../../core";
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
      trueAnswer: 0,
    };
  }

  reinitialize = () => {
    this.usedWords = [];
    clearTimeout(this.endGameTimeout);

    this.setState( {
      gameStatus: "info",
      score: 0,
      question: "",
      word: ["", "", ""],
      trueAnswer: 0,
    });
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
      <View style={Generics.container} >
        <Text style={Generics.bigText} >Write as much word as possible in {TIMEOUT_MS / 1000} seconds</Text>
        <View style={{height: 20}}></View>
        <CustomButton text="Start" onPress={this.startGame} />
        <Text style={Generics.hintText} >Hint: You can write any one of the 3 words in any order!</Text>
      </View>
    );
  }

  onChangeText = (text) => {
    // if (text[text.length - 1] != ' ') {
    //   this.userAnswer = text;
    // }
    // else {
    //   this.onAnswer(this.userAnswer);
    //   this.textInputRef.clear();
    // }
    this.onAnswer(text);
  }

  onAnswer = (answer) => {
    let newWord, index = -1;
    let tmpArray = this.state.word;
    switch (answer) {
      case this.state.word[0]:
        index = 0;
        break;
      case this.state.word[1]:
        index = 1;
        break;
      case this.state.word[2]:
        index = 2;
        break;
    }
    if (index != -1) {
      this.usedWords.push(answer);
      tmpArray[index] = this.generateNewWord();
      this.setState({ word: tmpArray, score: this.state.score + 50, });
      this.textInputRef.clear();
    }
  }

  renderGame = () => {
    return (
      <View style={Generics.container}>
        <CounterBar time={TIMEOUT_MS} width={_SCREEN.width * 0.8} color={colors.primary} />
        <BouncingText style={Generics.bigText}>Score: {this.state.score}</BouncingText>
        <View style={{ height: 10 }} />

        <View style={{ flexDirection: "row", backgroundColor: "#164e2b" }} >
          <View style={Generics.container} >
            <SwappingText style={Generics.questionText} >{this.state.word[0]}</SwappingText>
          </View>

          <View style={Generics.container} >
            <SwappingText style={Generics.questionText} >{this.state.word[1]}</SwappingText>
          </View>

          <View style={Generics.container} >
            <SwappingText style={Generics.questionText} >{this.state.word[2]}</SwappingText>
          </View>
        </View>

        <TextInput
          ref={r => this.textInputRef = r}
          onChangeText={this.onChangeText}
          autoCapitalize={"none"}
          autoCorrect={false}
          spellCheck={false}
          textContentType={"none"}
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
        />
      </View>
    );
  }

  renderFinish = () => {
    return (
      <View style={Generics.container} >
        <Text style={Generics.bigText} >{`Your score is ${this.state.score}`}</Text>
        <View style={{ paddingTop: 20}}>
          <CustomButton style={Generics.container} text="Restart" onPress={this.reinitialize}/>
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