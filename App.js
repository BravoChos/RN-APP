import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";

import AuthScreen from "./src/screens/Auth/Auth";
import SharePlaceScreen from "./src/screens/SharePlace/SharePlace";
import FindPlaceScreen from "./src/screens/FindPlace/FindPlace";
import PlaceDetailScreen from "./src/screens/PlaceDetail/PlaceDetail";
import SideDrawer from "./src/screens/SideDrawer/SideDrawer";
import configureStore from "./src/store/configureStore";

const store = configureStore();

// Register Screens
Navigation.registerComponent("rnapp.AuthScreen", () => AuthScreen, store, Provider);
Navigation.registerComponent("rnapp.SharePlaceScreen", () => SharePlaceScreen, store, Provider);
Navigation.registerComponent("rnapp.FindPlaceScreen", () => FindPlaceScreen, store, Provider);
Navigation.registerComponent("rnapp.PlaceDetailScreen", () => PlaceDetailScreen, store, Provider);
Navigation.registerComponent("rnapp.SideDrawer", () => SideDrawer);

// Start a App
Navigation.startSingleScreenApp({
  screen: {
    screen: "rnapp.AuthScreen",
    title: "Login"
  }
});