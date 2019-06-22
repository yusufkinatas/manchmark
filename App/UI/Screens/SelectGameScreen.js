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
import Container from '@Components/Container'

export default class SelectGameScreen extends Component {
  static options() {
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
      <Container androidPadStatusBar centered="all">
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
      </Container>
    )
  }
}
