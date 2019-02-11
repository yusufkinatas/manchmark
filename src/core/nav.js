import { Navigation } from "react-native-navigation";

import { _APP_SETTINGS, _SCREEN } from './constants';

const pushCooldown = 250;
var pushAviable = true;
const colors = _APP_SETTINGS.colors;

export const nav = {

  pushScreen: (componentId: string, screen: string, ) => {
    if (!pushAviable) return;

    Navigation.push(componentId, {
      component: {
        name: screen,
        options: {
          statusBar: { backgroundColor: colors.secondaryDark },
        }
      }
    });
    pushAviable = false;
    setTimeout(() => { pushAviable = true; }, pushCooldown)
  },

  showLoginScreen: () => {
    Navigation.events().registerAppLaunchedListener(() => {
      Navigation.setRoot({
        root: {
          component: {
            name: "LoginScreen",
            options: {
              topBar: {
                height: 0,
                visible: false
              }
            }
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
        statusBar: {
          backgroundColor: colors.secondaryDark,
        },
        layout: {
          orientation: ["portrait"],
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
                duration: 250,
                interpolation: 'accelerate'
              },
              y: {
                from: _SCREEN.height * 0.15,
                to: 0,
                duration: 250,
                interpolation: "accelerate"
              }
            }
          },
          pop: {
            content: {
              alpha: {
                from: 1,
                to: 0,
                duration: 250,
                interpolation: 'decelerate'
              },
              y: {
                from: 0,
                to: _SCREEN.height * 0.15,
                duration: 250,
                interpolation: "decelerate"
              }
            }
          }
        }
      });

    });
  },

  showGame: () => {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: "MainScreen",
                options: {
                  topBar: { visible: false },
                }
              }
            }
          ],
        }
      }
    });
  },

};