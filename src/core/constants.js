import {
    Platform,
    Dimensions,
} from 'react-native';

export const _SCREEN = {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    ratio: Dimensions.get('window').height / Dimensions.get('window').width
}

export const _APP_SETTINGS = {
      colors: {
        Primary: '#ecf0f1',
        PrimaryDark: '#aaa',
        Blue: '#007AFF',
        LightBlue: '#5ac8fa',
        Red: "#ff3b30",
        Orange: "#ff9500",
        Yellow: "#ffcc00",
        Green: "#4cd964",
        Purple: "#5856d6",  
        Pink: "#ff2d55",
    },
};
