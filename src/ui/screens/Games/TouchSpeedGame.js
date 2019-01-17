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
  UIManager,
  Linking,
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram } from "../../../core";
import CustomButton from "../../../components/CustomButton";

const TIMEOUT_SECONDS = 5;

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

    this.state = {
      pressCounter: 0,
      gameStatus: "paused", // active - completed - paused
      remainingSeconds: TIMEOUT_SECONDS,
    };
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  componentWillMount() {
  }

  componentWillUnmount() {
    clearInterval(this.tick);
  }

  handleBackPress = () => {
    return this.state.gameStatus == "active" ? true : false;
  }

  startGame = () => {
    this.setState({ gameStatus: "active" });
    setInterval(this.tick, 1000);
  }

  tick = () => {
    this.setState({ remainingSeconds: this.state.remainingSeconds - 1 }, () => {
      if (this.state.remainingSeconds == 0 && this.state.gameStatus == "active") {
        clearInterval(this.tick);
        this.setState({ gameStatus: "completed" });
      }
    });
  }

  pressed = () => {
    if (this.state.gameStatus != "active") return;
    this.setState({ pressCounter: this.state.pressCounter + 1 });
  }

  render() {
    let timePercentage = this.state.remainingSeconds / TIMEOUT_SECONDS;
    return (
      <View style={styles.container} >
        {
          this.state.gameStatus == "paused" &&
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
            <View style={{ paddingBottom: 20 }} >
              <Text style={styles.bigText} >Press the screen as fast as you can</Text>
            </View>
            <CustomButton text="Start" onPress={(this.startGame)} />
          </View>
        }

        {
          this.state.gameStatus == "active" &&
          <View style={{ flex: 1 }}>
            <TouchableOpacity activeOpacity={1} onPressIn={this.pressed} style={styles.touchableArea} />

            <View style={{ backgroundColor: "#0006", alignSelf: "center", width: "90%", borderRadius: 15, overflow: "hidden" }} >
              <Text style={[styles.bigText, { fontSize: 20, paddingVertical: 10 }]} >{`Kalan Süre: ${this.state.remainingSeconds} sn`}</Text>
              <View
                style={{
                  position: "absolute",
                  zIndex: -1,
                  height: "100%",
                  width: `${(timePercentage) * 100}%`,
                  backgroundColor: `rgba(${255 - (timePercentage * 255)},${timePercentage * 255},0,0.5)`,
                }}
              />
            </View>

            <View style={{ flex: 1, justifyContent: "center" }} >
              <Text style={styles.bigText} >{this.state.pressCounter}</Text>
            </View>

          </View>
        }

        {
          this.state.gameStatus == "completed" &&
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
            <Text style={styles.bigText} >Tebrikler!</Text>
            <Text style={styles.bigText} >{`${TIMEOUT_SECONDS} saniyede ${this.state.pressCounter} defa dokundunuz`}</Text>
          </View>
        }
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
    backgroundColor: colors.secondaryDark,
  },
  touchableArea: {
    position: "absolute",
    zIndex: 99,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent"
  },
  text: {
    fontSize: 15,
    color: colors.secondaryLight3
  },
  bigText: {
    fontSize: 20,
    color: colors.secondaryLight3,
    textAlign: "center",
  }
})