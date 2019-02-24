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

import { store, _APP_SETTINGS, _SCREEN, utils, Generics, user, translate } from "../../../core";
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
          text: translate("NumberMemoryGame"),
        },
      }
    };
  }

  constructor(props) {
    super(props);
    this.numberLength = 2;
    this.number = "";
    this.state = {
      gameStatus: "info", //info - active - finished
      isGuessing: false,
      number: "",
      userAnswer: ""
    };
  }

  reinitialize = () => {
    this.numberLength = 0;
    this.number = "";
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
    clearTimeout(this.answerTime);
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
    this.showNewNumber();
  }

  endGame = () => {
    let oldUserStat = user.get().statistics;
    let numberMemorized = ((this.state.number.length - 1) * this.state.number.length) / 2;
    user.set({
      statistics: {
        ...oldUserStat, ["NumberMemoryGame"]: {
          amountPlayed: oldUserStat.NumberMemoryGame.amountPlayed + 1,
          totalNumberMemorized: oldUserStat.NumberMemoryGame.totalNumberMemorized + numberMemorized
        }
      }
    }, true);

    this.setState({ gameStatus: "finished" });
  }

  showNewNumber = () => {
    this.numberLength++;
    this.number = utils.randomBetween(1, 9) + this.number;
    this.setState({ number: this.number, isGuessing: false, userAnswer: "" });
    this.numberTimeout = setTimeout(() => {
      this.setState({ isGuessing: true });
      this.answerTime = setTimeout(() => {
        this.onAnswer();
      }, (this.numberLength + 3) * 1000 + 500);
    }, (this.numberLength + 3) * 1000 + 500);
  }

  skipWaiting = () => {
    clearTimeout(this.numberTimeout);
    clearTimeout(this.answerTime);
    this.setState({ isGuessing: true });
    this.answerTime = setTimeout(() => {
      this.onAnswer();
    }, (this.numberLength + 1) * 1000 + 500);
  }

  onAnswer = () => {
    clearTimeout(this.answerTime);
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
          <Text style={Generics.bigText} >{translate("rememberTheNumber")}</Text>
        </View>
        <CustomButton backgroundColor={gameColor} text="Start" onPress={this.startGame} />
        <Text style={Generics.hintText} >{translate("youCanGroupNumbers")}</Text>
      </View>
    );
  }

  renderMemorizingPhase = () => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }} >
        <Text style={{ ...Generics.hugeText, textAlign: "center" }} >{this.state.number}</Text>
        <View style={{ height: 10 }}></View>
        <CounterBar time={(this.numberLength + 3) * 1000 + 450} width={_SCREEN.width * 0.8} color={gameColor} />
        <View style={{ height: 10 }}></View>
        <CustomButton backgroundColor={gameColor} text={translate("skip")} onPress={this.skipWaiting} />
      </View>
    );
  }

  renderAnswerPhase = () => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={Generics.container} >
          <CounterBar time={(this.numberLength + 3) * 1000 + 450} width={_SCREEN.width * 0.8} color={gameColor} />
          <Text style={Generics.bigText} >{translate("whatWasTheNumber")}</Text>
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
    );
  }

  renderGame = () => {
    return (
      <View style={Generics.container}>
        {this.state.isGuessing ?
          this.renderAnswerPhase()
          :
          this.renderMemorizingPhase()
        }
      </View>
    );
  }

  returnChar = (number, correct) => {
    return (
      <Text style={{ ...Generics.bigText, fontSize: 24, paddingHorizontal: 0, color: correct ? colors.secondaryLight3 : gameColor, textDecorationLine: correct ? "none" : "line-through" }}>{number}</Text>
    );
  }


  showError = () => {
    let num = this.state.number;
    let ans = this.state.userAnswer;
    let ansArray = ans.split("");
    console.log(_SCREEN.height);

    return (
      <View style={{ ...Generics.container, flex: 0.25, justifyContent: "center", paddingTop: 10 }}>
        <Text style={{ ...Generics.bigText, fontSize: 16, color: colors.secondaryLight2 }}>{translate("number")}</Text>
        <Text style={{ ...Generics.bigText, fontSize: 24 }}>{num}</Text>
        <Text style={{ ...Generics.bigText, fontSize: 16, color: colors.secondaryLight2 }}>{translate("yourAnswer")}</Text>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          {ansArray.map((char, index) => {
            if (index <= num.length - 1) {
              if (char == num[index]) {
                return this.returnChar(char, true);
              }
              else {
                return this.returnChar(char, false);
              }
            }
            else {
              return this.returnChar(char, false);
            }
          })}
        </View>
      </View>
    );
  }

  renderFinish = () => {
    return (
      <View style={Generics.container}>
        {this.state.userAnswer != "" && this.showError()}
        <GameResult
          onRestart={this.reinitialize}
          game="NumberMemoryGame"
          score={this.numberLength - 1}
        />
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