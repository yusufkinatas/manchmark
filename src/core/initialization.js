import { _APP_SETTINGS, _SERVER_SETTINGS, store } from './';
import { NetInfo } from "react-native";
import { ram } from './ram';

export const initialization = {

  init: () => {
    return new Promise((resolve, reject) => {
      NetInfo.addEventListener("connectionChange", (res) => {
        console.log("connectionChange", res.type);
        if (res && res.type != "none") {
          ram.set("isConnected", true);
        }
        else {
          ram.set("isConnected", false);
        }
      })
      resolve();
    });
  },

}