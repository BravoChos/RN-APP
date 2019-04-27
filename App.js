import { Navigation } from "react-native-navigation";

import AuthScreen from "./src/screens/Auth/Auth";

// Register Screens
Navigation.registerComponent("rnapp.AuthScreen", () => AuthScreen);

// Start a App
Navigation.startSingleScreenApp({
  screen: {
    screen: "rnapp.AuthScreen",
    title: "Login"
  }
});