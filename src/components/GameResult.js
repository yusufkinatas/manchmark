import React, { Component } from "react";
import {
  View,
  Text,
  Easing,
  Image,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";

import { store, _APP_SETTINGS, _SCREEN, nav, user, Generics, utils, translate } from "../core"
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
      userCount: 1,
      rank: 0,
    };

  }

  componentDidMount() {
    //console.log(this.state);
    if (this.state.highScore == null || this.state.highScore < this.state.currentScore) {

      user.updateHighscore(this.state.currentScore, this.game.hsName).then(() => {
        user.getRank(this.game.hsName).then(res => {
          //alert(`usercount ${res.userCount} rank ${res.rank}`)
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

  isHighScore = () => {
    if (this.state.highScore == null || this.state.highScore < this.state.currentScore) {
      return true;
    }
    else {
      return false;
    }
  }

  renderContent = () => {
    return (
      <View style={Generics.container} >

        {this.isHighScore() &&
          <DelayedView delay={0} style={{ ...styles.infoContainer, justifyContent: "center", paddingTop: 10 }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold", paddingTop: 0 }} >{"Congratulations!\nNew Highscore"}</Text>
          </DelayedView>
        }

        <DelayedView delay={0} style={{ ...styles.infoContainer, borderRadius: 5, borderWidth: 2, borderColor: this.game.backgroundColor }} >
          <View style={{ width: "100%" }} >
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }} >
              <Text style={{ ...Generics.bigText, fontWeight: "bold", fontSize: 25 }} >Score</Text>
              <Text style={{ ...Generics.bigText, fontWeight: "bold", fontSize: 25 }} >{this.state.currentScore}</Text>
            </View>

            {this.props.extraData.map(({ data, important }) => {
              let fontStyle = {
                ...Generics.bigText,
                color: important ? colors.secondaryLight2 : colors.secondaryLight,
                fontSize: important ? 16 : 12,
                fontWeight: important ? "bold" : "normal",
              };
              return (
                <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }} >
                  <Text style={fontStyle} >{data[0]}</Text>
                  <Text style={fontStyle} >{data[1]}</Text>
                </View>
              );
            })}
          </View>
        </DelayedView>



        <DelayedView delay={200} style={{ ...styles.infoContainer, borderRadius: 5, borderWidth: 2, borderColor: this.game.backgroundColor }} >
          <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >Highscore</Text>
          <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{this.isHighScore() ? this.state.currentScore : this.state.highScore}</Text>
        </DelayedView>
        <DelayedView delay={400} style={{ ...styles.infoContainer, borderRadius: 5, borderWidth: 2, borderColor: this.game.backgroundColor }} >
          <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >Average of Players</Text>
          <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{utils.truncateFloatingNumber(user.get().globalAverages[this.game.hsName], 2)}</Text>
        </DelayedView>

        {(this.isHighScore() && user.get().isConnected) &&
          <DelayedView delay={800} style={{ ...styles.infoContainer, borderRadius: 5, borderWidth: 2, borderColor: this.game.backgroundColor, justifyContent: "center" }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >Your score is higher than {utils.truncateFloatingNumber(100 - (this.state.rank / this.state.userCount * 100), 2)}% of players</Text>
          </DelayedView>
        }

        <DelayedView delay={600} >
          <CustomButton backgroundColor={this.game.backgroundColor} style={Generics.container} text="Restart" onPress={this.props.onRestart} />
        </DelayedView>

        <DelayedView delay={800} style={{ position: "absolute", bottom: 20 }} >
          <Text style={{ ...Generics.text, color: colors.secondaryLight2 }} >Repetition is the key to success!</Text>
        </DelayedView>

      </View>
    );
  }

  render() {
    return (
      <View style={Generics.container}>
        {this.state.isLoading ? <LoadingIndicator text={translate("loading")} color={this.game.backgroundColor} /> : this.renderContent()}
      </View>
    )
  }
}

GameResult.propsTypes = {
  game: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired,
  extraData: PropTypes.array,
}

GameResult.defaultProps = {
  extraData: []
}

const styles = StyleSheet.create({
  infoContainer: {
    width: _SCREEN.width * 0.8,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
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