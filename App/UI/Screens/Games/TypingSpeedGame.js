import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
  Linking,
  TextInput,
  Animated,
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
import CounterBar from '@Components/CounterBar'
import CustomButton from '@Components/CustomButton'
import SwappingText from '@Components/SwappingText'
import BouncingText from '@Components/BouncingText'
import GameResult from '@Components/GameResult'

const TIMEOUT_MS = 30000
const WORDS = require('@Assets/wordsEn.json').wordsEn
const gameColor = _APP_SETTINGS.games.find((g) => g.name == 'TypingSpeedGame').backgroundColor

export default class TypingSpeedGame extends Component {
  static options(passProps) {
    return {
      topBar: {
        title: {
          text: translate('TypingSpeedGame'),
        },
      },
    }
  }

  constructor(props) {
    super(props)
    this.usedWords = []
    this.keyPressCount = 0

    this.state = {
      gameStatus: 'info', //info - active - finished
      score: 0,
      question: '',
      word: ['', '', ''],
      trueAnswer: 0,
    }
  }

  reinitialize = () => {
    this.usedWords = []
    this.keyPressCount = 0
    clearTimeout(this.endGameTimeout)
    this.endGameTimeout = null

    this.setState({
      gameStatus: 'info',
      score: 0,
      question: '',
      word: ['', '', ''],
      trueAnswer: 0,
    })
  }

  componentWillUnmount() {
    clearTimeout(this.endGameTimeout)
    clearTimeout(this.keyboardTimer)
  }

  generateNewWord = () => {
    let randomWord
    do {
      randomWord = WORDS[utils.randomBetween(0, WORDS.length)]
    } while (
      this.usedWords.indexOf(randomWord) != -1 ||
      randomWord.length < 3 ||
      randomWord.length > 7
    )
    return randomWord
  }

  startGame = () => {
    let tmpArray = ['', '', '']
    tmpArray[0] = this.generateNewWord()
    tmpArray[1] = this.generateNewWord()
    tmpArray[2] = this.generateNewWord()

    this.setState({ gameStatus: 'active', word: tmpArray })
  }

  endGame = () => {
    this.correctKeypress = (this.state.score - this.usedWords.length * 10) / 5
    this.extraData = [{ data: [translate('wordCount'), this.usedWords.length], important: true }]
    this.extraData.push({ data: [translate('keyPress'), this.correctKeypress], important: true })

    let oldUserStat = user.get().statistics
    let typeStats = oldUserStat.TypingSpeedGame

    user.set(
      {
        statistics: {
          ...oldUserStat,
          ['TypingSpeedGame']: {
            amountPlayed: typeStats.amountPlayed + 1,
            totalWordCount: typeStats.totalWordCount + this.usedWords.length,
            totalKeyPress: typeStats.totalKeyPress + this.keyPressCount,
            totalCorrectKeyPress: typeStats.totalCorrectKeyPress + this.correctKeypress,
          },
        },
      },
      true
    )
    user.updateStatistics()
    this.setState({ gameStatus: 'finished' })
  }

  renderInfo = () => {
    return (
      <View style={Generics.container}>
        <Text style={Generics.bigText}>
          {translate('writeMuchInXSeconds').replace('2', TIMEOUT_MS / 1000)}
        </Text>
        <View style={{ height: 20 }} />
        <CustomButton
          backgroundColor={gameColor}
          text={translate('start')}
          onPress={this.startGame}
        />
        <Text style={Generics.hintText}>{translate('youCanWriteInAnyOrder')}</Text>
      </View>
    )
  }

  clearText = () => {
    this.textInputRef.setNativeProps({ text: '' })
  }

  onChangeText = (text) => {
    if (!this.endGameTimeout) {
      this.counterBarRef.start(TIMEOUT_MS)
      this.endGameTimeout = setTimeout(() => {
        this.endGame()
      }, TIMEOUT_MS)
    }

    this.keyPressCount++
    let ans = text.toLowerCase().trim()
    this.onAnswer(ans)
  }

  onAnswer = (answer) => {
    let newWord,
      index = -1
    let tmpArray = this.state.word
    switch (answer) {
      case this.state.word[0]:
        index = 0
        break
      case this.state.word[1]:
        index = 1
        break
      case this.state.word[2]:
        index = 2
        break
    }
    if (index != -1) {
      this.usedWords.push(answer)
      tmpArray[index] = this.generateNewWord()
      audio.play('correct.wav', 0.4)
      this.clearText()
      this.keyboardTimer = setTimeout(() => {
        this.setState(
          { word: tmpArray, score: this.state.score + answer.length * 5 + 10 },
          this.clearText
        )
      }, 80)
    }
  }

  renderGame = () => {
    return (
      <KeyboardAvoidingView behavior="padding" style={Generics.container}>
        <CounterBar
          ref={(r) => (this.counterBarRef = r)}
          width={_SCREEN.width * 0.8}
          color={gameColor}
        />
        <BouncingText style={Generics.bigText}>
          {translate('score')} : {this.state.score}
        </BouncingText>
        <View style={{ height: 10 }} />

        <View style={{ flexDirection: 'row', backgroundColor: gameColor }}>
          <View
            style={{
              ...styles.wordContainer,
              backgroundColor: gameColor,
              borderRightWidth: 2,
              borderColor: colors.secondaryLight3,
            }}
          >
            <SwappingText style={{ ...Generics.questionText }}>{this.state.word[0]}</SwappingText>
          </View>

          <View
            style={{
              ...styles.wordContainer,
              backgroundColor: gameColor,
              borderRightWidth: 2,
              borderColor: colors.secondaryLight3,
            }}
          >
            <SwappingText style={Generics.questionText}>{this.state.word[1]}</SwappingText>
          </View>

          <View style={styles.wordContainer}>
            <SwappingText style={Generics.questionText}>{this.state.word[2]}</SwappingText>
          </View>
        </View>

        <TextInput
          ref={(r) => (this.textInputRef = r)}
          onChangeText={this.onChangeText}
          autoCapitalize={'none'}
          autoCorrect={false}
          spellCheck={false}
          secureTextEntry={false}
          bufferDelay={0}
          textContentType={'none'}
          autoFocus={true}
          style={{
            width: _SCREEN.width / 3,
            borderBottomWidth: 1,
            borderColor: gameColor,
            padding: 5,
            textAlign: 'center',
            fontSize: 25,
            fontFamily: 'roboto',
            color: colors.secondaryLight3,
            marginBottom: 20,
          }}
          underlineColorAndroid={'transparent'}
        />
      </KeyboardAvoidingView>
    )
  }

  renderFinish = () => {
    return (
      <GameResult
        onRestart={this.reinitialize}
        game="TypingSpeedGame"
        score={this.state.score}
        extraData={this.extraData}
      />
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

const colors = _APP_SETTINGS.colors
const styles = StyleSheet.create({
  wordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingVertical: 5,
    flex: 1,
  },
})
