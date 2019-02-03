import axios from "axios";

import { user } from "../core";

const API_URL = "https://manchmark-api.herokuapp.com";

export const api = {

  signup: (nickname, deviceID) => {
    return new Promise((resolve, reject) => {
      axios.post(`${API_URL}/signup`, { deviceID, nickname })
        .then(res => resolve(res))
        .catch(err => reject(err.response.data));
    });
  },

  login: (deviceID) => {
    return new Promise((resolve, reject) => {
      if (!deviceID) {
        reject("Cannot get device id");
      }
      axios.post(`${API_URL}/login`, { deviceID })
        .then(res => resolve(res))
        .catch(err => reject(err.response.data));

    });
  },

  getRank: (nickname, game) => {
    return new Promise((resolve, reject) => {
      axios.get(`${API_URL}/rank`, { headers: { nickname, game } })
        .then(res => resolve(res))
        .catch(err => reject(err.response.data));
    });
  },

  getUser: (token) => {
    return new Promise((resolve, reject) => {
      axios.get(`${API_URL}/me`, { headers: { "x-auth": token } })
        .then(res => resolve(res))
        .catch(err => reject(err.response.data));
    });
  },

  getAverages: () => {
    return new Promise((resolve, reject) => {
      axios.get(`${API_URL}/averages`)
        .then(res => resolve(res.data))
        .catch(err => reject(err.response.data));
    });
  },

  updateHighscores: (token, highscores) => {
    return new Promise((resolve, reject) => {
      console.log({ ...highscores }, token);
      axios.patch(`${API_URL}/highscores`, { ...highscores }, {
        headers: { "x-auth": token }
      })
        .then(res => resolve(res))
        .catch(err => reject(err.response.data));
    });
  },

};