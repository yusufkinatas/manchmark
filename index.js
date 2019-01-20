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
              // name: "NumberMemoryGame",
              options: {
                topBar: {
                  height: 0
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
        color: colors.secondary,
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
          duration: 300
        }
      },
      push: {
        topBar: {
          alpha: {
            from: 0,
            to: 1,
            duration: 250,
            interpolation: 'accelerate'
          }
        },
        content: {
          alpha: {
            from: 0,
            to: 1,
            duration: 250,
            interpolation: 'accelerate'
          }
        }
      },
      pop: {
        topBar: {
          alpha: {
            from: 1,
            to: 0,
            duration: 250,
            interpolation: 'accelerate'
          }
        },
        content: {
          alpha: {
            from: 1,
            to: 0,
            duration: 250,
            interpolation: 'decelerate'
          }
        }
      }
    }
  })
});