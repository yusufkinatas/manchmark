import React, { Component } from "react";
import {
  View,
  Text,
  Easing,
} from "react-native";
import PropTypes from "prop-types";

import { store, _APP_SETTINGS, _SCREEN, nav, user, Generics } from "../core"
import DelayedText from "./DelayedText";
import DelayedView from "./DelayedView";
import CustomButton from "./CustomButton";
import LoadingIndicator from "./LoadingIndicator";

export default class GameResult extends Component {

  constructor(props) {
    super(props);

    switch (props.game) {
      case "CalculationSpeedGame":
        this.highScoreName = "calculationSpeedHS"
        break;
      case "NumberMemoryGame":
        this.highScoreName = "numberMemoryHS"
        break;
      case "ReactionSpeedGame":
        this.highScoreName = "reactionSpeedHS"
        break;
      case "TouchSpeedGame":
        this.highScoreName = "touchSpeedHS"
        break;
      case "TypingSpeedGame":
        this.highScoreName = "typingSpeedHS"
        break;
      case "VerbalMemoryGame":
        this.highScoreName = "verbalMemoryHS"
        break;
      case "VisualMemoryGame":
        this.highScoreName = "visualMemoryHS"
        break;

      default:
        this.highScoreName = "";
        alert("YANLIŞ OYUN İSMİ " + props.game);
        break;
    }

    this.state = {
      isLoading: true,
      highScore: user.get()[this.highScoreName],
      currentScore: props.score,
      text: "",
      errorText: ""
    };

  }

  componentDidMount() {
    console.log(this.state)
    if (this.state.highScore == null || this.state.highScore < this.state.currentScore) {

      if (user.get().isConnected) {

        user.updateHighscore(this.state.currentScore, this.highScoreName).then(() => {
          this.setState({ isLoading: false, text: "NEW HIGHSCORE!" });
        }).catch(() => {
          this.setState({ isLoading: false, text: "NEW HIGHSCORE!", errorText: "Can't update highscore." });
        });

      }
      else {
        this.setState({ isLoading: false, text: "NEW HIGHSCORE!", errorText: "No internet connection." })
      }

    }
    else {
      this.setState({ isLoading: false, text: "Repetition is the mother of skill" });
    }
  }

  componentWillUnmount() {

  }

  renderContent = () => {
    return (
      <View style={Generics.container}>

        <DelayedText delay={0} style={Generics.bigText} >{`Your Score: ${this.state.currentScore}`}</DelayedText>
        <DelayedText delay={200} style={Generics.bigText} >{`Your Highscore: ${this.state.highScore ? this.state.highScore : "-"}`}</DelayedText>
        <View style={{ height: 20 }} />
        <DelayedText delay={400} style={Generics.bigText} >{this.state.text}</DelayedText>
        <DelayedText delay={600} style={Generics.errorText} >{this.state.errorText}</DelayedText>
        {
          this.props.onRestart &&
          <DelayedView delay={this.state.errorText ? 800 : 600} style={{ paddingTop: 20 }}>
            <CustomButton style={Generics.container} text="Restart" onPress={this.props.onRestart} />
          </DelayedView>
        }

      </View>
    );
  }

  render() {
    return (
      <View style={Generics.container}>
        {this.state.isLoading ? <LoadingIndicator /> : this.renderContent()}
      </View>
    )
  }
}

GameResult.propsTypes = {
  game: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired
}