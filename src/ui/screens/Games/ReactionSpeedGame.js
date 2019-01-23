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
    this.startTime;
    this.endTime;
    this.reactionTime = [];

    this.state = { 
      gameStatus: "info", // info - active - finished
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
          <Text style={styles.bigText} >Press the screen as soon as you saw green</Text>
        </View>
        <CustomButton text="Start" onPress={this.startGame} />
      </View>
    );
  }

  betweenPhases = () => {
    return(
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" , width: _SCREEN.width}}>
        <TouchableOpacity style={{...styles.touchableArea}} onPressIn={() =>  this.setState({playingState:"waiting"})}>
        <Text style={styles.bigText}>{this.reactionTime[this.phase-1]} ms</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderAnswerPhase = () => {
    // Ekran griyken x saniye sonra yesil olacak
    this.startTime = (new Date()).getTime();
    return(
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: _SCREEN.width }}>
        <TouchableOpacity style={{...styles.touchableArea, backgroundColor: colors.primary}} text='tikla' onPressIn={this.onAnswer}>
        <Text style={styles.bigText}>Press Now!</Text>
        </TouchableOpacity>
      </View>
      );
    }
  

  renderWaitingPhase = (randomDelay) => {
    setTimeout(() => {
      this.setState({ playingState: "answering" });
    }, randomDelay * 1000);
    return (<Text style={styles.bigText}>Wait for it</Text>);
  }

  onAnswer = () => {
    this.endTime = (new Date()).getTime();
    this.reactionTime.push(this.endTime - this.startTime);
    this.phase++;
    this.setState({playingState:"betweenPhases"});
  }

  renderGame = () => {

      let randomDelay = utils.randomDoubleBetween(1.25, 2.5);

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