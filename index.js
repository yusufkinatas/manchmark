import { Navigation } from "react-native-navigation";
import { UIManager } from "react-native";

import { registerScreens } from "./src/ui";
import { _APP_SETTINGS, nav, initialization } from "./src/core";

var colors = _APP_SETTINGS.colors;
initialization.init();
registerScreens();
UIManager.setLayoutAnimationEnabledExperimental(true);
console.disableYellowBox = true;

nav.showLoginScreen();