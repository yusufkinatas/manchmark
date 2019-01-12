import React from 'react';
import ReactNative, { AsyncStorage } from 'react-native';
import { ram } from './ram';

const prefix = "STORE";

export const store = {

  getItem: (key: string, cloneRam?: boolean = true) => {
    
    if (typeof cloneRam == "undefined") cloneRam = true;
    
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('@' + prefix + key)
      .then(val => {
        if (cloneRam) {           
          ram.set(key, val);
        }
        if (!val) {
          val = null;
        }
        resolve(val)
      })
      .catch(err => {             
        resolve();
      })
      .finally(() => {
        resolve();
      });
    });
  },

  setItem: (key, val, cloneRam?: boolean = true) => {
    if (typeof cloneRam == "undefined") {
      cloneRam = true;
    }
    if (!val) {
      val = '';
    }
    
    if (cloneRam) {
      ram.set(key, val);
    }
    return AsyncStorage.setItem('@' + prefix + key, typeof val != 'string' ? JSON.stringify(val) : val);
  },

  removeItem: (key, removeFromRam?: boolean = true) => {
    if (typeof removeFromRam == "undefined") {
      removeFromRam = true;
    }
    if (removeFromRam) {
      ram.remove(key);
    }
    return AsyncStorage.removeItem('@' + prefix + key);
  },
}