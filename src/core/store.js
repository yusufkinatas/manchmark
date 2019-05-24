import React from 'react'
import ReactNative, { AsyncStorage } from 'react-native'

const prefix = 'STORE'

export const store = {
  getItem: (key: string) => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('@' + prefix + key)
        .then((val) => {
          if (!val) {
            val = null
          }
          resolve(val)
        })
        .catch((err) => {
          resolve()
        })
        .finally(() => {
          resolve()
        })
    })
  },

  setItem: (key, val) => {
    if (!val) {
      val = ''
    }
    return AsyncStorage.setItem(
      '@' + prefix + key,
      typeof val != 'string' ? JSON.stringify(val) : val
    )
  },

  removeItem: (key) => {
    return AsyncStorage.removeItem('@' + prefix + key)
  },
}
