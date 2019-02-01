var _user = {
  isConnected: false,
  nickname: "User",
}

export const user = {

  get: () => _user,

  set: (obj) => _user = { ..._user, ...obj },

};