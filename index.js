import { Navigation } from "react-native-navigation";
import { registerScreens } from "./src/ui";
import { _APP_SETTINGS } from "./src/core";

var colors = _APP_SETTINGS.colors;

registerScreens();
console.disableYellowBox = true;

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: "MainScreen",
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
            duration: 500,
            interpolation: 'accelerate'
          }
        },
        bottomTabs: {
          alpha: {
            from: 0,
            to: 1,
            duration: 500,
            interpolation: 'decelerate'
          }
        },
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
        topBar: {
          alpha: {
            from: 1,
            to: 0,
            duration: 500,
            interpolation: 'accelerate'
          }
        },
        bottomTabs: {
          alpha: {
            from: 1,
            to: 0,
            duration: 500,
            interpolation: 'accelerate'
          }
        },
        bottomTabs: {
          alpha: {
            from: 1,
            to: 0,
            duration: 500,
            interpolation: 'decelerate'
          }
        },
        content: {
          alpha: {
            from: 1,
            to: 0,
            duration: 500,
            interpolation: 'decelerate'
          }
        }
      }
    }
  })
});