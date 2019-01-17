import { Navigation } from 'react-native-navigation';

import MainScreen from './screens/MainScreen';

//GAMES
import ReactionSpeedGame from './screens/Games/ReactionSpeedGame';
import TouchSpeedGame from './screens/Games/TouchSpeedGame';

export function registerScreens() {

  Navigation.registerComponent('MainScreen', () => MainScreen);

  //GAMES
  Navigation.registerComponent('ReactionSpeedGame', () => ReactionSpeedGame);
  Navigation.registerComponent('TouchSpeedGame', () => TouchSpeedGame);

}