import { NetInfo, UIManager, Text } from 'react-native'
import { setI18nConfig, translate } from './language'
import { _APP_SETTINGS } from './constants'

export const initialization = {
  init: () => {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    console.disableYellowBox = true
    setI18nConfig()

    Text.defaultProps = Text.defaultProps || {}
    Text.defaultProps.allowFontScaling = false

    _APP_SETTINGS.games.map((game) => {
      game.fullName = translate(game.name)
    })
  },
}
