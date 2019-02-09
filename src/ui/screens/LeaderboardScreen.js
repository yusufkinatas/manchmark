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
  ScrollView,
  FlatList,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, api, user, utils } from "../../core";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

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
    this.dragEnabled = true;
    this.state = {
      highscores: null,
      averages: null,
      selectedGameIndex: 0
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
    }).catch(err => console.log(err));
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.scrollViewRef.scrollTo({ x: 10, animated: false });
    }, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  renderGames = () => {
    return (
      _APP_SETTINGS.games.map((g, index) => {
        return (
          <TouchableOpacity
            key={g.name}
            onPress={() => this.selectGame(index)}
            style={{ margin: 5, paddingHorizontal: 5, paddingVertical: 5, justifyContent: "center", alignItems: "center", backgroundColor: this.state.selectedGameIndex == index ? colors.primary : colors.secondaryLight, borderRadius: 5 }}
          >
            <Icon name={g.icon} color={colors.secondaryLight3} size={10} />
            <Text style={{ ...Generics.text, fontSize: 10 }} >{g.fullName}</Text>
          </TouchableOpacity>
        );
      })
    );
  }

  selectGame = (index) => {
    if (!this.state.highscores && this.state.averages && !this.flatList) {
      return;
    }
    this.dragEnabled = false
    this.setState({ selectedGameIndex: index }, () => {
      this.flatList.scrollToIndex({ animated: false, index });
      console.log("SELECT PAGE", index)
    })
  }

  renderHs = (rank, nickname, hs) => {
    return (
      <View key={nickname} style={{ flexDirection: "row", marginVertical: 8, marginHorizontal: 25, backgroundColor: nickname == user.get().nickname ? colors.primary : colors.secondaryLight, borderRadius: 5, elevation: 5 }} >

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

  renderLeaderboard = (data) => {
    const game = _APP_SETTINGS.games.find(g => g.hsName == data.item);
    return (
      <View style={{ width: _SCREEN.width }} >


        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: _SCREEN.width, paddingHorizontal: 20, height: 50 }} >
          {
            game.name != _APP_SETTINGS.games[0].name &&
            <TouchableOpacity style={{ position: "absolute", left: 20 }} >
              <Icon name="caret-left" size={30} color={colors.primary} />
            </TouchableOpacity>
          }

          <View style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center" }} >
            <Icon name={game.icon} size={30} color={colors.secondaryLight3} />
            <Text style={Generics.bigText} >{game.fullName}</Text>
          </View>


          {
            game.name != _APP_SETTINGS.games[_APP_SETTINGS.games.length - 1].name &&
            <TouchableOpacity style={{ position: "absolute", right: 20 }} >
              <Icon name="caret-right" size={30} color={colors.primary} />
            </TouchableOpacity>
          }
        </View>


        <View style={{ flexDirection: "row", marginVertical: 8, marginHorizontal: 25, backgroundColor: colors.secondaryLight, borderRadius: 5, elevation: 5 }} >

          <View style={{ flex: 1, flexDirection: "row", minHeight: 50, paddingHorizontal: 5, alignItems: "center" }} >
            <View style={{ flex: 1 }} >
              <Text style={{ ...Generics.bigText, fontWeight: "bold", textAlign: "left" }} >Average Score</Text>
            </View>
            {
              this.state.averages[game.hsName]
                ?
                <Text style={{ ...Generics.text }} >
                  {utils.truncateFloatingNumber(this.state.averages[game.hsName], 2)}
                  <Text style={{ ...Generics.text, color: colors.secondaryLight2 }} > Points</Text>
                </Text>
                :
                <ActivityIndicator color={colors.primary} />
            }
          </View>
        </View>

        <ScrollView style={{ flex: 1, width: _SCREEN.width }} >
          {
            this.state.highscores[game.hsName] ? this.state.highscores[game.hsName].map((user, index) =>
              (this.renderHs(index + 1, user.nickname, user[game.hsName]))
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

  renderListEmpty = () => {
    return (
      <View style={Generics.container} >
        <LoadingIndicator />
      </View>
    )
  }

  render() {
    return (
      <View style={Generics.container} >

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 50 }} ref={r => { this.scrollViewRef = r }} >
          {this.renderGames()}
        </ScrollView>

        <FlatList
          ref={r => this.flatList = r}
          contentContainerStyle={{ height: "100%" }}
          horizontal
          pagingEnabled
          onScroll={(e) => {
            let index = Math.floor(e.nativeEvent.contentOffset.x / _SCREEN.width);
            if (this.state.selectedGameIndex != index) {
              this.selectGame(index);
            }
          }}
          onScrollToIndexFailed={() => { }}
          data={this.state.highscores ? Object.keys(this.state.highscores) : []}
          keyExtractor={(item, index) => ("p" + index)}
          overScrollMode={Platform.OS === "android" ? "never" : "always"}
          renderItem={this.renderLeaderboard}
          ListEmptyComponent={this.renderListEmpty}
        />

      </View>
    )
  }
}