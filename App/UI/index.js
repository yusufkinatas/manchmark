import { Navigation } from 'react-native-navigation'

import LoginScreen from '@Screens/LoginScreen'
import MainScreen from '@Screens/MainScreen'
import SelectGameScreen from '@Screens/SelectGameScreen'
import LeaderboardScreen from '@Screens/LeaderboardScreen'
import StatisticsScreen from '@Screens/StatisticsScreen'
import FollowsScreen from '@Screens/FollowsScreen'
import FindFriendsScreen from '@Screens/FindFriendsScreen'
import SettingsScreen from '@Screens/SettingsScreen'

import HeaderButton from '@Components/HeaderButton'

import AboutUsModal from '@Modals/AboutUsModal'
import ChangeNicknameModal from '@Modals/ChangeNicknameModal'
import LeaderboardTutorialModal from '@Modals/LeaderboardTutorialModal'

import CalculationSpeedGame from '@Screens/Games/CalculationSpeedGame'
import NumberMemoryGame from '@Screens/Games/NumberMemoryGame'
import ReactionSpeedGame from '@Screens/Games/ReactionSpeedGame'
import TouchSpeedGame from '@Screens/Games/TouchSpeedGame'
import TypingSpeedGame from '@Screens/Games/TypingSpeedGame'
import VerbalMemoryGame from '@Screens/Games/VerbalMemoryGame'
import VisualMemoryGame from '@Screens/Games/VisualMemoryGame'

export function registerScreens() {
  Navigation.registerComponent('LoginScreen', () => LoginScreen)
  Navigation.registerComponent('MainScreen', () => MainScreen)
  Navigation.registerComponent('SelectGameScreen', () => SelectGameScreen)
  Navigation.registerComponent('LeaderboardScreen', () => LeaderboardScreen)
  Navigation.registerComponent('StatisticsScreen', () => StatisticsScreen)
  Navigation.registerComponent('FollowsScreen', () => FollowsScreen)
  Navigation.registerComponent('FindFriendsScreen', () => FindFriendsScreen)
  Navigation.registerComponent('SettingsScreen', () => SettingsScreen)

  Navigation.registerComponent('HeaderButton', () => HeaderButton)

  Navigation.registerComponent('AboutUsModal', () => AboutUsModal)
  Navigation.registerComponent('ChangeNicknameModal', () => ChangeNicknameModal)
  Navigation.registerComponent('LeaderboardTutorialModal', () => LeaderboardTutorialModal)

  Navigation.registerComponent('CalculationSpeedGame', () => CalculationSpeedGame)
  Navigation.registerComponent('NumberMemoryGame', () => NumberMemoryGame)
  Navigation.registerComponent('ReactionSpeedGame', () => ReactionSpeedGame)
  Navigation.registerComponent('TouchSpeedGame', () => TouchSpeedGame)
  Navigation.registerComponent('TypingSpeedGame', () => TypingSpeedGame)
  Navigation.registerComponent('VerbalMemoryGame', () => VerbalMemoryGame)
  Navigation.registerComponent('VisualMemoryGame', () => VisualMemoryGame)
}
