import DeviceInfo from 'react-native-device-info';
import { api } from './api';

var _user = {
  isConnected: false,
  nickname: "User",
  authToken: "",
  deviceID: DeviceInfo.getUniqueID(),
  calculationSpeedHS: null,
  numberMemoryHS: null,
  reactionSpeedHS: null,
  touchSpeedHS: null,
  typingSpeedHS: null,
  verbalMemoryHS: null,
  visualMemoryHS: null
}

export const user = {

  get: () => _user,

  set: (obj) => _user = { ..._user, ...obj },

  updateHighscore: (score, highScoreName) => {
    return new Promise((resolve, reject) => {

      api.updateHighscores(user.get().authToken, { [highScoreName]: score })
        .then(res => {
          _user[highScoreName] = score;
          resolve();
        })
        .catch(err => {
          reject();
        })
    });
  },

  getRank: (game) => {

    return new Promise((resolve, reject) => {

      api.getRank(_user.nickname, game)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        })
    });
  },

};