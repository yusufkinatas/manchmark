
import Sound from "react-native-sound";

Sound.setCategory('Playback');

export const audio = {

  play: (soundName, volume = 1) => {
    if (!this[soundName]) {
      this[soundName] = new Sound(soundName, Sound.MAIN_BUNDLE, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        this[soundName].setVolume(volume).play();
      });
    }
    else {
      this[soundName].stop();
      this[soundName].setVolume(volume).play();
    }
  },

};