import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { store, _APP_SETTINGS, _SCREEN, Generics, user, api, translate } from '@Core'
import CustomButton from '@Components/CustomButton'
import HeaderButton from '@Components/HeaderButton'

export default class LeaderboardTutorialModal extends Component {
  static options(passProps) {
    return {
      screenBackgroundColor: 'transparent',
      modalPresentationStyle: 'overCurrentContext',
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }
  }

  dissmissModal = () => {
    let oldTutorials = user.get().tutorials

    user.set(
      {
        tutorials: { ...oldTutorials, leaderboardTutorial: true },
      },
      true
    )

    Navigation.dismissModal(this.props.componentId)
  }

  render() {
    return (
      <View style={{ ...Generics.container, backgroundColor: 'rgba(0,0,0,0.95)' }}>
        <View
          style={{ position: 'absolute', top: 0, right: 0, height: 56, justifyContent: 'center' }}
        >
          <HeaderButton disabled icon="globe" backgroundColor={colors.secondary} />
        </View>
        <Icon
          style={{ position: 'absolute', top: 65, right: 60 }}
          name={'near-me'}
          size={30}
          color={colors.secondaryLight2}
        />
        <Text style={Generics.bigText}>{translate('leaderboardTutorial')}</Text>
        <View style={{ paddingTop: 10 }} />
        <CustomButton text={translate('gotIt')} onPress={this.dissmissModal} />
      </View>
    )
  }
}

const colors = _APP_SETTINGS.colors

var styles = StyleSheet.create({
  innerContainer: {
    width: _SCREEN.width * 0.8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  touchableArea: {
    zIndex: -1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
  closeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  bigText: {
    fontSize: 25,
    fontFamily: 'roboto',
    color: colors.secondaryLight3,
    textAlign: 'center',
    paddingTop: 5,
    paddingLeft: 5,
  },
  imageStyle: {
    height: 50,
    width: 50,
  },
  smallText: {
    fontSize: 12,
    fontFamily: 'roboto',
    color: colors.secondaryLight2,
    textAlign: 'left',
    paddingLeft: 5,
  },
  copyRightText: {
    fontSize: 10,
    fontFamily: 'roboto',
    color: colors.secondaryLight,
    textAlign: 'left',
    paddingLeft: 5,
    marginBottom: 10,
  },
})
