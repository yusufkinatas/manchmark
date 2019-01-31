import axios from "axios";
import DeviceInfo from 'react-native-device-info';

const API_URL = "https://manchmark-api.herokuapp.com";
// const API_URL = "localhost:3000"
// cb18e013ea93f407

const deviceID = DeviceInfo.getUniqueID();

export const api = {

  signup: (nickname) => {
    return new Promise((resolve, reject) => {

      if (!deviceID) {
        reject("Cannot get device id");
      }
      axios.post(`${API_URL}/signup`, { deviceID, nickname })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  login: () => {
    return new Promise((resolve, reject) => {
      let deviceID = DeviceInfo.getUniqueID();
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
  }

};