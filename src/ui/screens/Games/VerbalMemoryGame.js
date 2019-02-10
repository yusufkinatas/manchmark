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
  LayoutAnimation
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, utils, Generics } from "../../../core";
import CustomButton from "../../../components/CustomButton";
import SwappingText from "../../../components/SwappingText";
import DelayedView from "../../../components/DelayedView";
import GameResult from '../../../components/GameResult';
const WORDS = require("../../../../assets/wordsEn.json").wordsEn;

const gameColor = _APP_SETTINGS.games.find(g => g.name== "VerbalMemoryGame").backgroundColor;

export default class VerbalMemoryGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Verbal Memory',
        },
      }
    };
  }

  constructor(props) {
    super(props);
    this.usedWords = [];

    this.state = {
      word: "",
      gameStatus: "info",
      score: 0
    };
  }

  reinitialize = () => {
    this.usedWords = [];

    this.setState({
      word: "",
      gameStatus: "info",
      score: 0
    });
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  generateNewWord = () => {
    let randomWord;
    do {
      randomWord = WORDS[utils.randomBetween(0, WORDS.length)];
    } while (this.usedWords.indexOf(randomWord) != -1 || randomWord.length < 3 || randomWord.length > 10);
    return randomWord;
  }

  showAWord = () => {
    let word;
    if (this.state.score < 1 || (this.usedWords.length > 7 ? Math.random() > 0.5 : Math.random() > 0.35)) {
      word = this.generateNewWord();
    }
    else {
      do {
        word = this.usedWords[utils.randomBetween(0, this.usedWords.length - 1)];
      } while (word == this.state.word);
    }
    this.setState({ word });
  }

  endGame = () => {
    this.setState({ gameStatus: "finished" });
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
    this.showAWord();
  }

  onAnswer = (answer) => {
    let usedBefore = this.state.score == 0 ? false : this.usedWords.indexOf(this.state.word) != -1;
    if ((answer == "seen" && !usedBefore) || (answer == "new" && usedBefore)) {
      this.endGame();
    }
    else {
      if (!usedBefore) {
        this.usedWords.push(this.state.word);
      }
      this.setState({ score: this.state.score + 1 });
      this.showAWord();
    }
  }

  renderInfo = () => {
    return (
      <View style={Generics.container} >
        <View style={{ paddingBottom: 20 }} >
          <Text style={Generics.bigText} >Try to remember all words</Text>
        </View>
        <CustomButton backgroundColor= {gameColor} text="Start" onPress={this.startGame} />
      </View>
    );
  }

  renderGame = () => {
    return (
      <View style={Generics.container}>
        <SwappingText style={Generics.hugeText} >
          {this.state.word && this.state.word[0].toUpperCase()}{this.state.word.slice(1)}
        </SwappingText>
        <View style={styles.answerButtonsContainer} >
          <TouchableOpacity onPress={() => this.onAnswer("seen")} style={{...styles.answerButton, backgroundColor: gameColor}} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >SEEN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onAnswer("new")} style={{ ...styles.answerButton, marginLeft: 0, backgroundColor: gameColor }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >NEW</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderFinish = () => {
    return (
      <GameResult
        onRestart={this.reinitialize}
        game="VerbalMemoryGame"
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
  answerButtonsContainer: {
    flexDirection: "row",
    width: _SCREEN.width,
    marginTop: 30
  },
  answerButton: {
    flex: 1,
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: colors.primary,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  }
})