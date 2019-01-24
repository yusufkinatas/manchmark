import { Navigation } from "react-native-navigation";
import {UIManager} from "react-native";

import { registerScreens } from "./src/ui";
import { _APP_SETTINGS } from "./src/core";

var colors = _APP_SETTINGS.colors;

registerScreens();
UIManager.setLayoutAnimationEnabledExperimental(true);
console.disableYellowBox = true;

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: "MainScreen",
              // name: "VisualMemoryGame",
              options: {
                topBar: {
                  height: 0,
                }
              }
            }
          }
        ],
      }
    }
  });

  Navigation.setDefaultOptions({    
    topBar: {
      background: {
        color: colors.secondaryDark,
      },
      title: {
        color: colors.secondaryLight3,     
      },
      backButton: {
        color: colors.secondaryLight3,
      }
    },
    animations: {
      setRoot: {
        alpha: {
          from: 0,
          to: 1,
          duration: 250
        }
      },
      push: {
        content: {
          alpha: {
            from: 0,
            to: 1,
            duration: 500,
            interpolation: 'accelerate'
          }
        }
      },
      pop: {
        content: {
          alpha: {
            from: 1,
            to: 0,
            duration: 500,
            interpolation: 'accelerate'
          }
        }
      }
    }
  })
});