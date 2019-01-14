import { Navigation } from 'react-native-navigation';

import MainScreen from './screens/MainScreen';

//GAMES
import ReactionSpeedScreen from './screens/Games/ReactionSpeedScreen';

export function registerScreens() {

  Navigation.registerComponent('MainScreen', () => MainScreen);

  //GAMES
  Navigation.registerComponent('ReactionSpeedScreen', () => ReactionSpeedScreen);

}