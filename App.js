import { Navigation } from "react-native-navigation";

import AuthScreen from "./src/screens/Auth/Auth";
import SharePlace from "./src/screens/SharePlace/SharePlace";
import FindPlace from "./src/screens/FindPlace/FindPlace";

// Register Screens
Navigation.registerComponent("rnapp.AuthScreen", () => AuthScreen);
Navigation.registerComponent("rnapp.SharePlace", () => SharePlace);
Navigation.registerComponent("rnapp.FindPlace", () => FindPlace);

// Start a App
Navigation.startSingleScreenApp({
  screen: {
    screen: "rnapp.AuthScreen",
    title: "Login"
  }
});