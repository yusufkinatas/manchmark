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
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import {
  store,
  _APP_SETTINGS,
  _SCREEN,
  utils,
  Generics,
  translate,
  user,
  audio,
} from '@Core'
import CustomButton from '@Components/CustomButton'
import CounterBar from '@Components/CounterBar'
import BouncingText from '@Components/BouncingText'
import SwappingText from '@Components/SwappingText'
import GameResult from '@Components/GameResult'

const TOP_BAR_HEIGHT = 150
const gameColor = _APP_SETTINGS.games.find((g) => g.name == 'VisualMemoryGame').backgroundColor
const animationDuration = 250
const answerDuration = 7000

export default class VisualMemoryGame extends Component {
  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate('VisualMemoryGame'),
        },
      },
    }
  }

  constructor(props) {
    super(props)

    this.wrongTileCount = 0
    this.isAnimating = false
    this.levelAnim = new Animated.Value(0)
    this.showDuration = 1000
    this.state = {
      gameStatus: 'info',
      timesUp: false,
      score: 0,
      level: 0,
      lives: 3,
      levelMistakes: 0,
      squares: [],
    }
    this.buttonsEnabled = true

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (e, gestureState) => {
        let indexX, indexY
        let numberOfColumns = this.sideLengthOfBoard
        e.nativeEvent.touches.forEach((touch) => {
          indexX = Math.floor((touch.pageX / _SCREEN.width) * numberOfColumns)
          indexY = Math.floor(((touch.pageY - TOP_BAR_HEIGHT) / _SCREEN.width) * numberOfColumns)
          indexY < 0 ? (indexY = 0) : (indexY = indexY)
          indexY > numberOfColumns - 1 ? (indexY = numberOfColumns - 1) : (indexY = indexY)
        })
        this.onSquarePress(indexX + indexY * this.sideLengthOfBoard)
      },
    })
  }

  reinitialize = () => {
    this.gameEnded = false
    this.isAnimating = false
    this.levelAnim = new Animated.Value(0)
    this.wrongTileCount = 0

    clearTimeout(this.animationTimeout)
    clearTimeout(this.levelAnimationTimer)

    this.setState({
      gameStatus: 'info',
      timesUp: false,
      score: 0,
      level: 0,
      lives: 3,
      levelMistakes: 0,
      squares: [],
    })
    this.buttonsEnabled = true
  }

  componentWillUnmount() {
    clearTimeout(this.animationTimeout)
    clearTimeout(this.levelAnimationTimer)
    clearTimeout(this.answerTime)
  }

  endGame = () => {
    if (this.gameEnded) {
      return
    }
    this.gameEnded = true

    let pressedTile = this.state.score / 10
    let oldUserStat = user.get().statistics
    let visualStats = oldUserStat.VisualMemoryGame

    user.set(
      {
        statistics: {
          ...oldUserStat,
          ['VisualMemoryGame']: {
            amountPlayed: visualStats.amountPlayed + 1,
            totalCorrectTilePress: visualStats.totalCorrectTilePress + pressedTile,
            totalWrongTilePress: visualStats.totalWrongTilePress + this.wrongTileCount,
          },
        },
      },
      true
    )

    let tmp = user.get().statistics
    user.updateStatistics()
    this.setState({ gameStatus: 'finished' })
  }

  startGame = () => {
    this.setState({ gameStatus: 'active' })
    this.gameEnded = false
    this.startNextLevel()
  }

  showNewLevelAnimation = () => {
    return new Promise((resolve, reject) => {
      this.setState({ isAnimating: true })
      Animated.timing(this.levelAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        this.levelAnimationTimer = setTimeout(() => {
          Animated.timing(this.levelAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            this.setState({ isAnimating: false })
            resolve()
          })
        }, 300)
      })
    })
  }

  startNextLevel = (replaySameLevel?) => {
    clearTimeout(this.answerTime)
    this.state.squares = []
    this.state.levelMistakes = 0
    if (!replaySameLevel) {
      this.state.level++
    } else {
      this.state.lives--
    }
    this.sideLengthOfBoard
    this.specialSquareRequired = this.state.level > 13 ? 15 : this.state.level + 2
    this.specialSquarePushed = 0
    let specialSquireCount = 0

    if (this.state.level <= 2) {
      this.sideLengthOfBoard = 3
    } else if (this.state.level <= 5) {
      this.sideLengthOfBoard = 4
      this.showDuration = 1200
    } else if (this.state.level <= 8) {
      this.sideLengthOfBoard = 5
      this.showDuration = 1500
    } else if (this.state.level <= 13) {
      this.sideLengthOfBoard = 6
      this.showDuration = 1800
    } else {
      this.sideLengthOfBoard = 7
      this.showDuration = 2000
    }

    for (let i = 0; i < this.sideLengthOfBoard * this.sideLengthOfBoard; i++) {
      this.state.squares.push({ special: false, pushed: false, animation: new Animated.Value(0) })
    }
    this.state.timesUp = false

    while (specialSquireCount < this.specialSquareRequired) {
      let randomIndex = utils.randomBetween(0, this.state.squares.length - 1)
      if (!this.state.squares[randomIndex].special) {
        this.state.squares[randomIndex].special = true
        specialSquireCount++
      }
    }
    this.forceUpdate()
    this.showNewLevelAnimation().then(() => this.showSpecialSquares())

    this.answerTime = setTimeout(() => {
      this.setState({ timesUp: 'true' })
      this.buttonsEnabled = false
      if (this.state.lives == 1) {
        this.endGame()
      } else {
        this.startNextLevel(true)
      }
    }, answerDuration + this.showDuration + 2 * animationDuration + 500)
  }

  showSpecialSquares = () => {
    this.isAnimating = true
    this.state.squares.forEach((square, index) => {
      if (square.special) {
        square.pushed = true //renk değişimi için
        Animated.timing(square.animation, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }).start()
      }
    })
    this.forceUpdate()
    this.animationTimeout = setTimeout(() => {
      this.state.squares.forEach((square, index) => {
        if (square.special) {
          square.pushed = false //renk değişimi için
          Animated.timing(square.animation, {
            toValue: 0,
            duration: animationDuration,
            useNativeDriver: true,
          }).start()
        }
      })
      this.isAnimating = false
      this.buttonsEnabled = true
      this.forceUpdate()
    }, this.showDuration)
  }

  renderInfo = () => {
    return (
      <View style={Generics.container}>
        <Animated.View style={{ paddingBottom: 20 }}>
          <Text style={Generics.bigText}>{translate('rememberThePattern')}</Text>
        </Animated.View>
        <CustomButton
          backgroundColor={gameColor}
          text={translate('start')}
          onPress={this.startGame}
        />
        <Text style={Generics.hintText}>{translate('XmistakesAllowed').replace('2', 2)}</Text>
      </View>
    )
  }

  onSquarePress = (index) => {
    if (
      this.isAnimating ||
      this.state.squares[index].pushed ||
      !this.buttonsEnabled ||
      this.state.lives <= 0
    ) {
      return
    }
    if (this.hapticView && user.get().localSettings.hapticEnabled) {
      //PERFORM HAPTIC
    }
    this.buttonsEnabled = false
    this.state.squares[index].pushed = true
    if (this.state.squares[index].special) {
      audio.play('vm2.wav', 0.5)
      this.specialSquarePushed++
      this.state.score += 10
    } else {
      audio.play('vm1.wav', 0.5)
      this.state.levelMistakes++
      this.wrongTileCount++
      if (this.state.levelMistakes > 2 && this.state.lives == 1) {
        clearTimeout(this.answerTime)
      }
    }
    this.forceUpdate()

    if (
      this.specialSquarePushed != this.specialSquareRequired &&
      this.state.levelMistakes < 3 &&
      this.state.lives > 0
    ) {
      this.buttonsEnabled = true
    }

    Animated.timing(this.state.squares[index].animation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (this.specialSquarePushed == this.specialSquareRequired) {
        this.startNextLevel()
      } else if (this.state.levelMistakes > 2) {
        if (this.state.lives == 1) {
          this.endGame()
        } else {
          this.startNextLevel(true)
        }
      }
    })
  }

  renderSquares = () => {
    var squareWidth = _SCREEN.width / Math.sqrt(this.state.squares.length)
    return this.state.squares.map((square, index) => {
      return (
        <Animated.View
          key={index}
          style={{
            width: squareWidth - 8,
            height: squareWidth - 8,
            margin: 4,
            transform: [
              {
                rotateX: square.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
            borderRadius: squareWidth / 4,
            backgroundColor: square.pushed
              ? square.special
                ? gameColor
                : colors.secondaryLight
              : colors.secondaryLight2,
          }}
        />
      )
    })
  }

  renderGame = () => {
    return (
      <View style={{ flex: 1 }}>
        {this.state.isAnimating && (
          <Animated.View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              ...StyleSheet.absoluteFill,
              zIndex: 2,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: this.levelAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            }}
          >
            <View
              style={{
                width: _SCREEN.width,
                paddingVertical: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.secondaryDark,
              }}
            >
              <Text style={Generics.bigText}>
                {translate('levelX').replace('2', this.state.level)}
              </Text>
            </View>
          </Animated.View>
        )}

        <View style={{ width: _SCREEN.width, height: TOP_BAR_HEIGHT }}>
          {!this.state.isAnimating && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: TOP_BAR_HEIGHT / 3.2,
              }}
            >
              <CounterBar
                time={answerDuration + this.showDuration}
                width={_SCREEN.width * 0.8}
                color={gameColor}
              />
            </View>
          )}

          <View
            style={{
              flex: 2,
              paddingBottom: 10,
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}
          >
            <BouncingText style={{ ...Generics.text, textAlign: 'center' }}>
              {translate('level')}: {this.state.level}
            </BouncingText>
            <BouncingText style={{ ...Generics.bigText, fontWeight: 'bold' }}>
              {translate('score')}: {this.state.score}
            </BouncingText>
            <SwappingText style={{ ...Generics.text, textAlign: 'center' }}>
              {translate('lives')}: {this.state.lives}
            </SwappingText>
          </View>
        </View>

        <View
          {...this.panResponder.panHandlers}
          style={{
            width: _SCREEN.width,
            height: _SCREEN.width,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {this.renderSquares()}
        </View>
      </View>
    )
  }

  renderFinish = () => {
    return (
      <GameResult onRestart={this.reinitialize} game="VisualMemoryGame" score={this.state.score} />
    )
  }

  render() {
    return (
      <View style={Generics.container}>
        {this.state.gameStatus == 'info' && this.renderInfo()}

        {this.state.gameStatus == 'active' && this.renderGame()}

        {this.state.gameStatus == 'finished' && this.renderFinish()}
      </View>
    )
  }
}

const colors = _APP_SETTINGS.colors;