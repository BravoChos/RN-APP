import { TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from './actionTypes';
import {apiKey} from '../../../keys';
import { uiStartLoading, uiStopLoading } from "./index";
import startMainTabs from "../../screens/MainTabs/startMainTabs";
//import { AsyncStorage } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import App from "../../../App";

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
            //console.log(parsedRes,"Sdfsdf")
            if (!parsedRes.idToken) {
              alert("Authentication failed, please try again!");
            } else {
              dispatch(authStoreToken(parsedRes.idToken, parsedRes.expiresIn, parsedRes.refreshToken));
              startMainTabs();
            }
          });
    };
};

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch => {
      //console.log("authStoreToken", token)

      const now = new Date();
      const expiryDate = now.getTime() + expiresIn * 1000;
      dispatch(authSetToken(token,expiryDate));
      console.log(expiryDate,"rxp")
      AsyncStorage.setItem("ap:auth:token", token);
      AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
      AsyncStorage.setItem("ap:auth:refreshToken", refreshToken);
  };
};

export const authSetToken = (token, expiryDate) => {
  return {
    type: AUTH_SET_TOKEN,
    token: token,
    expiryDate: expiryDate
  };
};

export const authGetToken = () => {
  return (dispatch, getState) => {
      const promise = new Promise((resolve, reject) => {
          const token = getState().auth.token;
          const expiryDate = getState().auth.expiryDate;
          if (!token || new Date(expiryDate) <= new Date()) {
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
            console.log("???????")
              resolve(token);
          }
      });  
      return promise
      .catch(err => {
        console.log(err)
          return AsyncStorage.getItem("ap:auth:refreshToken")
              .then(refreshToken => {
                return fetch(
                  "https://securetoken.googleapis.com/v1/token?key=" + apiKey,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "grant_type=refresh_token&refresh_token=" + refreshToken
                  }
                );
              })
              .then(res => res.json())
              .then(parsedRes => {
                if (parsedRes.id_token) {
                  console.log("Refresh token worked!");
                  dispatch(
                    authStoreToken(
                      parsedRes.id_token,
                      parsedRes.expires_in,
                      parsedRes.refresh_token
                    )
                  );
                  return parsedRes.id_token;
                } else {
                  console.log("?")
                  dispatch(authClearStorage());
                }
              });
      })
      .then(token => {
        if (!token) {
          throw new Error();
        } else {
          //console.log("get token success")
          return token;
        }
      });
  };
};

export const authAutoSignIn = () => {
  return dispatch => {
    console.log("auth auto")
      dispatch(authGetToken())
      .then(token => {
        console.log(token)
          startMainTabs();
      })
      .catch(err => console.log("Failed to fetch token!"));
  };
};

export const authClearStorage = () => {
  return dispatch => {
      console.log("authClearStorage funcion")
      console.log(AsyncStorage.getItem("ap:auth:Token"))
      console.log(AsyncStorage.getItem("ap:auth:expiryDate"))
      AsyncStorage.removeItem("ap:auth:token");
      AsyncStorage.removeItem("ap:auth:expiryDate");
      // console.log(AsyncStorage.getItem("ap:auth:Token"))
      // console.log(AsyncStorage.getItem("ap:auth:expiryDate"))
      return AsyncStorage.removeItem("ap:auth:refreshToken");
  }
}

export const authLogout = () => {
  return dispatch => {
    console.log("auth logout")
    dispatch(authClearStorage())
    .then(() => {
      console.log("app")
      App();
    });
    dispatch(authRemoveToken());
  };
};

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
};
