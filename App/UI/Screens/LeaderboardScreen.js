import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
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
  RefreshControl,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconFeather from 'react-native-vector-icons/Feather'

import {
  store,
  _APP_SETTINGS,
  _SCREEN,
  nav,
  Generics,
  api,
  user,
  utils,
  translate,
  audio,
} from '@Core'
import CustomButton from '@Components/CustomButton'
import LoadingIndicator from '@Components/LoadingIndicator'
import Container from '@Components/Container'

const colors = _APP_SETTINGS.colors

class Leaderboard extends React.PureComponent {
  constructor(props) {
    super(props)
    this.isRefreshing = false
  }

  renderHs = (data) => {
    let rank = data.index + 1
    let nickname = data.item.nickname
    let hs = data.item[this.props.game.hsName]
    let gameColor = this.props.game.backgroundColor
    let rankColor
    switch (rank) {
      case 1:
        rankColor = gameColor
        break
      case 2:
        rankColor = gameColor + 'bb'
        break
      case 3:
        rankColor = gameColor + '88'
        break
      case 4:
        rankColor = gameColor + '55'
        break
      case 5:
        rankColor = gameColor + '33'
        break
      default:
        rankColor = colors.secondaryDark + '33'
        break
    }
    let fontColor = colors.secondaryLight3
    return (
      <View
        key={rank}
        style={{
          flexDirection: 'row',
          marginVertical: 8,
          marginHorizontal: 25,
          elevation: 5,
          backgroundColor: colors.secondary,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            minWidth: 30,
            justifyContent: 'center',
            backgroundColor: rankColor,
            paddingHorizontal: 5,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            borderRightWidth: 1,
            borderRightColor: colors.secondary,
          }}
        >
          <Text style={{ ...Generics.bigText, paddingHorizontal: 0 }}>{rank}</Text>
        </View>

        <View
          key={nickname}
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: nickname == user.get().nickname ? gameColor : colors.secondaryLight,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
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
              <Text style={{ ...Generics.bigText, textAlign: 'left', color: fontColor }}>
                {nickname}
              </Text>
            </View>

            <Text style={{ ...Generics.text, color: fontColor }}>
              {utils.truncateFloatingNumber(hs, 2)}
              <Text style={{ ...Generics.text, color: fontColor }}> {translate('points')}</Text>
            </Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const game = this.props.game
    return (
      <View style={{ width: _SCREEN.width }}>
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

        <View
          style={{
            flexDirection: 'row',
            marginVertical: 8,
            marginHorizontal: 25,
            backgroundColor: colors.secondary,
            borderWidth: 3,
            borderColor: game.backgroundColor,
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
            <Icon name="globe" size={20} color={colors.secondaryLight3} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...Generics.bigText,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingHorizontal: 5,
                }}
              >
                {translate('averageScore')}
              </Text>
            </View>
            {this.props.averages[game.hsName] ? (
              <Text style={{ ...Generics.text }}>
                {utils.truncateFloatingNumber(this.props.averages[game.hsName], 2)}
                <Text style={{ ...Generics.text, color: colors.secondaryLight2 }}>
                  {' '}
                  {translate('points')}
                </Text>
              </Text>
            ) : (
              <ActivityIndicator color={colors.primary} />
            )}
          </View>
        </View>

        <FlatList
          data={this.props.highscores[game.hsName]}
          renderItem={this.renderHs}
          keyExtractor={(item, index) => 'p' + index}
          refreshControl={
            <RefreshControl
              refreshing={this.isRefreshing}
              onRefresh={this.props.refreshLeaderboards}
            />
          }
          initialNumToRender={this.props.index == 0 ? 5 : 0}
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
          text: translate('leaderboard'),
        },
      },
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedGameIndex: 0,
      showGlobal: user.get().globalLeaderboardSelected,
    }

    this.navOptions = {
      globalLeaderboardSelectedConfig: {
        topBar: {
          title: { text: translate('leaderboard') + `(${translate('global')})` },
          rightButtons: [
            {
              id: 'button1',
              component: {
                name: 'HeaderButton',
                passProps: {
                  onPress: this.onGlobalPress,
                  icon: 'globe',
                },
              },
            },
          ],
        },
      },
      friendLeaderboardSelectedConfig: {
        topBar: {
          title: { text: translate('leaderboard') },
          rightButtons: [
            {
              id: 'button1',
              component: {
                name: 'HeaderButton',
                passProps: {
                  onPress: this.onGlobalPress,
                  icon: 'globe',
                  backgroundColor: colors.secondaryLight,
                },
              },
            },
          ],
        },
      },
    }
    this.averages = {}
    this.globalHighscores = {}
    this.friendHighscores = {}

    Navigation.events().bindComponent(this)
  }

  pushScreen = (screen) => {
    nav.pushScreen(this.props.componentId, screen)
  }

  averages = {}
  globalHighscores = {}
  friendHighscores = {}

  componentDidMount() {
    this.averages = user.get().globalAverages
    this.globalHighscores = user.get().globalHighscores
    this.friendHighscores = user.get().friendHighscores
    this.forceUpdate()
    this.refreshLeaderboards()

    if (!user.get().tutorials.leaderboardTutorial) {
      nav.showModal('LeaderboardTutorialModal')
    }

    if (this.state.showGlobal) {
      Navigation.mergeOptions(
        this.props.componentId,
        this.navOptions.globalLeaderboardSelectedConfig
      )
    } else {
      Navigation.mergeOptions(
        this.props.componentId,
        this.navOptions.friendLeaderboardSelectedConfig
      )
    }
  }

  onGlobalPress = () => {
    if (this.state.showGlobal) {
      this.globalHighscores = user.get().globalHighscores
      user.set({ globalLeaderboardSelected: false }, true)
      this.setState({ showGlobal: false, selectedGameIndex: 0 }, () => {
        Navigation.mergeOptions(
          this.props.componentId,
          this.navOptions.friendLeaderboardSelectedConfig
        )
      })
    } else {
      user.set({ globalLeaderboardSelected: true }, true)
      this.setState({ showGlobal: true, selectedGameIndex: 0 }, () => {
        Navigation.mergeOptions(
          this.props.componentId,
          this.navOptions.globalLeaderboardSelectedConfig
        )
      })
    }
  }

  refreshLeaderboards = () => {
    Promise.all([
      user.getGlobalHighscores().then(() => {
        this.globalHighscores = user.get().globalHighscores
      }),
      user.getFriendHighscores().then(() => {
        this.friendHighscores = user.get().friendHighscores
      }),
    ]).then(() => this.forceUpdate())
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

  selectGame = (index, scrollFlatlist) => {
    this.setState({ selectedGameIndex: index }, () => {})
    if (scrollFlatlist) {
      this.flatList.scrollToIndex({ animated: false, index })
    }
  }

  renderGlobalLeaderboard = (data) => {
    const game = data.item
    return (
      <Leaderboard
        game={game}
        index={data.index}
        averages={this.averages}
        highscores={this.globalHighscores}
        refreshLeaderboards={this.refreshLeaderboards}
      />
    )
  }

  renderFriendLeaderboard = (data) => {
    const game = data.item
    return (
      <Leaderboard
        game={game}
        index={data.index}
        averages={this.averages}
        highscores={this.friendHighscores}
        refreshLeaderboards={this.refreshLeaderboards}
      />
    )
  }

  renderListEmpty = () => {
    return (
      <View style={Generics.container}>
        <LoadingIndicator text={translate('loading')} />
      </View>
    )
  }

  getItemLayout = (data, index) => {
    return { length: _SCREEN.width, offset: _SCREEN.width * index, index }
  }

  renderGlobalLeaderboards = () => {
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
          pagingEnabled
          showsHorizontalScrollIndicator={false}
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
          renderItem={this.renderGlobalLeaderboard}
          ListEmptyComponent={this.renderListEmpty}
          maxToRenderPerBatch={1}
          initialNumToRender={2}
        />
      </Container>
    )
  }

  renderFriendLeaderboards = () => {
    return (
      <Container centered="all" androidPadStatusBar>
        {user.get().follows.length == 0 ? (
          <View style={Generics.container}>
            <Text style={{ ...Generics.bigText, marginBottom: 20 }}>
              {translate('youHaventAddedFriendsYet')}
            </Text>
            <CustomButton
              text={translate('addFriends')}
              icon="plus"
              onPress={() => this.pushScreen('FollowsScreen')}
            />
          </View>
        ) : (
          <View style={Generics.container}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ height: _SCREEN.width / _APP_SETTINGS.games.length + 6 }}
            >
              {this.renderGames()}
            </ScrollView>

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
              renderItem={this.renderFriendLeaderboard}
              ListEmptyComponent={this.renderListEmpty}
              maxToRenderPerBatch={1}
              initialNumToRender={2}
            />
          </View>
        )}
      </Container>
    )
  }

  render() {
    return this.state.showGlobal ? this.renderGlobalLeaderboards() : this.renderFriendLeaderboards()
  }
}