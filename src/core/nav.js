import { Navigation } from "react-native-navigation";

import { _APP_SETTINGS, _SERVER_SETTINGS, store } from '.';

const pushCooldown = 250;
var pushAviable = true;
const colors = _APP_SETTINGS.colors;

export const nav = {

  pushScreen: (componentId: string, screen: string, ) => {
    if (!pushAviable) return;

    Navigation.push(componentId, {
      component: {
        name: screen
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
        layout: {
          orientation: ["portrait"],
          backgroundColor: colors.secondary
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
                duration: 350,
                interpolation: 'accelerate'
              }
            }
          },
          pop: {
            content: {
              alpha: {
                from: 1,
                to: 0,
                duration: 250,
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
                  topBar: {
                    height: 0,
                    visible: false
                  },
                }
              }
            }
          ],
        }
      }
    });
  },

};