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
  ranks: { userCount: null, },
  globalAverages: {},
  globalHighscores: {},
  friendHighscores: {},
  follows: [],
  contacts: [],
  phone: null,
  improvements: {},
  settings: {
    friendsEnabled: false
  },
  statistics: {
    VisualMemoryGame: {
      amountPlayed: 0,
      totalCorrectTilePress: 0,
      totalWrongTilePress: 0
    },
    NumberMemoryGame: {
      amountPlayed: 0,
      totalNumberMemorized: 0,
    },
    TouchSpeedGame: {
      amountPlayed: 0,
      totalTouchCount: 0
    },
    ReactionSpeedGame: {
      amountPlayed: 0,
      fastestReaction: 0,
      fastestAverage: 0
    },
    TypingSpeedGame: {
      amountPlayed: 0,
      totalWordCount: 0,
      totalCorrectKeyPress: 0,
      totalKeyPress: 0
    },
    VerbalMemoryGame: {
      amountPlayed: 0,
      totalWordMemorized: 0
    },
    CalculationSpeedGame: {
      amountPlayed: 0,
      totalCalculation: 0
    }
  }
};

_APP_SETTINGS.games.forEach(game => {
  _user[game.hsName] = null;
  _user.ranks[game.hsName] = null;
  _user.globalAverages[game.hsName] = null;
  _user.globalHighscores[game.hsName] = [];
  _user.friendHighscores[game.hsName] = [];
  _user.improvements[game.hsName] = [];
});

export const user = {

  get: () => _user,

  set: (obj, saveToStore?= false) => {
    _user = { ..._user, ...obj };
    if (saveToStore) {
      store.setItem("user", _user)
        .then(res => { })
        .catch(err => console.log(err));
    }
  },

  initialize: () => {
    //TOKEN İSTEMEYEN İŞLEMLER
    user.compareLocalHighscores();
    user.getAllRanks();
    user.getGlobalAverages();
    user.getGlobalHighscores();
    user.getSettings();
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

      _user[highScoreName] = score;

      if (_.isArray(_user.improvements[highScoreName])) {
        _user.improvements[highScoreName].push({ score, date: new Date().getTime() });
      }
      else {
        _user.improvements[highScoreName] = [{ score, date: new Date().getTime() }];
      }

      user.set({}, true); //for saving user to store easily

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
          user.set({ ranks: { ..._user.ranks, userCount: res.data.userCount, [game]: res.data.rank } }, true);
          console.log("get rank", game, _user);
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        })
    });
  },

  getAllRanks: () => {
    _APP_SETTINGS.games.forEach(g => {
      user.getRank(g.hsName)
        .then(res => { })
        .catch(err => {
          console.log("ERR", g.hsName, err)
        });
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

  getGlobalHighscores: () => {
    return new Promise((resolve, reject) => {
      api.getLeaderboard(25)
        .then(res => {
          user.set({ globalHighscores: res }, true);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  getFriendHighscores: () => {
    return new Promise((resolve, reject) => {
      api.getFriendLeaderboard(_user.authToken)
        .then(res => {
          user.set({ friendHighscores: res }, true);
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

  changePhoneNumber: (facebookAuthCode) => {
    return new Promise((resolve, reject) => {
      api.changePhoneNumber(_user.authToken, facebookAuthCode)
        .then(res => {
          user.set({ phone: res.phone }, true);
          resolve();
        })
        .catch(err => reject(err));

    });
  },

  getSettings: () => {
    return new Promise((resolve, reject) => {
      api.getSettings().then((res) => {
        console.log("SETTIGNS", res);
        user.set({ settings: res.settings }, true);
        resolve();
      }).catch(err => {
        reject();
      });
    });
  },

  follow: (_id) => {
    return new Promise((resolve, reject) => {
      api.follow(_user.authToken, _id)
        .then(res => {
          console.log("New follow:", res)
          user.set({ follows: res.follows }, true);
          resolve();
        })
        .catch(err => reject(err));

    });
  },

  unfollow: (_id) => {
    return new Promise((resolve, reject) => {
      api.unfollow(_user.authToken, _id)
        .then(res => {
          console.log("New unfollow:", res)
          user.set({ follows: res.follows }, true);
          resolve();
        })
        .catch(err => reject(err));

    });
  },

};