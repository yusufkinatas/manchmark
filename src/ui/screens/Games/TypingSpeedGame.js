import React, { Component } from 'react';
import { Navigation } from "react-native-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
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
import GameResult from '../../../components/GameResult';

const TIMEOUT_MS = 30000;
const WORDS = require("../../../../assets/wordsEn.json").wordsEn;
const gameColor = _APP_SETTINGS.games.find(g => g.name == "TypingSpeedGame").backgroundColor;

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
      answer: ""
    };
  }

  reinitialize = () => {
    this.usedWords = [];
    clearTimeout(this.endGameTimeout);

    this.setState({
      gameStatus: "info",
      score: 0,
      question: "",
      word: ["", "", ""],
      trueAnswer: 0,
      answer: ""
    });
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    clearTimeout(this.endGameTimeout);
    clearTimeout(this.keyboardTimer);
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
        <View style={{ height: 20 }}></View>
        <CustomButton backgroundColor={gameColor} text="Start" onPress={this.startGame} />
        <Text style={Generics.hintText} >Hint: You can write any one of the 3 words in any order!</Text>
      </View>
    );
  }

  clearText = () => {
    this.textInputRef.setNativeProps({text: ''});
  }

  onChangeText = (text) => {
    let ans = text.toLowerCase().trim();
    this.onAnswer(ans);
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
      this.usedWords.push(this.state.answer);
      tmpArray[index] = this.generateNewWord();
      this.clearText();
      this.keyboardTimer = setTimeout(() => {
        this.setState({ answer: "", word: tmpArray, score: this.state.score + this.state.answer.length * 5}, this.clearText); 
      }, 70);
    }
  }

  renderGame = () => {
    return (
      <KeyboardAvoidingView behavior="padding" style={Generics.container}>
    
        <CounterBar time={TIMEOUT_MS} width={_SCREEN.width * 0.8} color={gameColor} />
        <BouncingText style={Generics.bigText}>Score: {this.state.score}</BouncingText>
        <View style={{ height: 10 }} />

        <View style={{ flexDirection: "row", backgroundColor: gameColor }} >
          <View style={styles.wordContainer} >
            <SwappingText style={Generics.questionText} >{this.state.word[0]}</SwappingText>
          </View>

          <View style={styles.wordContainer} >
            <SwappingText style={Generics.questionText} >{this.state.word[1]}</SwappingText>
          </View>

          <View style={styles.wordContainer} >
            <SwappingText style={Generics.questionText} >{this.state.word[2]}</SwappingText>
          </View>
        </View>

        <TextInput
          ref={r => this.textInputRef = r}
          onChangeText={this.onChangeText}
          autoCapitalize={"none"}
          autoCorrect={false}
          spellCheck={false}
          secureTextEntry={false}
          bufferDelay={0}
          textContentType={"none"}
          autoFocus={true}
          style={{
            width: _SCREEN.width / 3,
            borderBottomWidth: 1,
            borderColor: gameColor,
            padding: 5,
            textAlign: 'center',
            fontSize: 25,
            fontFamily: "roboto",
            color: colors.secondaryLight3,
            marginBottom: 20
          }}
          underlineColorAndroid={"transparent"}
        />
      
      
      </KeyboardAvoidingView>
    );
  }

  renderFinish = () => {
    return (
      <GameResult
        onRestart={this.reinitialize}
        game="TypingSpeedGame"
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
const styles = StyleSheet.create({
  wordContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
    flex: 1
  },
});