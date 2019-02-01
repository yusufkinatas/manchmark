import { NetInfo, UIManager } from "react-native";

import { _APP_SETTINGS, _SERVER_SETTINGS, store } from './';

export const initialization = {

  init: () => {
    UIManager.setLayoutAnimationEnabledExperimental(true);
    console.disableYellowBox = true;    
  },

}