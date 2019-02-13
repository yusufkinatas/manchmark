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
  Platform,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, api, user, utils } from "../../core";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

const colors = _APP_SETTINGS.colors;

class Leaderboard extends React.PureComponent {

  constructor(props) {
    super(props);
    this.isRefreshing = false;
  }

  // renderHs = (rank, nickname, hs, gameColor) => {
  renderHs = (data) => {
    console.log(data);
    let rank = data.index + 1;
    let nickname = data.item.nickname;
    let hs = data.item[this.props.game.hsName];
    let gameColor = this.props.game.backgroundColor;
    let rankColor;
    switch (rank) {
      case 1:
        rankColor = gameColor;
        break;
      case 2:
        rankColor = gameColor + "bb";
        break;
      case 3:
        rankColor = gameColor + "88"
        break;
      case 4:
        rankColor = gameColor + "55"
        break;
      case 5:
        rankColor = gameColor + "33"
        break;
      default:
        rankColor = colors.secondaryDark + "33";
        break;
    }
    let fontColor = colors.secondaryLight3;
    return (
      <View key={rank} style={{ flexDirection: "row", marginVertical: 8, marginHorizontal: 25, elevation: 5, backgroundColor: colors.secondary, borderRadius: 5 }} >

        <View style={{ alignItems: "center", minWidth: 30, justifyContent: "center", backgroundColor: rankColor, paddingHorizontal: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderRightWidth: 1, borderRightColor: colors.secondary }} >
          <Text style={{ ...Generics.bigText, paddingHorizontal: 0 }} >{rank}</Text>
        </View>

        <View key={nickname} style={{ flexDirection: "row", flex: 1, backgroundColor: nickname == user.get().nickname ? gameColor : colors.secondaryLight, borderTopRightRadius: 5, borderBottomRightRadius: 5 }} >

          <View style={{ flex: 1, flexDirection: "row", minHeight: 50, paddingHorizontal: 5, alignItems: "center" }} >

            <View style={{ flex: 1 }} >
              <Text style={{ ...Generics.bigText, textAlign: "left", color: fontColor }} >{nickname}</Text>
            </View>

            <Text style={{ ...Generics.text, color: fontColor }} >
              {utils.truncateFloatingNumber(hs, 2)}
              <Text style={{ ...Generics.text, color: fontColor }} > Points</Text>
            </Text>

          </View>

        </View>
      </View>
    )
  }

  render() {
    const game = this.props.game;
    return (
      <View style={{ width: _SCREEN.width }} >


        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: _SCREEN.width, paddingHorizontal: 20, height: 50 }} >
          {
            game.name != _APP_SETTINGS.games[0].name &&
            <View style={{ position: "absolute", left: 20 }} >
              <Icon name="caret-left" size={30} color={colors.secondaryLight3} />
            </View>
          }

          <View style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center" }} >
            <Icon name={game.icon} size={30} color={colors.secondaryLight3} />
            <Text style={Generics.bigText} >{game.fullName}</Text>
          </View>


          {
            game.name != _APP_SETTINGS.games[_APP_SETTINGS.games.length - 1].name &&
            <View style={{ position: "absolute", right: 20 }} >
              <Icon name="caret-right" size={30} color={colors.secondaryLight3} />
            </View>
          }
        </View>


        <View style={{ flexDirection: "row", marginVertical: 8, marginHorizontal: 25, backgroundColor: colors.secondary, borderWidth: 3, borderColor: game.backgroundColor, borderRadius: 5, elevation: 5 }} >

          <View style={{ flex: 1, flexDirection: "row", minHeight: 50, paddingHorizontal: 5, alignItems: "center" }} >
            <View style={{ flex: 1 }} >
              <Text style={{ ...Generics.bigText, fontWeight: "bold", textAlign: "left" }} >Average Score</Text>
            </View>
            {
              this.props.averages[game.hsName]
                ?
                <Text style={{ ...Generics.text }} >
                  {utils.truncateFloatingNumber(this.props.averages[game.hsName], 2)}
                  <Text style={{ ...Generics.text, color: colors.secondaryLight2 }} > Points</Text>
                </Text>
                :
                <ActivityIndicator color={colors.primary} />
            }
          </View>
        </View>

        <FlatList
          data={this.props.highscores[game.hsName]}
          renderItem={this.renderHs}
          keyExtractor={(item, index) => ("p" + index)}
          refreshControl={<RefreshControl
            refreshing={this.isRefreshing}
            onRefresh={this.props.refreshLeaderboards}
          />}
          windowSize={5}
        />

      </View>
    )
  }

}

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
      selectedGameIndex: 0,
    };
  }

  averages = {};
  highscores = {};

  componentDidMount() {
    this.averages = user.get().globalAverages;
    this.highscores = user.get().globalHighscores;
    this.forceUpdate();
    this.refreshLeaderboards();
  }

  refreshLeaderboards = () => {
    user.getGlobalHighscores().then(() => {
      this.highscores = user.get().globalHighscores;
      this.forceUpdate();
    }).catch(err => console.log(err))
  }

  renderGames = () => {
    let squareWidth = (_SCREEN.width / _APP_SETTINGS.games.length) - 6
    return (
      _APP_SETTINGS.games.map((g, index) => {
        return (
          <TouchableOpacity
            key={g.name}
            onPress={() => this.selectGame(index, true)}
            style={{ margin: 3, padding: 5, width: squareWidth, height: squareWidth, justifyContent: "center", alignItems: "center", elevation: 5, backgroundColor: this.state.selectedGameIndex == index ? g.backgroundColor : colors.secondaryLight, borderRadius: 5 }}
          >
            <Icon name={g.icon} color={colors.secondaryLight3} size={20} />
          </TouchableOpacity>
        );
      })
    );
  }

  selectGame = (index, scrollFlatlist) => {
    this.setState({ selectedGameIndex: index }, () => console.log("SET STATE", index))
    if (scrollFlatlist) {
      this.flatList.scrollToIndex({ animated: false, index });
    }
  }

  renderLeaderboard = (data) => {
    const game = data.item;
    return (<Leaderboard game={game} averages={this.averages} highscores={this.highscores} refreshLeaderboards={this.refreshLeaderboards} />);
  }

  renderListEmpty = () => {
    return (
      <View style={Generics.container} >
        <LoadingIndicator />
      </View>
    )
  }

  getItemLayout = (data, index) => (
    { length: _SCREEN.width, offset: _SCREEN.width * index, index }
  );

  render() {
    return (
      <View style={Generics.container} >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ height: (_SCREEN.width / _APP_SETTINGS.games.length + 6) }} >
          {this.renderGames()}
        </ScrollView>

        <FlatList
          ref={r => this.flatList = r}
          contentContainerStyle={{ height: "100%" }}
          horizontal
          pagingEnabled
          onScroll={(e) => {
            let index = Math.round(e.nativeEvent.contentOffset.x / _SCREEN.width);
            if (this.state.selectedGameIndex != index) {
              this.selectGame(index, false);
            }
          }}
          getItemLayout={this.getItemLayout}
          windowSize={2}
          data={_APP_SETTINGS.games}
          initialNumToRender={2}
          keyExtractor={(item, index) => ("p" + index)}
          overScrollMode={Platform.OS === "android" ? "never" : "always"}
          renderItem={this.renderLeaderboard}
          ListEmptyComponent={this.renderListEmpty}
        />

      </View>
    )

  }
}