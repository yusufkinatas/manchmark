import { Navigation } from 'react-native-navigation'
import { StatusBar, Platform } from 'react-native'

import { _APP_SETTINGS, _SCREEN } from './constants'

const pushCooldown = 250
var pushAviable = true
const colors = _APP_SETTINGS.colors

export const nav = {
  showModal: (screen, passProps) => {
    let isAndroid = Platform.OS == 'android'
    Navigation.showModal({
      component: {
        name: screen,
        passProps,
        options: {
          layout: {
            backgroundColor: 'transparent',
          },
          modalPresentationStyle: isAndroid ? 'overCurrentContext' : 'overFullScreen',
        },
      },
    })
  },

  pushScreen: (componentId: string, screen: string, passProps) => {
    if (!pushAviable) return

    Navigation.push(componentId, {
      component: {
        name: screen,
        options: {
          statusBar: { backgroundColor: colors.secondaryDark },
        },
        passProps,
      },
    })
    pushAviable = false
    setTimeout(() => {
      pushAviable = true
    }, pushCooldown)
  },

  showLoginScreen: () => {
    Navigation.events().registerAppLaunchedListener(() => {
      Navigation.setRoot({
        root: {
          component: {
            name: 'LoginScreen',
          },
        },
      })

      Navigation.setDefaultOptions({
        topBar: {
          topMargin: StatusBar.currentHeight,
          background: {
            color: colors.secondaryDark,
          },
          title: {
            color: colors.secondaryLight3,
          },
          backButton: {
            color: colors.secondaryLight3,
            showTitle: false,
          },
        },
        statusBar: {
          drawBehind: true,
          backgroundColor: 'transparent',
          style: 'light',
        },
        navigationBar: {
          backgroundColor: colors.secondaryDark,
        },
        layout: {
          orientation: ['portrait'],
        },
        animations: {
          setRoot: {
            alpha: {
              from: 0,
              to: 1,
              duration: 250,
            },
          },
          // push: {
          //   content: {
          //     alpha: {
          //       from: 0,
          //       to: 1,
          //       duration: 250,
          //       interpolation: 'accelerate',
          //     },
          //     y: {
          //       from: _SCREEN.height * 0.15,
          //       to: 0,
          //       duration: 250,
          //       interpolation: 'accelerate',
          //     },
          //   },
          // },
          // pop: {
          //   content: {
          //     alpha: {
          //       from: 1,
          //       to: 0,
          //       duration: 250,
          //       interpolation: 'decelerate',
          //     },
          //     y: {
          //       from: 0,
          //       to: _SCREEN.height * 0.15,
          //       duration: 250,
          //       interpolation: 'decelerate',
          //     },
          //   },
          // },
          showModal: {
            enabled: false,
          },
          dismissModal: {
            enabled: false,
          },
        },
      })
    })
  },

  showGame: () => {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'MainScreen',
              },
            },
          ],
        },
      },
    })
  },
}
