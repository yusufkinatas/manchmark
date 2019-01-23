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

import { store, _APP_SETTINGS, _SCREEN, ram, utils } from "../../../core";
import CustomButton from "../../../components/CustomButton";
import BouncingText from '../../../components/BouncingText';
import SwappingText from '../../../components/SwappingText';

const SHOW_DURATION = 2000;

export default class VisualMemoryGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Visual Memory',
        },
      }
    };
  }

  constructor(props) {
    super(props);
    this.isAnimating = false;
    this.state = {
      gameStatus: "info", //info - active - finished
      score: 0,
      level: 0,
      lives: 5,
      squares: []
    };
  }

  componentWillMount() {
    console.log("componentWillMount");    
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    clearTimeout(this.animationTimeout);
  }

  endGame = () => {
    this.setState({ gameStatus: "finished" });
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
    this.startNextLevel();
  }

  startNextLevel = () => {
    this.state.squares = [];
    this.state.level++;
    let sideLengthOfBoard;
    this.specialSquireRequired = this.state.level > 13 ? 15 : this.state.level + 2;
    this.specialSquirePushed = 0;
    let specialSquireCount = 0;
    
    if (this.state.level <= 2) {
      sideLengthOfBoard = 3;
    }
    else if (this.state.level <= 5) {
      sideLengthOfBoard = 4;
    }
    else if (this.state.level <= 8) {
      sideLengthOfBoard = 5;
    }
    else if (this.state.level <= 13) {
      sideLengthOfBoard = 6;
    }
    else {
      sideLengthOfBoard = 7;
    }

    for (let i = 0; i < sideLengthOfBoard * sideLengthOfBoard; i++) {
      this.state.squares.push({ special: false, pushed: false, animation: new Animated.Value(0) });
    }

    while (specialSquireCount < this.specialSquireRequired) {
      let randomIndex = utils.randomBetween(0, this.state.squares.length - 1);
      if (!this.state.squares[randomIndex].special) {
        this.state.squares[randomIndex].special = true;
        specialSquireCount++;
      }
    }
    this.forceUpdate();
    this.showSpecialSquares();
  }

  showSpecialSquares = () => {
    this.isAnimating = true
    this.state.squares.forEach(((square, index) => {
      if (square.special) {
        square.pushed = true; //renk değişimi için
        Animated.timing(square.animation, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        }).start();
      }
    }))
    this.forceUpdate();
    this.animationTimeout = setTimeout(() => {
      this.state.squares.forEach(((square, index) => {
        if (square.special) {
          square.pushed = false; //renk değişimi için
          Animated.timing(square.animation, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
          }).start();
        }
      }));
      this.isAnimating = false;
      this.forceUpdate();
    }, SHOW_DURATION);

  }

  renderInfo = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >

        <Animated.View style={{ paddingBottom: 20 }} >
          <Text style={styles.bigText} >Try to remember special tiles</Text>
        </Animated.View>
        <CustomButton text="Start" onPress={this.startGame} />
      </View>
    );
  }

  onSquarePress = (index) => {
    if (this.isAnimating || this.state.squares[index].pushed || this.state.lives <= 0) {
      return;
    }
    this.state.squares[index].pushed = true;
    if (this.state.squares[index].special) {
      this.specialSquirePushed++;
      this.state.score += 10;
    }
    else {
      this.state.lives--;
    }
    this.forceUpdate();

    Animated.timing(this.state.squares[index].animation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      if (this.specialSquirePushed == this.specialSquireRequired) {
        this.startNextLevel();
      }
      else if (this.state.lives == 0) {
        this.endGame();
      }
    });


  }

  renderSquares = () => {
    var squareWidth = _SCREEN.width / Math.sqrt(this.state.squares.length);
    return this.state.squares.map((square, index) => {
      return (
        <Animated.View
          key={index}
          style={{
            width: squareWidth,
            height: squareWidth,
            padding: 4,
            transform: [{
              rotateX: square.animation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "180deg"]
              })
            }],
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              borderRadius: squareWidth / 4,
              backgroundColor: square.pushed ? (square.special ? colors.primary : colors.secondaryLight) : colors.secondaryLight2,
            }}
            activeOpacity={1}
            onPressIn={() => {
              this.onSquarePress(index);
            }}
          />
        </Animated.View>
      )
    });
  }

  renderGame = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{
          paddingBottom: 10,
          width: _SCREEN.width,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20
        }} >
          <BouncingText style={{ ...styles.text, textAlign: "center" }} >Level: {this.state.level}</BouncingText>
          <BouncingText style={{ ...styles.bigText, fontWeight: "bold" }} >Score: {this.state.score}</BouncingText>
          <SwappingText style={{ ...styles.text, textAlign: "center" }} >Lives: {this.state.lives}</SwappingText>
        </View>

        <View
          style={{
            width: _SCREEN.width,
            height: _SCREEN.width,
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {this.renderSquares()}
        </View>
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
})