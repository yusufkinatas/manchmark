import axios from 'axios'

const API_URL = 'https://manchmark-api.herokuapp.com'

export const api = {
  signup: (nickname, deviceID) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_URL}/signup`, { deviceID, nickname })
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  },

  login: (deviceID) => {
    return new Promise((resolve, reject) => {
      if (!deviceID) {
        reject('Cannot get device id')
      }
      axios
        .post(`${API_URL}/login`, { deviceID })
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  },

  getRank: (nickname, game) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/rank`, { headers: { nickname, game } })
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  },

  getUser: (token) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/me`, { headers: { 'x-auth': token } })
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  },

  getAverages: () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/averages`)
        .then((res) => resolve(res.data.averages))
        .catch((err) => reject(err))
    })
  },

  getLeaderboard: (count) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/leaderboard`, { headers: { count } })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  },

  getFriendLeaderboard: (token) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/leaderboard/follows`, { headers: { 'x-auth': token } })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  },

  updateHighscores: (token, highscores) => {
    return new Promise((resolve, reject) => {
      axios
        .patch(
          `${API_URL}/highscores`,
          { ...highscores },
          {
            headers: { 'x-auth': token },
          }
        )
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  },

  changeNickname: (token, nickname) => {
    return new Promise((resolve, reject) => {
      axios
        .patch(
          `${API_URL}/nickname`,
          { nickname },
          {
            headers: { 'x-auth': token },
          }
        )
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  },

  getSettings: () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/settings`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  },

  follow: (token, _id) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_URL}/follow`, { _id }, { headers: { 'x-auth': token } })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  },

  unfollow: (token, _id) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_URL}/unfollow`, { _id }, { headers: { 'x-auth': token } })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  },

  getContacts: (phones) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_URL}/contacts`, { phones })
        .then((res) => resolve(res.data.users))
        .catch((err) => reject(err))
    })
  },

  changePhoneNumber: (token, facebookAuthCode) => {
    return new Promise((resolve, reject) => {
      axios
        .patch(
          `${API_URL}/phone`,
          { code: facebookAuthCode },
          {
            headers: { 'x-auth': token },
          }
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  },

  search: (text) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/search`, { headers: { text } })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  },

  getUsers: (ids) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_URL}/users`, { ids })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  },

  updateStatistics: (token, statistics) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_URL}/statistics`, { statistics }, { headers: { 'x-auth': token } })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  },
}
