import { Navigation } from "react-native-navigation";
import { registerScreens } from "./src/ui";
import App from './App';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: "MainScreen"
      }
    }
  });
});