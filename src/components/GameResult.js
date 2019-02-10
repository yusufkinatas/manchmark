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

    this.game = _APP_SETTINGS.games[_APP_SETTINGS.games.findIndex(g => g.name == props.game)];

    this.state = {
      isLoading: true,
      highScore: user.get()[this.game.hsName],
      currentScore: props.score,
      text: "",
      errorText: ""
    };

  }

  componentDidMount() {
    console.log(this.state)
    if (this.state.highScore == null || this.state.highScore < this.state.currentScore) {

      user.updateHighscore(this.state.currentScore, this.game.hsName).then(() => {
        this.setState({ isLoading: false, text: "NEW HIGHSCORE!" });
      }).catch(() => {
        this.setState({ isLoading: false, text: "NEW HIGHSCORE!", errorText: "Can't update highscore." });
      });

    }
    else {
      this.setState({ isLoading: false, text: "Repetition is the key to success!" });
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
            <CustomButton backgroundColor={this.game.backgroundColor} style={Generics.container} text="Restart" onPress={this.props.onRestart} />
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