import { Navigation } from "react-native-navigation";
import { registerScreens } from "./src/ui";

registerScreens();
console.disableYellowBox = true; 

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: "MainScreen"
      }
    }
  });
});