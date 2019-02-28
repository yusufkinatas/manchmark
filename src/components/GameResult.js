import React, { Component } from "react";
import {
  View,
  Text,
  Easing,
  Image,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";

import { store, _APP_SETTINGS, _SCREEN, nav, user, Generics, utils, translate, audio } from "../core"
import DelayedText from "./DelayedText";
import DelayedView from "./DelayedView";
import CustomButton from "./CustomButton";
import LoadingIndicator from "./LoadingIndicator";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'react-native-admob'

var adCounter = 0;
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
    if (this.state.highScore == null || this.state.highScore < this.state.currentScore) {
      user.updateHighscore(this.state.currentScore, this.game.hsName).then(() => {
        user.getRank(this.game.hsName).then(res => {
          this.setState({ isLoading: false, userCount: res.userCount, rank: res.rank });
          audio.play("highscore");
        }).catch(err => {
          audio.play("highscore");
          this.setState({ isLoading: false });
        });
      }).catch(() => {
        this.setState({ isLoading: false, errorText: translate("cantUpdateHighscore") });
      });
    }
    else {
      this.setState({ isLoading: false });
    }
    adCounter++;
    if (adCounter % 5 == 0) {
      AdMobInterstitial.setAdUnitID('ca-app-pub-8579542894335012/4831460364');
      AdMobInterstitial.requestAd()
        .then(() => AdMobInterstitial.showAd())
        .catch(err => console.log(err));
    }
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
      <View style={Generics.container}>
        <View style={{ ...Generics.container, marginBottom: 50 }} >

          {this.isHighScore() &&
            <DelayedView delay={0} style={{ ...styles.infoContainer, justifyContent: "center", paddingTop: 10 }} >
              <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{translate("congratulations") + "\n" + translate("newHighscore")}</Text>
            </DelayedView>
          }

          <DelayedView delay={0} style={{ ...styles.infoContainer, borderRadius: 5, borderWidth: 2, borderColor: this.game.backgroundColor }} >
            <View style={{ width: "100%" }} >
              <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }} >
                <Text style={{ ...Generics.bigText, fontWeight: "bold", fontSize: 25 }} >{translate("score")}</Text>
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
                    <Text style={{ ...fontStyle, flex: 1, textAlign: "left" }} >{data[0]}</Text>
                    <Text style={fontStyle} >{data[1]}</Text>
                  </View>
                );
              })}
            </View>
          </DelayedView>

          <DelayedView delay={200} style={{ ...styles.infoContainer, borderRadius: 5, borderWidth: 2, borderColor: this.game.backgroundColor }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold", flex: 1, textAlign: "left" }} >{translate("highscore")}</Text>
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{this.isHighScore() ? this.state.currentScore : this.state.highScore}</Text>
          </DelayedView>
          <DelayedView delay={400} style={{ ...styles.infoContainer, borderRadius: 5, borderWidth: 2, borderColor: this.game.backgroundColor }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold", flex: 1, textAlign: "left" }} >{translate("averageOfPlayers")}</Text>
            <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >{utils.truncateFloatingNumber(user.get().globalAverages[this.game.hsName], 2)}</Text>
          </DelayedView>

          {(this.isHighScore() && user.get().isConnected) &&
            <DelayedView delay={800} style={{ ...styles.infoContainer, borderRadius: 5, borderWidth: 2, borderColor: this.game.backgroundColor, justifyContent: "center" }} >
              <Text style={{ ...Generics.bigText, fontWeight: "bold" }} >
                {translate("yourScoreIsHigherThanXOfPlayers").replace("2", utils.truncateFloatingNumber(100 - (this.state.rank / this.state.userCount * 100), 2))}
              </Text>
            </DelayedView>
          }

          <DelayedView delay={600} >
            <CustomButton backgroundColor={this.game.backgroundColor} style={Generics.container} text={translate("restart")} onPress={this.props.onRestart} />
          </DelayedView>

        </View>
        <DelayedView delay={800} style={{ position: "absolute", bottom: 20 }} >
          <Text style={{ ...Generics.text, color: colors.secondaryLight2 }} >{translate("repetitionIsKeyToSuccess")}</Text>
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
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 5,
    paddingVertical: 7,
  }
});