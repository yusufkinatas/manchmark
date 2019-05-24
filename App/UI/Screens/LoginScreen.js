import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Alert,
  Linking,
  TextInput,
  NetInfo,
  AppState,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { setRootViewBackgroundColor } from 'react-native-root-view-background'
import validator from 'validator'
import _ from 'lodash'

import {
  store,
  _APP_SETTINGS,
  _SCREEN,
  nav,
  api,
  utils,
  user,
  Generics,
  translate,
} from '@Core'
import CustomButton from '@Components/CustomButton'
import LoadingIndicator from '@Components/LoadingIndicator'
import SplashScreen from 'react-native-splash-screen'

export default class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      errorText: '',
      nickname: '',
    }
  }

  componentDidMount() {
    SplashScreen.hide()
    setRootViewBackgroundColor(colors.secondary)

    AppState.addEventListener('change', (state) => {
      if (state == 'active') {
        NetInfo.isConnected.fetch().then((isConnected) => {
          user.set({ isConnected })
        })
      }
    })

    NetInfo.isConnected
      .fetch()
      .then((isConnected) => {
        user.set({ isConnected })
        if (isConnected) {
          user
            .getFromStore()
            .then((_user) => {
              if (_user && _user.nickname != null) {
                user.login()
                this.startGame()
              } else {
                user
                  .login()
                  .then(() => {
                    this.startGame()
                  })
                  .catch((err) => {
                    this.setState({ isLoading: false })
                  })
              }
            })
            .catch((err) => {})
        } else {
          user
            .getFromStore()
            .then((_user) => {
              this.startGame()
            })
            .catch((err) => {})
        }
      })
      .catch((err) => {})
  }

  addConnectionChangeListener = () => {
    NetInfo.addEventListener('connectionChange', (res) => {
      if (res && res.type != 'none') {
        user.set({ isConnected: true })
        user.compareLocalHighscores()
      } else {
        user.set({ isConnected: false })
      }
    })
  }

  startGame = () => {
    if (user.get().isConnected) {
      user.initialize()
    }
    this.addConnectionChangeListener()
    nav.showGame()
  }

  onChooseNickname = () => {
    let _nickname = this.state.nickname.trim().toLocaleLowerCase()
    if (_nickname.length < 3 || _nickname.trim().length > 20) {
      this.setState({ errorText: translate('errMustBetween3and20') })
    } else if (!validator.isAlphanumeric(_nickname.trim())) {
      this.setState({ errorText: translate('errOnlyEngLetters') })
    } else {
      this.setState({ isLoading: true })
      api
        .signup(_nickname, user.get().deviceID)
        .then((res) => {
          var tmpUser = _.omit(res.data, ['tokens', '__v', '_id'])
          tmpUser.authToken = res.headers['x-auth']
          user.set(tmpUser, true)
          this.startGame()
        })
        .catch((err) => {
          this.setState({ errorText: translate('errUsernameAlreadyInUse'), isLoading: false })
        })
    }
  }

  renderLoading = () => {
    return <LoadingIndicator text={translate('loading')} />
  }

  renderLoginForm = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={Generics.bigText}>{translate('pickAUsername')}</Text>
        <View style={{ paddingTop: 10 }} />
        <TextInput
          onChangeText={(t) => this.setState({ nickname: t })}
          autoCapitalize={'none'}
          autoCorrect={false}
          style={{
            width: _SCREEN.width * 0.6,
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 5,
            padding: 5,
            fontSize: 20,
            fontFamily: 'roboto',
            color: colors.secondaryLight3,
            marginBottom: 5,
          }}
          placeholder={translate('typeYourUsername')}
          placeholderTextColor={colors.secondaryLight2}
          underlineColorAndroid={'transparent'}
        />
        <Text style={Generics.errorText}>{this.state.errorText}</Text>
        <CustomButton text={translate('choose')} onPress={this.onChooseNickname} />
      </View>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={Generics.container}>
        <View style={{ flex: 2, justifyContent: 'center' }}>
          <Text style={Generics.header}>{translate('manchmark')}</Text>
        </View>

        <View style={{ flex: 3, alignItems: 'center', paddingTop: 50 }}>
          {this.state.isLoading ? this.renderLoading() : this.renderLoginForm()}
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const colors = _APP_SETTINGS.colors

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },
  text: {
    fontSize: 15,
    fontFamily: 'roboto',
    color: colors.secondaryLight3,
  },
  bigText: {
    fontSize: 25,
    fontFamily: 'roboto',
    color: colors.secondaryLight3,
  },
  header: {
    fontFamily: 'Roboto',
    fontSize: 40,
    textShadowColor: colors.secondaryDark,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3,
    width: _SCREEN.width,
    textAlign: 'center',
    color: colors.secondaryLight3,
  },
})
