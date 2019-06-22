import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
  Linking,
  TouchableNativeFeedback,
  Platform,
  Share,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, user, translate, audio } from '@Core'
import CustomButton from '@Components/CustomButton'
import Container from '@Components/Container'

export default class MainScreen extends Component {
  static options() {
    return {
      topBar: {
        visible: false,
        heigth: 0,
      },
    }
  }

  constructor(props) {
    super(props)
    this.wololoCounter = 0
  }

  pushScreen = (screen) => {
    nav.pushScreen(this.props.componentId, screen)
  }

  shareGame = () => {
    audio.play('click.wav', 0.15)
    Share.share(
      {
        message: translate('invitationMessage') + `\n\nGoogle Play: ${_APP_SETTINGS.playstoreURL}`,
        title: translate('invitationMessage'),
      },
      {}
    )
  }

  rateGame = () => {
    audio.play('click.wav', 0.15)
    Linking.openURL(_APP_SETTINGS.playstoreLink)
  }

  renderBottomButton = (icon, text, onPress) => {
    if (Platform.OS == 'android') {
      return (
        <View style={{ flex: 1, borderRadius: 5, overflow: 'hidden', marginHorizontal: 5 }}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(colors.primary, true)}
            onPress={onPress}
          >
            <View style={{ paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name={icon} size={20} color={colors.secondaryLight2} />
              <Text style={{ ...Generics.text, fontSize: 12, color: colors.secondaryLight2 }}>
                {text}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      )
    } else if (Platform.OS == 'ios') {
      return (
        <View style={{ flex: 1, borderRadius: 5, overflow: 'hidden', marginHorizontal: 5 }}>
          <TouchableHighlight
            underlayColor={'#333333'}
            style={{ backgroundColor: colors.secondaryLight, paddingVertical: 5 }}
            onPress={onPress}
          >
            <View style={{ paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name={icon} size={20} color={colors.secondaryLight2} />
              <Text style={{ ...Generics.text, fontSize: 12, color: colors.secondaryLight2 }}>
                {text}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  }

  render() {
    return (
      <Container>
        <View style={styles.topBarContainer}>
          <Text
            style={Generics.header}
            onPress={() => {
              if (++this.wololoCounter % 5 == 0) {
                audio.play('wololo.wav', 0.1)
              }
            }}
          >
            {translate('manchmark')}
          </Text>

          <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
            <Text style={{ ...Generics.bigText, paddingHorizontal: 0 }}>
              {translate('welcome') + ' '}
              <Text
                onPress={() =>
                  nav.showModal('ChangeNicknameModal', { onDismiss: () => this.forceUpdate() })
                }
                style={{
                  ...Generics.bigText,
                  paddingHorizontal: 0,
                  textDecorationLine: 'underline',
                }}
              >
                {user.get().nickname}!
              </Text>
            </Text>
          </View>
        </View>

        <View style={Generics.container}>
          <CustomButton
            icon={'play'}
            text={translate('play')}
            onPress={() => this.pushScreen('SelectGameScreen')}
          />
          <CustomButton
            icon={'users'}
            text={translate('friends')}
            onPress={() => this.pushScreen('FollowsScreen')}
          />
          <CustomButton
            icon={'list-ol'}
            text={translate('leaderboard')}
            onPress={() => this.pushScreen('LeaderboardScreen')}
          />
          <CustomButton
            icon={'bar-chart'}
            text={translate('statistics')}
            onPress={() => this.pushScreen('StatisticsScreen')}
          />
        </View>

        <View style={styles.bottomBarContainer}>
          {this.renderBottomButton('star', translate('rateUs'), this.rateGame)}
          {this.renderBottomButton('info', translate('aboutUs'), () => {
            nav.showModal('AboutUsModal')
            audio.play('click.wav', 0.15)
          })}
          {this.renderBottomButton('share-2', translate('invite'), this.shareGame)}
          {this.renderBottomButton('settings', translate('settings'), () => {
            this.pushScreen('SettingsScreen')
            audio.play('click.wav', 0.15)
          })}
        </View>
      </Container>
    )
  }
}

const colors = _APP_SETTINGS.colors

var styles = StyleSheet.create({
  topBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  bottomBarContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    width: _SCREEN.width,
    paddingBottom: Platform.OS == 'android' ? 10 : 20,
  },
})
