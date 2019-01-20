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

import { store, _APP_SETTINGS, _SCREEN, ram, utils } from "../../../core";
import CustomButton from "../../../components/CustomButton";
import SwappingText from "../../../components/SwappingText";
const WORDS = require("../../../res/wordsEn.json").wordsEn;

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
    } while (this.usedWords.indexOf(randomWord) != -1 || randomWord.length < 3);
    return randomWord;
  }

  showAWord = () => {
    let word;
    if (this.state.score == 0 || (this.usedWords.length > 7 ? Math.random() > 0.5 : Math.random() > 0.35)) {
      word = this.generateNewWord();
    }
    else {
      word = this.usedWords[utils.randomBetween(0, this.usedWords.length - 1)];
    }
    this.setState({ word });
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
    this.showAWord();
  }

  onAnswer = (answer) => {
    let usedBefore = this.state.score == 0 ? false : this.usedWords.indexOf(this.state.word) != -1;
    if ((answer == "seen" && !usedBefore) || (answer == "new" && usedBefore)) {
      this.setState({ gameStatus: "finished" });
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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >

        <View style={{ paddingBottom: 20 }} >
          <Text style={styles.bigText} >Try to remember all words</Text>
        </View>
        <CustomButton text="Start" onPress={this.startGame} />
      </View>
    );
  }

  renderGame = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <SwappingText style={styles.wordText}  >
          {this.state.word && this.state.word[0].toUpperCase()}{this.state.word.slice(1)}
        </SwappingText>
        <View style={styles.answerButtonsContainer} >
          <TouchableOpacity onPress={() => this.onAnswer("seen")} style={styles.answerButton} >
            <Text style={styles.answerText} >SEEN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onAnswer("new")} style={{ ...styles.answerButton, marginLeft: 0 }} >
            <Text style={styles.answerText} >NEW</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderFinish = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
        <Text style={styles.bigText} >{`You answered correctly ${this.state.score} times`}</Text>
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
    justifyContent: "center",
    backgroundColor: colors.secondaryDark
  },
  text: {
    fontSize: 15,
    color: colors.secondaryLight3
  },
  bigText: {
    fontSize: 20,
    color: colors.secondaryLight3,
    textAlign: "center",
    paddingHorizontal: 20
  },
  wordText: {
    fontSize: 35,
    color: colors.secondaryLight3,
    fontWeight: "bold",
    width: _SCREEN.width,
    textAlign: "center"
  },
  answerButtonsContainer: {
    flexDirection: "row",
    width: _SCREEN.width,
    marginTop: 40
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
  },
  answerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.secondaryLight3
  },

})