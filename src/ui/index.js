import { Navigation } from 'react-native-navigation';

import MainScreen from './screens/MainScreen';
import PlaygroundScreen from './screens/PlaygroundScreen';

//GAMES
import CalculationSpeedGame from './screens/Games/CalculationSpeedGame';
import NumberMemoryGame from './screens/Games/NumberMemoryGame';
import ReactionSpeedGame from './screens/Games/ReactionSpeedGame';
import TouchSpeedGame from './screens/Games/TouchSpeedGame';
import TypingSpeedGame from './screens/Games/TypingSpeedGame';
import VerbalMemoryGame from './screens/Games/VerbalMemoryGame';
import VisualMemoryGame from './screens/Games/VisualMemoryGame';

export function registerScreens() {

  Navigation.registerComponent('MainScreen', () => MainScreen);
  Navigation.registerComponent('Playground', () => PlaygroundScreen);

  //GAMES
  Navigation.registerComponent('CalculationSpeedGame', () => CalculationSpeedGame);
  Navigation.registerComponent('NumberMemoryGame', () => NumberMemoryGame);
  Navigation.registerComponent('ReactionSpeedGame', () => ReactionSpeedGame);
  Navigation.registerComponent('TouchSpeedGame', () => TouchSpeedGame);
  Navigation.registerComponent('TypingSpeedGame', () => TypingSpeedGame);
  Navigation.registerComponent('VerbalMemoryGame', () => VerbalMemoryGame);
  Navigation.registerComponent('VisualMemoryGame', () => VisualMemoryGame);

}