import React, { Component } from 'react';
import { Navigation } from "react-native-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram, utils } from "../../../core";
import CustomButton from '../../../components/CustomButton';
import DelayedText from '../../../components/DelayedText';

export default class ReactionSpeedGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Reaction Speed',
        },
      }
    };
  }

  constructor(props) {
    super(props); 

    this.answer;
    this.phase = 0;
    this.randomDelay = 0;
    this.startTime;
    this.endTime;
    this.reactionTime = [];

    this.state = { 
      gameStatus: "info", // info - active - finished
      playingState: "waiting",
      isPlaying: false
    };
  }

  componentWillUpdate() {
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.gameStatus == "info" && this.state.gameStatus == "active") {
      //alert("jej");
    }
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
  }

  renderInfo = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >

        <View style={{ paddingBottom: 20 }} >
          <Text style={styles.bigText} >Press the screen as soon as you saw the green</Text>
        </View>
        <CustomButton text="Start" onPress={this.startGame} />
      </View>
    );
  }

  betweenPhases = () => {
    if(this.answer){
      return(
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" , width: _SCREEN.width}}>
          <TouchableOpacity style={{...styles.touchableArea}} onPressIn={() =>  this.setState({playingState:"waiting"})}>
          <Text style={styles.bigText}>{this.reactionTime[this.phase-1]} ms</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else {
      return(
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" , width: _SCREEN.width}}>
          <TouchableOpacity style={{...styles.touchableArea, backgroundColor: colors.failure}} activeOpacity={1} onPressIn={() =>  this.setState({playingState:"waiting"})}>
          <Text style={styles.bigText}>You pressed early!</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderAnswerPhase = () => {
    // Ekran griyken x saniye sonra yesil olacak
    this.startTime = (new Date()).getTime();
    return(
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: _SCREEN.width }}>
        <TouchableOpacity style={{...styles.touchableArea, backgroundColor: colors.primary}} onPressIn={this.onAnswer}>
        <Text style={styles.bigText}>Press Now!</Text>
        </TouchableOpacity>
      </View>
      );
    }
  
  renderWaitingPhase = (randomDelay) => {
    this.timer = setTimeout(() => {
      this.setState({ playingState: "answering" });
    }, randomDelay * 1000);
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: _SCREEN.width }}>
      <TouchableOpacity style={styles.touchableArea} text='tikla' onPressIn={this.onWrongAnswer}>
      <Text style={styles.bigText}>Wait for it</Text>
      </TouchableOpacity>
    </View>
    );
  }

  onAnswer = () => {
    this.answer = true;
    this.endTime = (new Date()).getTime();
    this.reactionTime.push(this.endTime - this.startTime);
    this.phase++;
    this.setState({playingState:"betweenPhases"});
  }

  onWrongAnswer = () => {
    this.answer = false;
    this.reactionTime.push(0);
    clearTimeout(this.timer);
    this.phase++
    this.setState({playingState: "betweenPhases"});
  }

  renderGame = () => {

      let randomDelay = utils.randomDoubleBetween(1.25, 2.5);
      if(this.phase < 5){
        switch(this.state.playingState) {
          case "waiting":
            return (this.renderWaitingPhase(randomDelay));
            break;
          case "answering":
            return(this.renderAnswerPhase());  
            break;
          case "betweenPhases":
            return(this.betweenPhases());
            break;
            // code block
          default:
        }
      }
    else {
      this.setState({gameStatus: "finished"});
    }
  }
 
  renderFinish() {
    return(
      <View>
        <DelayedText style={{...styles.bigText, fontSize: 50}} delay={500}>Average: {this.findAverage()}ms</DelayedText>
        <DelayedText style={styles.bigText} delay={1000}>Phase 1: {this.reactionTime[0]}ms</DelayedText>
        <DelayedText style={styles.bigText} delay={1500}>Phase 2: {this.reactionTime[1]}ms</DelayedText>
        <DelayedText style={styles.bigText} delay={2000}>Phase 3: {this.reactionTime[2]}ms</DelayedText>
        <DelayedText style={styles.bigText} delay={2500}>Phase 4: {this.reactionTime[3]}ms</DelayedText>
        <DelayedText style={styles.bigText} delay={3000}>Phase 5: {this.reactionTime[4]}ms</DelayedText>
      </View>
    );
  }

  findAverage = () => {
    let index;
    let average = 0;
    let count = 0;
    for (index = 0; index < this.reactionTime.length; index++) {
        if (this.reactionTime[index] != 0){
          average += this.reactionTime[index];
          count++
        }
    }
    if(count != 0){
      average = average / count;
    }
    return average;
  }

  render() {
    return (
      <View style={styles.container}>
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
    backgroundColor: colors.secondary
  },

  bigText: {
    fontSize: 20,
    color: colors.secondaryLight3,
    textAlign: "center",
    paddingHorizontal: 20
  },
  touchableArea: {
    position: "absolute",
    zIndex: 99,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center"
  }
})