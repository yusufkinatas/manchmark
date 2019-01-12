import React from 'react';
import ReactNative from 'react-native';
 
 /*  tutup ramden hızlı okuma yapmak için.  */
export const ram = {
     
    ramdisk: {}, 
   
    set: (key, val) =>
    {
        ram.ramdisk[key] = val;
        return true;
    },

    get: (key)=>
    {
        return typeof ram.ramdisk[key] != "undefined" ? ram.ramdisk[key] : false;
    },

    remove: (key) =>
    {
       return typeof ram.ramdisk[key] != "undefined" && delete ram.ramdisk[key];
    }
}