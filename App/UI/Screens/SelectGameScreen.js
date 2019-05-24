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
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { _APP_SETTINGS, _SCREEN, nav, translate } from '@Core'
import CustomButton from '@Components/CustomButton'

export default class SelectGameScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate('selectGame'),
        },
      },
    }
  }

  pushScreen = (screen) => {
    nav.pushScreen(this.props.componentId, screen)
  }


  render() {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: _APP_SETTINGS.colors.secondary }}
        contentContainerStyle={{
          width: _SCREEN.width,
          minHeight: _SCREEN.height - 80,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
        }}
      >
        {_APP_SETTINGS.games.map((g) => {
          return (
            <CustomButton
              key={g.name}
              icon={g.icon}
              text={g.fullName}
              backgroundColor={g.backgroundColor}
              onPress={() => this.pushScreen(g.name)}
            />
          )
        })}
      </ScrollView>
    )
  }
}