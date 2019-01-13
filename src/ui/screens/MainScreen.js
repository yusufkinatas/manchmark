import React, { Component } from 'react';
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
  Linking
} from 'react-native';
import { store, _APP_SETTINGS, _SCREEN, ram } from "../../core";
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class MainScreen extends Component {

  constructor(props) {
    super(props);
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  render() {
    return(
      <View style={{flex:1, alignItems: "center", justifyContent: "center"}} >
        <Text>MAIN SCREEN</Text>
      </View>
    )
  }
}



const colors = _APP_SETTINGS.colors;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    padding: 5,
  },
  cardTouchable: {
    flex: 1,
    backgroundColor: "#0008",
    justifyContent: "center",
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 25,
    color: "#ddd",
    fontWeight: "bold",
    zIndex: 5,
    paddingLeft: 20,
    paddingRight: 20,
    textShadowColor: "black",
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 3,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0005",
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
  },
  cardGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 4,
    borderRadius: 15
  }

})