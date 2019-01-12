import { Navigation } from 'react-native-navigation';

import App from '../../App';

export function registerScreens() {

  Navigation.registerComponent('MainScreen', () => App);

}