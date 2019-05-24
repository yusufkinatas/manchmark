import i18n from 'i18n-js'
import * as RNLocalize from 'react-native-localize'
import { memoize } from 'lodash'

import { I18nManager } from 'react-native'

const translationGetters = {
  en: () => require('./en.json'),
  tr: () => require('./tr.json'),
}

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)

export const setI18nConfig = () => {
  const fallback = { languageTag: 'en', isRTL: false }

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback

  translate.cache.clear()
  I18nManager.forceRTL(isRTL)

  i18n.translations = { [languageTag]: translationGetters[languageTag]() }
  i18n.locale = languageTag
}
