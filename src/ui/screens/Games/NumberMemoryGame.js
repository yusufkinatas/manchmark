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
    this.numberLength = 0;
    this.state = {
      gameStatus: "info", //info - active - finished
      isGuessing: false,
      number: "",
      userAnswer: ""
    };
  }

  reinitialize = () => {
    this.numberLength = 0;
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

  onAnswer = () => {
    if (this.state.userAnswer == this.state.number) {
      this.showNewNumber();
    }
    else {
      this.endGame();
    }
  }

  onChangeText = (text) => {
    let newText = '';
    let numbers = '0123456789';

    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      }
    }
    this.setState({ userAnswer: newText });
  }

  renderInfo = () => {
    return (
      <View style={Generics.container} >

        <View style={{ paddingBottom: 20 }} >
          <Text style={Generics.bigText} >Remember the numbers</Text>
        </View>
        <CustomButton text="Start" onPress={this.startGame} />
      </View>
    );
  }

  renderGame = () => {
    return (
      <View style={Generics.container}>
        {this.state.isGuessing ?
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={Generics.bigText} >What was the number?</Text>
            <TextInput
              onChangeText={this.onChangeText}
              autoCapitalize={"none"}
              autoCorrect={false}
              autoFocus={true}
              style={{
                width: _SCREEN.width / 2,
                borderBottomWidth: 1,
                borderColor: colors.primary,
                padding: 5,
                textAlign: 'center',
                fontSize: 25,
                color: colors.secondaryLight3,
                marginBottom: 20
              }}
              returnKeyType={'done'}
              underlineColorAndroid={"transparent"}
              keyboardType="phone-pad"
              value={this.state.userAnswer}
            />
            <CustomButton text="GUESS" onPress={this.onAnswer} />
          </View>
          :
          <View style={{ justifyContent: "center", alignItems: "center" }} >
            <Text style={Generics.hugeText} >{this.state.number}</Text>
            <View style={{height:10}}></View>
            <CounterBar time={(this.numberLength + 1) * 1000} width={_SCREEN.width * 0.8} color={colors.primary} />
          </View>
        }

      </View>
    );
  }

  renderFinish = () => {
    return (
      <View style={Generics.container} >
        <Text style={Generics.bigText} >{`You answered correctly ${this.numberLength - 1} times`}</Text>
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