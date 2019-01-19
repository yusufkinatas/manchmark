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
  LayoutAnimation,
  PanResponder
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram } from "../../../core";
import CustomButton from "../../../components/CustomButton";
import CounterBar from "../../../components/CounterBar";
import ProgressBar from "../../../components/ProgressBar";


const TIMEOUT_MS = 10000;

export default class TouchSpeedGame extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Touch Speed',
        },
      }
    };
  }

  constructor(props) {
    super(props);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (e, gestureState) => {
        this.pressed();
      }
    });

    this.state = {
      pressCounter: 0,
      gameStatus: "info", // info - active - finished
      remainingTime: TIMEOUT_MS,
      progress: 1,
    };
  }

  componentWillUpdate() {
    // LayoutAnimation.spring();
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
    setTimeout(() => {
      this.setState({ gameStatus: "finished" });
    }, TIMEOUT_MS)

  }

  renderInfo = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >

        <View style={{ paddingBottom: 20 }} >
          <Text style={styles.bigText} >Press the screen as fast as you can</Text>
        </View>
        <CustomButton text="Start" onPress={this.startGame} />
      </View>
    );
  }

  renderGame = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: _SCREEN.width }}>
        <View
          {...this.panResponder.panHandlers}
          style={styles.touchableArea}
        />
        <Text style={{
          fontSize: 70,
          color: colors.primary,
          fontWeight: "bold",
          width: _SCREEN.width,
          textAlign: "center"
        }} >{this.state.pressCounter}</Text>
        <CounterBar time={TIMEOUT_MS} width={_SCREEN.width / 2} color={colors.primary} />
      </View>
    );
  }

  renderFinish = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
        <Text style={styles.bigText} >{`You have pressed the screen ${this.state.pressCounter} times in ${TIMEOUT_MS / 1000} seconds`}</Text>
      </View>
    );
  }

  pressed = () => {
    if (this.state.gameStatus != "active") return;
    this.setState({ pressCounter: this.state.pressCounter + 1 });
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
    backgroundColor: colors.secondaryDark,
  },
  touchableArea: {
    position: "absolute",
    zIndex: 99,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
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
  }
})