import { TRY_AUTH, AUTH_SET_TOKEN } from './actionTypes';
import {apiKey} from '../../../keys';
import { uiStartLoading, uiStopLoading } from "./index";
import startMainTabs from "../../screens/MainTabs/startMainTabs";
//import { AsyncStorage } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

export const tryAuth = (authData, authMode) => {
    return dispatch => {
      dispatch(uiStartLoading());
      let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + apiKey;
      if (authMode === "signup") {
          url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + apiKey
      }
      fetch(
          url,
          {
            method: "POST",
            body: JSON.stringify({
              email: authData.email,
              password: authData.password,
              returnSecureToken: true
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
          .catch(err => {
            console.log(err);
            alert("Authentication failed, please try again!");
            dispatch(uiStopLoading());
          })
          .then(res => res.json())
          .then(parsedRes => {
            dispatch(uiStopLoading());
            console.log(parsedRes,"Sdfsdf")
            if (!parsedRes.idToken) {
              alert("Authentication failed, please try again!");
            } else {
              dispatch(authStoreToken(parsedRes.idToken, parsedRes.expiresIn));
              startMainTabs();
            }
          });
    };
};

export const authStoreToken = (token, expiresIn) => {
  return dispatch => {
      console.log("authStoreToken", token)
      dispatch(authSetToken(token));
      const now = new Date();
      const expiryDate = now.getTime() + expiresIn * 1000;
      console.log(expiryDate)
      AsyncStorage.setItem("ap:auth:token", token);
      AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
      console.log("authStoreToken")
  };
};

export const authSetToken = token => {
  return {
    type: AUTH_SET_TOKEN,
    token: token
  };
};

export const authGetToken = () => {
  return (dispatch, getState) => {
      const promise = new Promise((resolve, reject) => {
          const token = getState().auth.token;
          if (!token) {
              let fetchedToken;
              AsyncStorage.getItem("ap:auth:token")
              .catch(err => reject())
              .then(tokenFromStorage => {
                console.log("token From Storage",tokenFromStorage)
                  fetchedToken = tokenFromStorage;
                  if (!tokenFromStorage) {
                      reject();
                      return;
                  }
                  return AsyncStorage.getItem("ap:auth:expiryDate");
              })
              .then(expiryDate => {
                console.log("expisdfsdflkj", expiryDate)
                //console.log(fetchedToken)
                  const parsedExpiryDate = new Date(parseInt(expiryDate));
                  const now = new Date();
                  console.log(parsedExpiryDate)
                  if (parsedExpiryDate > now) {
                      dispatch(authSetToken(fetchedToken));
                      resolve(fetchedToken);
                  } else {
                      reject();
                  }
                  
              })
              .catch(err => reject());
          } else {
              resolve(token);
          }
      });  
      promise.catch(err => {
        dispatch(authClearStorage());
      });
      console.log("promise",promise)
      return promise;
  };
};

export const authAutoSignIn = () => {
  return dispatch => {
    console.log("auth auto")
      dispatch(authGetToken())
      .then(token => {
          startMainTabs();
      })
      .catch(err => console.log("Failed to fetch token!"));
  };
};

export const authClearStorage = () => {
  return dispatch => {
      AsyncStorage.removeItem("ap:auth:token");
      AsyncStorage.removeItem("ap:auth:expiryDate");
  }
}