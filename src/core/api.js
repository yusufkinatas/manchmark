import axios from "axios";

import { user } from "../core";

const API_URL = "https://manchmark-api.herokuapp.com";
// const API_URL = "localhost:3000"
// cb18e013ea93f407

export const api = {

  signup: (nickname, deviceID) => {
    return new Promise((resolve, reject) => {
      axios.post(`${API_URL}/signup`, { deviceID })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  login: (deviceID) => {
    return new Promise((resolve, reject) => {
      if (!deviceID) {
        reject("Cannot get device id");
      }
      axios.post(`${API_URL}/login`, { deviceID })
        .then(res => resolve(res))
        .catch(err => reject(err));

    });
  },

  getRank: (nickname, game) => {
    return new Promise((resolve, reject) => {
      axios.get(`${API_URL}/rank`, {
        data: { nickname, game }
      })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  getUser: (token) => {
    return new Promise((resolve, reject) => {
      axios.get(`${API_URL}/me`, { headers: { "x-auth": token } })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  updateHighscores: (token, highscores) => {
    return new Promise((resolve, reject) => {
      console.log({ ...highscores }, token);
      axios.patch(`${API_URL}/highscores`, { ...highscores }, {
        headers: { "x-auth": token }
      })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

};