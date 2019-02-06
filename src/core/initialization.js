import { NetInfo, UIManager } from "react-native";

export const initialization = {

  init: () => {
    UIManager.setLayoutAnimationEnabledExperimental(true);
    console.disableYellowBox = true;    
  },

}