import DeviceInfo from 'react-native-device-info';
import _ from "lodash";

import { api } from './api';
import { store } from './store';
import { _APP_SETTINGS } from './constants';

var _user = {
  isConnected: false,
  nickname: null,
  authToken: "",
  deviceID: DeviceInfo.getUniqueID(),
  calculationSpeedHS: null,
  numberMemoryHS: null,
  reactionSpeedHS: null,
  touchSpeedHS: null,
  typingSpeedHS: null,
  verbalMemoryHS: null,
  visualMemoryHS: null,
  ranks: {
    calculationSpeedHS: null,
    numberMemoryHS: null,
    reactionSpeedHS: null,
    touchSpeedHS: null,
    typingSpeedHS: null,
    verbalMemoryHS: null,
    visualMemoryHS: null,
    userCount: null,
  },
  globalAverages: {

  },
  globalHighscores: {

  }

}

export const user = {

  get: () => _user,

  set: (obj, saveToStore?= false) => {
    _user = { ..._user, ...obj };
    if (saveToStore) {
      // console.log("SAVING USER", _user);
      store.setItem("user", _user)
        .then(res => { })
        .catch(err => console.log(err));
    }
  },

  getFromStore: () => {
    return new Promise((resolve, reject) => {
      store.getItem("user")
        .then(res => {
          var parsedUser = _.omit(JSON.parse(res), ["isConnected"]);
          console.log("USER FROM STORE", parsedUser);
          user.set(parsedUser);
          resolve(parsedUser);
        })
        .catch(err => reject(err));
    });
  },

  updateHighscore: (score, highScoreName) => {
    return new Promise((resolve, reject) => {
      user.set({ [highScoreName]: score }, true);

      if (_user.isConnected) {
        api.updateHighscores(user.get().authToken, { [highScoreName]: score })
          .then(res => {
            resolve();
          })
          .catch(err => {
            reject();
          });
      }
      else {
        store.getItem("savedHighscores").then(res => {
          var savedHighscores = JSON.parse(res);
          if (savedHighscores == null) {
            savedHighscores = {};
          }
          savedHighscores[highScoreName] = score;
          store.setItem("savedHighscores", savedHighscores);
        }).catch(err => console.log(err));
        resolve();
      }

    });
  },

  compareLocalHighscores: () => {
    store.getItem("savedHighscores").then(res => {
      var savedHighscores = JSON.parse(res);
      console.log("savedHighscores", savedHighscores);
      var promises = [];
      if (!savedHighscores) {
        return;
      }
      Object.keys(savedHighscores).forEach(game => {
        // user.updateHighscore(savedHighscores[game], game);
        promises.push(user.updateHighscore(savedHighscores[game], game))
        console.log("updating", game, "to", savedHighscores[game]);
      })
      Promise.all(promises).then(res => {
        store.removeItem("savedHighscores");
      }).catch(err => console.log(err))
    }).catch(err => console.log(err));
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

  getAllRanks: () => {
    _APP_SETTINGS.games.forEach(g => {
      api.getRank(_user.nickname, g.hsName)
        .then(res => {
          // console.log(g.hsName, res.data)
          user.set({ ranks: { ...user.get().ranks, [g.hsName]: res.data.rank, userCount: res.data.userCount } }, true);
        })
        .catch(err => {
          console.log("ERR", g.hsName, err)
        })
    })
  },

  getGlobalAverages: () => {
    return new Promise((resolve, reject) => {

      api.getAverages()
        .then(res => {
          user.set({ globalAverages: res }, true);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  getGlobalHighscores: (count) => {
    return new Promise((resolve, reject) => {
      api.getLeaderboard(count)
        .then(res => {
          user.set({ globalHighscores: res }, true);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  login: () => {
    return new Promise((resolve, reject) => {
      api.login(_user.deviceID).then((res) => {
        var userData = _.omit(res.data, ["tokens", "__v", "_id"]);
        userData.authToken = res.headers["x-auth"];
        user.set(userData, true);
        resolve();
      }).catch(err => {
        reject();
      });
    });
  },

  changeNickname: (nickname) => {
    return new Promise((resolve, reject) => {
      api.changeNickname(_user.authToken, nickname)
        .then(res => {
          console.log("NICKNAME CHANGED")
          user.set({ nickname }, true);
          resolve();
        })
        .catch(err => reject(err));

    });
  },

};