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
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram, utils } from "../../../core";
import CustomButton from '../../../components/CustomButton';

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

    this.phase = 0;
    this.randomDelay = 0;

    this.state = { 
      gameStatus: "info", // info - active - finished 
      reactionTime: [0, 0, 0, 0, 0],
      playingState: "waiting",
      isPlaying: false
    };
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
  }

  renderInfo = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >

        <View style={{ paddingBottom: 20 }} >
          <Text style={styles.bigText} >Press the screen as soon as you saw green</Text>
        </View>
        <CustomButton text="Start" onPress={this.startGame} />
      </View>
    );
  }

  betweenPhases = () => {
    return(
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.bigText}>Between the Phases</Text>
        <CustomButton text="yeni phase" onPress={() =>  this.setState({playingState:"waiting"})}/>
      </View>
    );
  }

  renderAnswerPhase = () => {
    // Ekran griyken x saniye sonra yesil olacak

    return(
      <CustomButton text='tikla' onPress={this.onAnswer}/>
      );
    }
  

  renderWaitingPhase = (randomDelay) => {
    setTimeout(() => {
      this.setState({ playingState: "answering" });
    }, randomDelay * 1000);
    console.log('renderwaiting phase', randomDelay);
    return (<Text style={styles.bigText}>Wait for it</Text>);
  }

  onAnswer = () => {
    console.log('onAnswer');
    this.setState({playingState:"betweenPhases"});
  }

  renderGame = () => {

      let randomDelay = utils.randomDoubleBetween(4,5);

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
 
  render() {
    return (
      <View style={styles.container}>
        {this.state.gameStatus == "info" && this.renderInfo()}
        {this.state.gameStatus == "active" && this.renderGame()}
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

  bigText: {
    fontSize: 20,
    color: colors.secondaryLight3,
    textAlign: "center",
    paddingHorizontal: 20
  }
})