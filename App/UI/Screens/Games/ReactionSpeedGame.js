import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
  Linking,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import {
  store,
  _APP_SETTINGS,
  _SCREEN,
  utils,
  Generics,
  user,
  translate,
  audio,
} from '@Core'
import CustomButton from '@Components/CustomButton'
import DelayedText from '@Components/DelayedText'
import GameResult from '@Components/GameResult'

const calculatePoint = [
  () => {
    return 150
  },
  (x) => {
    let a = (x * x) / 800
    let b = -(7 / 10) * x
    let c = 198
    return utils.truncateFloatingNumber(a + b + c, 3)
  },
  (x) => {
    let a = (x * x) / 2704
    let b = -(100 / 169) * x
    let c = 236.6863
    return utils.truncateFloatingNumber(a + b + c, 3)
  },
  () => {
    return 0
  },
]

const gameColor = _APP_SETTINGS.games.find((g) => g.name == 'ReactionSpeedGame').backgroundColor

export default class ReactionSpeedGame extends Component {
  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate('ReactionSpeedGame'),
        },
      },
    }
  }

  constructor(props) {
    super(props)

    this.answer = false
    this.phase = 0
    this.randomDelay = 0
    this.startTime = 0
    this.endTime = 0
    this.reactionTime = []

    this.state = {
      gameStatus: 'info', // info - active - finished
      playingState: 'waiting',
    }
  }

  reinitialize = () => {
    this.answer = false
    this.phase = 0
    this.randomDelay = 0
    this.startTime = 0
    this.endTime = 0
    this.reactionTime = []

    clearTimeout(this.timer)

    this.setState({ gameStatus: 'info', playingState: 'waiting' })
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  startGame = () => {
    this.setState({ gameStatus: 'active' })
  }

  endGame = () => {
    let oldUserStat = user.get().statistics
    let reactionStats = oldUserStat.ReactionSpeedGame
    let averageReaction = this.findAverage()
    let fastest = this.findFastestReaction()

    let currentStats = {}

    if (
      fastest != 0 &&
      (reactionStats.fastestReaction == 0 || reactionStats.fastestReaction > fastest)
    ) {
      currentStats.fastestReaction = fastest
    } else {
      currentStats.fastestReaction = reactionStats.fastestReaction
    }

    if (
      averageReaction != 0 &&
      (reactionStats.fastestAverage == 0 || reactionStats.fastestAverage > averageReaction)
    ) {
      currentStats.fastestAverage = averageReaction
    } else {
      currentStats.fastestAverage = reactionStats.fastestAverage
    }

    currentStats.amountPlayed = reactionStats.amountPlayed + 1

    user.set(
      {
        statistics: { ...oldUserStat, ['ReactionSpeedGame']: currentStats },
      },
      true
    )

    this.extraData = [{ data: [translate('average'), this.findAverage(true)], important: true }]
    this.reactionTime.forEach((time, index) => {
      if (time) {
        this.extraData.push({ data: [`${translate('phase')} ${index + 1}`, time + 'ms'] })
      } else {
        this.extraData.push({ data: [`${translate('phase')} ${index + 1}`, '-'] })
      }
    })
    user.updateStatistics()
    this.setState({ gameStatus: 'finished' })
  }

  renderInfo = () => {
    return (
      <View style={Generics.container}>
        <View style={{ paddingBottom: 20 }}>
          <Text style={Generics.bigText}>{translate('pressTheScreenColorChanges')}</Text>
        </View>
        <Text style={Generics.hintText}>{translate('thereAre5Phases')}</Text>
        <CustomButton
          backgroundColor={gameColor}
          text={translate('start')}
          onPress={this.startGame}
        />
      </View>
    )
  }

  betweenPhases = () => {
    if (this.answer) {
      return (
        <View style={{ ...Generics.container, width: _SCREEN.width }}>
          <TouchableOpacity
            style={Generics.touchableArea}
            onPressIn={() => this.setState({ playingState: 'waiting' })}
          >
            <Text style={{ ...Generics.bigText, marginTop: -50 }}>{translate('phase')}</Text>
            <Text style={{ ...Generics.bigText, color: colors.secondaryLight2, fontSize: 15 }}>
              {this.phase} / 5
            </Text>
            <Text style={{ ...Generics.hugeText, paddingTop: 10 }}>
              {this.reactionTime[this.phase - 1]} ms
            </Text>
            <Text style={Generics.hintText}>{translate('pressForNextPhase')}</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={{ ...Generics.container, width: _SCREEN.width }}>
          <TouchableOpacity
            style={{ ...Generics.touchableArea, backgroundColor: colors.failure }}
            activeOpacity={1}
            onPressIn={() => this.setState({ playingState: 'waiting' })}
          >
            <Text style={{ ...Generics.bigText, marginTop: -50 }}>{translate('phase')}</Text>
            <Text style={{ ...Generics.bigText, color: colors.secondaryLight2, fontSize: 15 }}>
              {this.phase} / 5
            </Text>
            <Text style={Generics.hugeText}>{translate('tooEarly')}</Text>
            <Text style={Generics.hintText}>{translate('pressForNextPhase')}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderAnswerPhase = () => {
    this.startTime = new Date().getTime()
    return (
      <View style={{ ...Generics.container, width: _SCREEN.width }}>
        <TouchableOpacity
          style={{ ...Generics.touchableArea, backgroundColor: gameColor }}
          onPressIn={this.onAnswer}
        >
          <Text style={Generics.hugeText}>{translate('press')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderWaitingPhase = (randomDelay) => {
    this.timer = setTimeout(() => {
      this.setState({ playingState: 'answering' })
    }, randomDelay * 1000)
    return (
      <View style={{ ...Generics.container, width: _SCREEN.width }}>
        <TouchableOpacity style={Generics.touchableArea} onPressIn={this.onWrongAnswer}>
          <Text style={Generics.hugeText}>{translate('wait')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  onAnswer = () => {
    audio.play('correct.wav', 0.4)
    this.answer = true
    this.endTime = new Date().getTime()
    this.reactionTime.push(this.endTime - this.startTime)
    this.phase++
    this.setState({ playingState: 'betweenPhases' })
  }

  onWrongAnswer = () => {
    audio.play('wrong.wav')
    this.answer = false
    this.reactionTime.push(0)
    clearTimeout(this.timer)
    this.phase++
    this.setState({ playingState: 'betweenPhases' })
  }

  findFastestReaction = () => {
    let fastest = this.reactionTime[0]

    for (i = 1; i < this.reactionTime.length - 1; i++) {
      if ((this.reactionTime[i] != 0 && this.reactionTime[i] < fastest) || fastest == 0) {
        fastest = this.reactionTime[i]
      }
    }
    return fastest
  }

  renderGame = () => {
    let randomDelay = utils.randomDoubleBetween(1.25, 2.5)
    if (this.phase < 5) {
      switch (this.state.playingState) {
        case 'waiting':
          return this.renderWaitingPhase(randomDelay)
          break
        case 'answering':
          return this.renderAnswerPhase()
          break
        case 'betweenPhases':
          return this.betweenPhases()
          break
        default:
      }
    } else {
      this.endGame()
    }
  }

  renderFinish() {
    return (
      <View style={Generics.container}>
        <GameResult
          onRestart={this.reinitialize}
          game="ReactionSpeedGame"
          score={this.findTotalPoint()}
          extraData={this.extraData}
        />
      </View>
    )
  }

  findAverage = (isString?) => {
    let index
    let average = 0
    let count = 0
    for (index = 0; index < this.reactionTime.length; index++) {
      if (this.reactionTime[index] != 0) {
        average += this.reactionTime[index]
        count++
      }
    }
    if (count != 0) {
      average = utils.truncateFloatingNumber(average / count, 2)
    }
    if (isString) {
      return average ? average + 'ms' : '-'
    } else {
      return average
    }
  }

  findTotalPoint = () => {
    let i
    let sum = 0
    for (i = 0; i < this.reactionTime.length; i++) {
      sum += this.findScore(this.reactionTime[i])
    }
    return utils.truncateFloatingNumber(sum, 2)
  }

  findScore = (reactionTime) => {
    switch (true) {
      case reactionTime == 0:
        return calculatePoint[3]()
      case reactionTime < 80:
        return calculatePoint[0]()
      case reactionTime < 220:
        return calculatePoint[1](reactionTime)
      case reactionTime < 800:
        return calculatePoint[2](reactionTime)
      default:
        return calculatePoint[3]()
    }
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

const colors = _APP_SETTINGS.colors
