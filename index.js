import { registerScreens } from "./src/ui";
import { initialization, nav } from "./src/core";

registerScreens();
nav.showLoginScreen();
initialization.init();