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
        primary: '#1db954',
        secondary: '#212121',
        secondaryDark: '#121212',
        secondaryLight: '#535353',
        secondaryLight2: '#b3b3b3',
        secondaryLight3: "#ffffff"
    },
};
