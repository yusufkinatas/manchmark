import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
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
  PermissionsAndroid,
  Platform,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Contacts from 'react-native-contacts'
import DeviceInfo from 'react-native-device-info'
import RNAccountKit, { Color, StatusBarStyle } from 'react-native-facebook-account-kit'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, user, api, translate } from '@Core'
import CustomButton from '@Components/CustomButton'
import Container from '@Components/Container'

RNAccountKit.configure({
  theme: {
    // Background
    backgroundColor: Color.rgba(0, 120, 0, 0.1),
    backgroundImage: 'background.png',
    // Button
    buttonBackgroundColor: Color.rgba(0, 153, 0, 1.0),
    buttonBorderColor: Color.rgba(0, 255, 0, 1),
    buttonTextColor: Color.rgba(0, 255, 0, 1),
    // Button disabled
    buttonDisabledBackgroundColor: Color.rgba(100, 153, 0, 0.5),
    buttonDisabledBorderColor: Color.rgba(100, 153, 0, 0.5),
    buttonDisabledTextColor: Color.rgba(100, 153, 0, 0.5),
    // Header
    headerBackgroundColor: Color.rgba(0, 153, 0, 1.0),
    headerButtonTextColor: Color.rgba(0, 153, 0, 0.5),
    headerTextColor: Color.rgba(0, 255, 0, 1),
    // Input
    inputBackgroundColor: Color.rgba(0, 255, 0, 1),
    inputBorderColor: Color.hex('#ccc'),
    inputTextColor: Color.hex('#0f0'),
    // Others
    iconColor: Color.rgba(0, 255, 0, 1),
    textColor: Color.hex('#0f0'),
    titleColor: Color.hex('#0f0'),
    // Header
    statusBarStyle: StatusBarStyle.LightContent, // or StatusBarStyle.Default
  },
})

export default class FindFriendsScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate('findYourFriends'),
        },
      },
    }
  }

  constructor(props) {
    super(props)
    if (Platform.OS == 'ios') {
    }

    this.state = {
      contacts: user.get().contacts,
      follows: user.get().follows,
      showInfoText: true,
      isLoading: false,
    }
  }

  componentWillMount() {
    if (Platform.OS == 'ios') {
      if (user.get().phone) {
        this.setState({ showInfoText: false })
        this.tryToGetContacts()
      }
      return
    }

    PermissionsAndroid.check('android.permission.READ_CONTACTS').then((granted) => {
      if (granted && user.get().phone) {
        this.setState({ showInfoText: false })
        this.tryToGetContacts()
      }
    })
  }

  componentWillUnmount() {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  componentDidMount() {
    RNAccountKit.configure({
      responseType: 'code',
      initialPhoneCountryPrefix: '+90',
      defaultCountry: DeviceInfo.getDeviceCountry() || 'TR',
    })
  }

  refreshUserData = () => {
    this.setState({
      contacts: user.get().contacts,
      follows: user.get().follows,
    })
  }

  handleButtonPress = async () => {
    if (!user.get().phone) {
      try {
        const payload = await RNAccountKit.loginWithPhone()

        if (!payload) {
          console.warn('Login cancelled', payload)
        } else {
          console.warn('Logged with phone. Payload:', payload.code)
          var code = payload.code
          user
            .changePhoneNumber(code)
            .then(() => {
              this.handleButtonPress()
            })
            .catch((err) => {
              console.log(err)
            })
        }
      } catch (err) {
        console.warn('Error', err.message)
      }
    } else {
      this.tryToGetContacts()
    }
  }

  tryToGetContacts = () => {
    if (Platform.OS == 'ios') {
      return Contacts.getAll((err, contacts) => {
        if (err) {
        } else {
          console.log('CONTACTS', contacts)
          let nums = []
          let country = DeviceInfo.getDeviceCountry()
          contacts.forEach((contact) => {
            try {
              if (contact.phoneNumbers.length > 0 && contact.phoneNumbers[0].number) {
                let num = parsePhoneNumberFromString(contact.phoneNumbers[0].number, country).number
                if (num != user.get().phone) {
                  nums.push(num)
                }
              }
            } catch (error) {}
          })
          api
            .getContacts(nums)
            .then((res) => {
              user.set({ contacts: res }, true)
              this.refreshUserData()
            })
            .catch((err) => {})
        }
      })
    }
    PermissionsAndroid.request('android.permission.READ_CONTACTS')
      .then((granted) => {
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          Contacts.getAll((err, contacts) => {
            if (err) {
            } else {
              let nums = []
              let country = DeviceInfo.getDeviceCountry()
              contacts.forEach((contact) => {
                try {
                  if (contact.phoneNumbers.length > 0 && contact.phoneNumbers[0].number) {
                    let num = parsePhoneNumberFromString(contact.phoneNumbers[0].number, country)
                      .number
                    if (num != user.get().phone) {
                      nums.push(num)
                    }
                  }
                } catch (error) {}
              })
              api
                .getContacts(nums)
                .then((res) => {
                  user.set({ contacts: res }, true)
                  this.refreshUserData()
                })
                .catch((err) => {})
            }
          })
        } else {
        }
      })
      .catch((err) => {})
  }

  onUserPress = (pressedUser) => {
    if (this.state.follows.indexOf(pressedUser._id) == -1) {
      user.follow(pressedUser._id).then(() => {
        this.refreshUserData()
      })
    } else {
      user.unfollow(pressedUser._id).then(() => {
        this.refreshUserData()
      })
    }
  }

  renderUser = (user) => {
    let isFollowing = this.state.follows.indexOf(user._id) != -1
    return (
      <View
        key={user.nickname}
        style={{
          flexDirection: 'row',
          width: _SCREEN.width * 0.8,
          padding: 10,
          backgroundColor: colors.secondaryLight,
          borderRadius: 5,
          elevation: 5,
          marginVertical: 8,
          marginHorizontal: 25,
        }}
      >
        <Text numberOfLines={1} style={{ ...Generics.bigText, flex: 1, textAlign: 'left' }}>
          {user.nickname}
        </Text>
        <TouchableOpacity
          style={{
            width: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isFollowing ? colors.secondary : colors.primary,
            borderRadius: 5,
            borderWidth: isFollowing ? 1 : 0,
            borderColor: colors.secondaryDark,
          }}
          onPress={() => this.onUserPress(user)}
          hitSlop={{ bottom: 20, top: 20, left: 20, right: 20 }}
        >
          <Text
            style={{
              ...Generics.text,
              color: isFollowing ? colors.secondaryLight3 : colors.secondaryLight3,
            }}
          >
            {isFollowing ? translate('friend') : translate('add')}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container androidPadStatusBar>
        <ScrollView
          style={{
            flex: 1,
            width: _SCREEN.width,
            borderBottomWidth: 1,
            elevation: 2,
            marginBottom: 0,
          }}
          contentContainerStyle={{ alignItems: 'center', paddingTop: 10 }}
        >
          <View style={{ alignItems: 'center' }}>
            {this.state.showInfoText && (
              <Text
                style={{
                  ...Generics.text,
                  fontSize: 15,
                  color: colors.secondaryLight2,
                  textAlign: 'center',
                  marginBottom: 10,
                  paddingHorizontal: 10,
                }}
              >
                {translate('getNumbersInfo')}
              </Text>
            )}
            <CustomButton text={translate('findFriends')} onPress={this.handleButtonPress} />
          </View>
          {this.state.contacts.map((user) => this.renderUser(user))}
        </ScrollView>
      </Container>
    )
  }
}

const colors = _APP_SETTINGS.colors
