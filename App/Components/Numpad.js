import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
  TouchableHighlight,
} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Feather'

import { store, _APP_SETTINGS, _SCREEN, nav, Generics, audio, user } from '@Core'

export default class Numpad extends Component {
  onPressIn = (name) => {
    if (this.hapticView && user.get().localSettings.hapticEnabled) {
      //PERFORM HAPTIC
    }
    this.props.onPress(name)
    audio.play('click_numpad.wav', 0.2)
  }

  renderButton = (name) => {
    return Platform.OS == 'android' ? (
      <View style={Generics.container}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(this.props.rippleColor, false)}
          onPressIn={() => this.onPressIn(name)}
        >
          <View style={styles.buttonInnerContainer}>
              <Text style={styles.buttonText}>{name}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    ) : (
      <View style={Generics.container}>
        <TouchableHighlight
          underlayColor={'#333333'}
          style={styles.buttonInnerContainer}
          onPressIn={() => this.onPressIn(name)}
        >
            <Text style={styles.buttonText}>{name}</Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderButtonWithIcon = (icon, name) => {
    return Platform.OS == 'android' ? (
      <View style={Generics.container}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(this.props.rippleColor, false)}
          onPressIn={() => this.onPressIn(name)}
          onLongPress={() => {
            if (name == 'del') this.props.deleteAll()
          }}
        >
          <View style={styles.buttonInnerContainer}>
              <Icon name={icon} color={colors.secondaryLight3} size={30} />
          </View>
        </TouchableNativeFeedback>
      </View>
    ) : (
      <View style={Generics.container}>
        <TouchableHighlight
          underlayColor={'#333333'}
          style={styles.buttonInnerContainer}
          onPressIn={() => this.onPressIn(name)}
          onLongPress={() => {
            if (name == 'del') this.props.deleteAll()
          }}
        >
            <Icon name={icon} color={colors.secondaryLight3} size={30} />
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          {this.renderButton('1')}
          {this.renderButton('2')}
          {this.renderButton('3')}
        </View>
        <View style={styles.horizontalContainer}>
          {this.renderButton('4')}
          {this.renderButton('5')}
          {this.renderButton('6')}
        </View>
        <View style={styles.horizontalContainer}>
          {this.renderButton('7')}
          {this.renderButton('8')}
          {this.renderButton('9')}
        </View>
        <View style={styles.horizontalContainer}>
          {this.renderButtonWithIcon('delete', 'del')}
          {this.renderButton('0')}
          {this.renderButtonWithIcon('check', 'enter')}
        </View>
      </View>
    )
  }
}

Numpad.propTypes = {
  onPress: PropTypes.func,
  rippleColor: PropTypes.string,
}

Numpad.defaultProps = {
  rippleColor: null,
}

const colors = _APP_SETTINGS.colors
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  buttonInnerContainer: {
    width: '93%',
    height: '93%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryLight,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 30,
    fontFamily: 'roboto',
    fontWeight: 'bold',
    color: colors.secondaryLight3,
  },
})
