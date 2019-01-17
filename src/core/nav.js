import { Navigation } from "react-native-navigation";

import { _APP_SETTINGS, _SERVER_SETTINGS, store } from '.';

const pushCooldown = 250;
var pushAviable = true;

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


}

const colors = _APP_SETTINGS.colors;
const styles = {
  navBarHidden: {
    navBarHidden: true,
    statusBarTextColorScheme: "light",
    statusBarTextColorSchemeSingleScreen: 'light',

  },
}