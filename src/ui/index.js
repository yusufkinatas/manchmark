import { Navigation } from 'react-native-navigation';

import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import SelectGameScreen from './screens/SelectGameScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import PlaygroundScreen from './screens/PlaygroundScreen';

//MODALS
import AboutUsModal from './modals/AboutUsModal';

//GAMES
import CalculationSpeedGame from './screens/Games/CalculationSpeedGame';
import NumberMemoryGame from './screens/Games/NumberMemoryGame';
import ReactionSpeedGame from './screens/Games/ReactionSpeedGame';
import TouchSpeedGame from './screens/Games/TouchSpeedGame';
import TypingSpeedGame from './screens/Games/TypingSpeedGame';
import VerbalMemoryGame from './screens/Games/VerbalMemoryGame';
import VisualMemoryGame from './screens/Games/VisualMemoryGame';

export function registerScreens() {

  Navigation.registerComponent('LoginScreen', () => LoginScreen);
  Navigation.registerComponent('MainScreen', () => MainScreen);
  Navigation.registerComponent('SelectGameScreen', () => SelectGameScreen);
  Navigation.registerComponent('LeaderboardScreen', () => LeaderboardScreen);
  Navigation.registerComponent('StatisticsScreen', () => StatisticsScreen);
  Navigation.registerComponent('Playground', () => PlaygroundScreen);

  //MODALS
  Navigation.registerComponent('AboutUsModal', () => AboutUsModal);

  //GAMES
  Navigation.registerComponent('CalculationSpeedGame', () => CalculationSpeedGame);
  Navigation.registerComponent('NumberMemoryGame', () => NumberMemoryGame);
  Navigation.registerComponent('ReactionSpeedGame', () => ReactionSpeedGame);
  Navigation.registerComponent('TouchSpeedGame', () => TouchSpeedGame);
  Navigation.registerComponent('TypingSpeedGame', () => TypingSpeedGame);
  Navigation.registerComponent('VerbalMemoryGame', () => VerbalMemoryGame);
  Navigation.registerComponent('VisualMemoryGame', () => VisualMemoryGame);

}