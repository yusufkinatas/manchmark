import { store } from "./store";

export const utils = {

  randomBetween: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  increaseOrDecrease: (number, max) => {
    return (Math.random() < 0.5) ? (number + utils.randomBetween(1, max)) : (number - utils.randomBetween(1, max))
  },

  shuffleArray: (array) => {

    for (var i = array.length - 1; i >= 0; i--) {

      var randomIndex = Math.floor(Math.random() * (i + 1));
      var itemAtIndex = array[randomIndex];

      array[randomIndex] = array[i];
      array[i] = itemAtIndex;
    }

    return array;
  },

  increaseSavedNumbers: (pressTry = 0, quizTry = 0, pressCount = 0, answerCount = 0, trueAnswerCount = 0) => {
    store.getItem("savedData").then(res => {
      let parsedData = JSON.parse(res);
      parsedData.numbers = {
        pressTry: parsedData.numbers.pressTry + pressTry,
        quizTry: parsedData.numbers.quizTry + quizTry,
        pressCount: parsedData.numbers.pressCount + pressCount,
        answerCount: parsedData.numbers.answerCount + answerCount,
        trueAnswerCount: parsedData.numbers.trueAnswerCount + trueAnswerCount,
      }
      store.setItem("savedData", parsedData);
    });

  },

  alert: (title, message) => {
    Alert.alert(title, message);
  },

  placeholder: {
    ppURL: (width, height) => `https://loremflickr.com/${width}/${height}/face`,
    imageURL: (width, height) => `https://loremflickr.com/${width}/${height}/smile`,
  },

}