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
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, api, user, utils } from "../../core";
import CustomButton from "../../components/CustomButton";

const colors = _APP_SETTINGS.colors;

export default class LeaderboardScreen extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Leaderboard',
        },
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      highscores: {

      },
      averages: {

      },
      selectedGame: _APP_SETTINGS.games[0].hsName
    };


  }

  componentWillMount() {
    api.getLeaderboard(25).then(res => {
      console.log("HIGHSCORES", res);
      this.setState({ highscores: res });
    }).catch(err => console.log(err));
    api.getAverages().then(res => {
      console.log("AVERAGES", res);
      this.setState({ averages: res });
    }).catch(err => console.log(err))
  }

  renderGames = () => {
    return (
      _APP_SETTINGS.games.map(g => {
        return (
          <TouchableOpacity
            key={g.name}
            onPress={() => { this.setState({ selectedGame: g.hsName }) }}
            style={{ margin: 5, paddingHorizontal: 5, paddingVertical: 5, justifyContent: "center", alignItems: "center", backgroundColor: this.state.selectedGame == g.hsName ? colors.primary : colors.secondaryLight, borderRadius: 5 }}
          >
            <Icon name={g.icon} color={colors.secondaryLight3} size={10} />
            <Text style={{ ...Generics.text, fontSize: 10 }} >{g.fullName}</Text>
          </TouchableOpacity>
        );
      })
    );
  }

  renderHs = (rank, nickname, hs) => {
    return (
      <View style={{ flexDirection: "row", marginVertical: 8, marginHorizontal: 25, backgroundColor: nickname == user.get().nickname ? colors.primary : colors.secondaryLight, borderRadius: 5, elevation: 5 }} >

        <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: colors.secondaryDark, paddingHorizontal: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderRightWidth: 1, borderRightColor: colors.secondary }} >
          <Text style={Generics.text} >{rank}</Text>
        </View>

        <View style={{ flex: 1, flexDirection: "row", minHeight: 50, paddingHorizontal: 5, alignItems: "center" }} >

          <View style={{ flex: 1 }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold", textAlign: "left" }} >{nickname}</Text>
          </View>

          <Text style={{ ...Generics.text }} >
            {utils.truncateFloatingNumber(hs, 2)}
            <Text style={{ ...Generics.text, color: colors.secondaryLight2 }} > Points</Text>
          </Text>

        </View>

      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }} >

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} >
            {this.renderGames()}
          </ScrollView>
        </View>

        <View>
          <View style={{ flexDirection: "row", marginVertical: 8, marginHorizontal: 25, backgroundColor: colors.secondaryLight, borderRadius: 5, elevation: 5 }} >
            <View style={{ flex: 1, flexDirection: "row", minHeight: 50, paddingHorizontal: 5, alignItems: "center" }} >

              <View style={{ flex: 1 }} >
                <Text style={{ ...Generics.bigText, fontWeight: "bold", textAlign: "left" }} >Average Score</Text>
              </View>

              {
                this.state.averages[this.state.selectedGame]
                  ?
                  <Text style={{ ...Generics.text }} >
                    {utils.truncateFloatingNumber(this.state.averages[this.state.selectedGame], 2)}
                    <Text style={{ ...Generics.text, color: colors.secondaryLight2 }} > Points</Text>
                  </Text>
                  :
                  <ActivityIndicator color={colors.primary} />
              }


            </View>
          </View>
        </View>

        <ScrollView style={{ flex: 1, width: _SCREEN.width }} >
          {
            this.state.highscores[this.state.selectedGame] ? this.state.highscores[this.state.selectedGame].map((user, index) =>
              (this.renderHs(index + 1, user.nickname, user[this.state.selectedGame]))
            )
              :
              <View style={Generics.container} >
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
          }
        </ScrollView>

      </View>
    )
  }
}