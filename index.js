import { registerScreens } from './src/ui'
import { initialization, nav } from '@Core'

registerScreens()
nav.showLoginScreen()
initialization.init()
