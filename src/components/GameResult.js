import React, { Component } from "react";
import {
  View,
  Text,
  Easing,
  Image,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";

import { store, _APP_SETTINGS, _SCREEN, nav, user, Generics, utils } from "../core"
import DelayedText from "./DelayedText";
import DelayedView from "./DelayedView";
import CustomButton from "./CustomButton";
import LoadingIndicator from "./LoadingIndicator";

const colors = _APP_SETTINGS.colors;

export default class GameResult extends Component {

  constructor(props) {
    super(props);

    this.game = _APP_SETTINGS.games[_APP_SETTINGS.games.findIndex(g => g.name == props.game)];

    this.state = {
      isLoading: true,
      highScore: user.get()[this.game.hsName],
      currentScore: props.score,
      text: "",
      errorText: "",
      userCount: 0,
      rank: 0,
    };

  }

  componentDidMount() {
    console.log(this.state)
    if (this.state.highScore == null || this.state.highScore < this.state.currentScore) {

      user.updateHighscore(this.state.currentScore, this.game.hsName).then(() => {
        user.getRank(this.game.hsName).then(res => {
          // alert(`usercount ${res.userCount} rank ${res.rank}`)
          this.setState({ isLoading: false, userCount: res.userCount, rank: res.rank });
        }).catch(err => this.setState({ isLoading: false }));
      }).catch(() => {
        this.setState({ isLoading: false, errorText: "Can't update highscore." });
      });

    }
    else {
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {

  }


  renderContent = () => {
    if (this.state.highScore == null || this.state.highScore < this.state.currentScore) {
      return (
        <View style={Generics.container} >

          <DelayedView delay={0} style={{ ...styles.infoContainer, backgroundColor: this.game.backgroundColor, justifyContent: "center" }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold", fontSize: 25 }} >{"Congratulations!\nNew Highscore"}</Text>
          </DelayedView>

          <DelayedView delay={200} style={{ ...styles.infoContainer, backgroundColor: this.game.backgroundColor + "bb" }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >Score</Text>
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{this.state.currentScore}</Text>
          </DelayedView>

          <DelayedView delay={400} style={{ ...styles.infoContainer, backgroundColor: this.game.backgroundColor + "88" }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >Average of Players</Text>
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{utils.truncateFloatingNumber(user.get().globalAverages[this.game.hsName], 2)}</Text>
          </DelayedView>

          <DelayedView delay={600} style={{ ...styles.infoContainer, backgroundColor: this.game.backgroundColor + "55" }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >Your rank</Text>
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{this.state.rank} / {this.state.userCount}</Text>
          </DelayedView>

          <DelayedView delay={800} style={{ ...styles.infoContainer, backgroundColor: this.game.backgroundColor + "33", justifyContent: "center" }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >You are better than {utils.truncateFloatingNumber(100 - (this.state.rank / this.state.userCount * 100), 2)}% of people</Text>
          </DelayedView>


          <DelayedView delay={1000} >
            <CustomButton backgroundColor={this.game.backgroundColor} style={Generics.container} text="Restart" onPress={this.props.onRestart} />
          </DelayedView>

        </View>
      )
    }
    else {
      return (
        <View style={Generics.container} >

          <DelayedView delay={0} style={{ ...styles.infoContainer, backgroundColor: this.game.backgroundColor }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >Score</Text>
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{this.state.currentScore}</Text>
          </DelayedView>
          <DelayedView delay={200} style={{ ...styles.infoContainer, backgroundColor: this.game.backgroundColor + "bb" }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >Highscore</Text>
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{this.state.highScore}</Text>
          </DelayedView>
          <DelayedView delay={400} style={{ ...styles.infoContainer, backgroundColor: this.game.backgroundColor + "88" }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >Average of Players</Text>
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{utils.truncateFloatingNumber(user.get().globalAverages[this.game.hsName], 2)}</Text>
          </DelayedView>
          <DelayedView delay={600} style={{ ...styles.infoContainer, backgroundColor: this.game.backgroundColor + "55", justifyContent: "center" }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >Repetition is the key to success!</Text>
          </DelayedView>

          <DelayedView delay={800} >
            <CustomButton backgroundColor={this.game.backgroundColor} style={Generics.container} text="Restart" onPress={this.props.onRestart} />
          </DelayedView>

        </View>
      );
    }
  }

  render() {
    return (
      <View style={Generics.container}>
        {this.state.isLoading ? <LoadingIndicator color={this.game.backgroundColor} /> : this.renderContent()}
      </View>
    )
  }
}

GameResult.propsTypes = {
  game: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  infoContainer: {
    width: _SCREEN.width * 0.8,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    // elevation: 3,
    marginBottom: 20,
    paddingHorizontal: 5,
    paddingVertical: 7,
  }
});



{/* <View style={Generics.container}>

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

      </View> */}