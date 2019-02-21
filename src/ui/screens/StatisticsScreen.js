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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, api, translate, user } from "../../core";
import CustomButton from "../../components/CustomButton";

const colors = _APP_SETTINGS.colors;

export default class StatisticsScreen extends Component {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate("statistics"),
        },
      }
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedGameIndex: 0,
    };
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

  renderInfoField = (infoName, infoValue, bgColor) => {
    return (
      <View style={{ flexDirection: "row", marginVertical: 8, marginHorizontal: 25, backgroundColor: colors.secondary, borderWidth: 3, borderColor: bgColor, borderRadius: 5, elevation: 5 }} >
        <View style={{ flex: 1, flexDirection: "row", minHeight: 50, paddingHorizontal: 5, alignItems: "center" }} >

          <View style={{ flex: 1 }} >
            <Text style={{ ...Generics.bigText, fontWeight: "bold", textAlign: "left" }} >{translate(infoName)}</Text>
          </View>
          <Text style={{ ...Generics.bigText, paddingHorizontal: 0 }} >{infoValue}</Text>

        </View>
      </View>
    );
  }

  renderStatisticForGame = (data) => {
    const game = data.item;
    console.log("buradayimmmmmmmmmmmmmm");
    console.log(data);
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

        {this.renderInfoField("highScore", user.get()[game.hsName], game.backgroundColor)}

        {Object.keys(user.get().statistics[game.name]).map(key => {
          return (this.renderInfoField(key, user.get().statistics[game.name][key], game.backgroundColor));
        })}


      </View>
    );
  }

  getItemLayout = (data, index) => {
    return { length: _SCREEN.width, offset: _SCREEN.width * index, index };
  }

  selectGame = (index, scrollFlatlist) => {
    this.setState({ selectedGameIndex: index }, () => console.log("SET STATE", index))
    if (scrollFlatlist) {
      this.flatList.scrollToIndex({ animated: false, index });
    }
  }

  render() {
    return (
      <View style={Generics.container} >

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ height: (_SCREEN.width / _APP_SETTINGS.games.length + 6) }} >
          {this.renderGames()}
        </ScrollView>

        <FlatList
          ref={r => this.flatList = r}
          contentContainerStyle={{ height: "100%" }}
          style={{ height: "100%" }}
          horizontal
          pagingEnabled
          onScroll={(e) => {
            let index = Math.round(e.nativeEvent.contentOffset.x / _SCREEN.width);
            if (this.state.selectedGameIndex != index) {
              this.selectGame(index, false);
            }
          }}
          getItemLayout={this.getItemLayout}
          data={_APP_SETTINGS.games}
          keyExtractor={(item, index) => ("p" + index)}
          overScrollMode={Platform.OS === "android" ? "never" : "always"}
          renderItem={this.renderStatisticForGame}
          ListEmptyComponent={this.renderListEmpty}
          maxToRenderPerBatch={1}
          initialNumToRender={2}
        />

      </View>
    )
  }
}