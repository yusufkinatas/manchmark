import {
    Platform,
    Dimensions,
    StyleSheet
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
        secondaryLight3: "#ffffff",
        failure: "#c0392b",
    },
};

const colors = _APP_SETTINGS.colors;

export const Generics = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.secondary
    },
    hintText: {
      fontSize: 14,
      position: "absolute",
      color: colors.secondaryLight2,
      textAlign: "center",
      paddingHorizontal: 20,
      paddingBottom: 20,
      bottom: 20
    },
    bigText: {
      fontSize: 20,
      color: colors.secondaryLight3,
      textAlign: "center",
      paddingHorizontal: 10
    },
    touchableArea: {
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      zIndex: 99,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center"
    },
    header: {
      fontFamily: "Roboto",
      fontSize: 40,
      textShadowColor: colors.secondaryDark,
      textShadowOffset: { width: 3, height: 3 },
      textShadowRadius: 3,
      width: _SCREEN.width,
      textAlign: "center",
      color: colors.secondaryLight3
    },
    hugeText: {
        fontSize: 50,
        fontWeight: "bold",
        textShadowColor: colors.secondaryDark,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        color: colors.secondaryLight3,
      },
      button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 50,
        width: _SCREEN.width * 0.65,
        marginBottom: 10,
      },
      questionText: {
        fontSize: 35,
        color: colors.secondaryLight3,
        fontWeight: "bold",
        width: _SCREEN.width,
        textAlign: "center"
      }
  });


// Smalltext
// Button

// + reactiontimedaki yazi