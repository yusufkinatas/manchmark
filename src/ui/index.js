import { Navigation } from 'react-native-navigation';

import MainScreen from './screens/MainScreen';
import PlaygroundScreen from './screens/PlaygroundScreen';

//GAMES
import ReactionSpeedGame from './screens/Games/ReactionSpeedGame';
import TouchSpeedGame from './screens/Games/TouchSpeedGame';

export function registerScreens() {

  Navigation.registerComponent('MainScreen', () => MainScreen);
  Navigation.registerComponent('PlaygroundScreen', () => PlaygroundScreen);

  //GAMES
  Navigation.registerComponent('ReactionSpeedGame', () => ReactionSpeedGame);
  Navigation.registerComponent('TouchSpeedGame', () => TouchSpeedGame);

}