import { NetInfo, UIManager } from "react-native";
import { setI18nConfig, translate } from "./language";
import { _APP_SETTINGS } from "./constants";

export const initialization = {

  init: () => {
    UIManager.setLayoutAnimationEnabledExperimental(true);
    console.disableYellowBox = true;
    setI18nConfig();

    _APP_SETTINGS.games.map(game => {
      game.fullName = translate(game.name);
    })
  },

}