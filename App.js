import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";

import AuthScreen from "./src/screens/Auth/Auth";
import SharePlace from "./src/screens/SharePlace/SharePlace";
import FindPlace from "./src/screens/FindPlace/FindPlace";
import configureStore from "./src/store/configureStore";

const store = configureStore();

// Register Screens
Navigation.registerComponent("rnapp.AuthScreen", () => AuthScreen, store, Provider);
Navigation.registerComponent("rnapp.SharePlace", () => SharePlace, store, Provider);
Navigation.registerComponent("rnapp.FindPlace", () => FindPlace, store, Provider);

// Start a App
Navigation.startSingleScreenApp({
  screen: {
    screen: "rnapp.AuthScreen",
    title: "Login"
  }
});