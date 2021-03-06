import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, FlatList, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import _ from 'lodash'
import { _APP_SETTINGS, _SCREEN, Generics, translate, user, utils, audio } from '@Core'
import CustomButton from '@Components/CustomButton'
import Container from '@Components/Container'

const colors = _APP_SETTINGS.colors

export default class StatisticsScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate('statistics'),
        },
      },
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedGameIndex: 0,
    }
  }

  renderGames = () => {
    let squareWidth = _SCREEN.width / _APP_SETTINGS.games.length - 6
    return _APP_SETTINGS.games.map((g, index) => {
      return (
        <TouchableOpacity
          key={g.name}
          onPress={() => {
            this.selectGame(index, true)
            audio.play('click.wav', 0.15)
          }}
          style={{
            margin: 3,
            padding: 5,
            width: squareWidth,
            height: squareWidth,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            backgroundColor:
              this.state.selectedGameIndex == index ? g.backgroundColor : colors.secondaryLight,
            borderRadius: 5,
          }}
        >
          <Icon name={g.icon} color={colors.secondaryLight3} size={20} />
        </TouchableOpacity>
      )
    })
  }

  renderInfoField = (infoName, infoValue, bgColor) => {
    return (
      <View
        key={infoName}
        style={{
          flexDirection: 'row',
          marginVertical: 8,
          marginHorizontal: 25,
          backgroundColor: colors.secondary,
          borderWidth: 3,
          borderColor: bgColor,
          borderRadius: 5,
          elevation: 5,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            minHeight: 50,
            paddingHorizontal: 5,
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ ...Generics.bigText, fontWeight: 'bold', textAlign: 'left' }}>
              {translate(infoName)}
            </Text>
          </View>
          <Text style={{ ...Generics.bigText, paddingHorizontal: 0 }}>{infoValue}</Text>
        </View>
      </View>
    )
  }

  renderStatisticForGame = (data) => {
    const game = data.item
    return (
      <ScrollView style={{ width: _SCREEN.width }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: _SCREEN.width,
            paddingHorizontal: 20,
            height: 50,
          }}
        >
          {game.name != _APP_SETTINGS.games[0].name && (
            <View style={{ position: 'absolute', left: 20 }}>
              <Icon name="caret-left" size={30} color={colors.secondaryLight3} />
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={game.icon} size={30} color={colors.secondaryLight3} />
            <Text style={Generics.bigText}>{game.fullName}</Text>
          </View>

          {game.name != _APP_SETTINGS.games[_APP_SETTINGS.games.length - 1].name && (
            <View style={{ position: 'absolute', right: 20 }}>
              <Icon name="caret-right" size={30} color={colors.secondaryLight3} />
            </View>
          )}
        </View>

        {this.renderInfoField(
          'highscore',
          user.get()[game.hsName] == null ? '- ' : user.get()[game.hsName],
          game.backgroundColor
        )}

        {this.returnPercent(game.hsName, game.backgroundColor)}

        {Object.keys(user.get().statistics[game.name]).map((key) => {
          return this.renderInfoField(
            key,
            user.get().statistics[game.name][key],
            game.backgroundColor
          )
        })}
      </ScrollView>
    )
  }

  returnPercent = (hsName, backgroundColor) => {
    let rank = user.get().ranks[hsName]
    let count = user.get().ranks.userCount
    let userPercent

    if (_.isInteger(count) && _.isInteger(rank)) {
      userPercent = utils.truncateFloatingNumber((rank / count) * 100, 3)
      userPercent = _.isNaN(userPercent) ? '- ' : userPercent + '%'
    } else {
      userPercent = '- '
    }

    return this.renderInfoField('percentile', userPercent, backgroundColor)
  }

  getItemLayout = (data, index) => {
    return { length: _SCREEN.width, offset: _SCREEN.width * index, index }
  }

  selectGame = (index, scrollFlatlist) => {
    this.setState({ selectedGameIndex: index })
    if (scrollFlatlist) {
      this.flatList.scrollToIndex({ animated: false, index })
    }
  }

  render() {
    return (
      <Container centered="all" androidPadStatusBar>
        <View
          style={{ height: _SCREEN.width / _APP_SETTINGS.games.length + 6, flexDirection: 'row' }}
        >
          {this.renderGames()}
        </View>

        <FlatList
          ref={(r) => (this.flatList = r)}
          contentContainerStyle={{ height: '100%' }}
          style={{ height: '100%' }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={(e) => {
            let index = Math.round(e.nativeEvent.contentOffset.x / _SCREEN.width)
            if (this.state.selectedGameIndex != index) {
              this.selectGame(index, false)
            }
          }}
          getItemLayout={this.getItemLayout}
          data={_APP_SETTINGS.games}
          keyExtractor={(item, index) => 'p' + index}
          overScrollMode={Platform.OS === 'android' ? 'never' : 'always'}
          renderItem={this.renderStatisticForGame}
          ListEmptyComponent={this.renderListEmpty}
          maxToRenderPerBatch={1}
          initialNumToRender={2}
        />
      </Container>
    )
  }
}
