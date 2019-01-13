import { Navigation } from 'react-native-navigation';

import MainScreen from './screens/MainScreen';

export function registerScreens() {

  Navigation.registerComponent('MainScreen', () => MainScreen);

}