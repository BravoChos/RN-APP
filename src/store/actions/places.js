import { SET_PLACES, REMOVE_PLACE, PLACE_ADDED, START_ADD_PLACE  } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';
import { storeUrl, dbUrl, dbdUrl } from '../../../keys'
//import axios from 'axios';

// export const addPlace = (placeName, location,image ) => async dispatch => {
//     const placeData = {
//         name: placeName,
//         location: location
//     };
//     console.log(image.content)
//     const res = await axios.post(dbUrl, placeData)
//     console.log("hello",res);
//     dispatch ({ type: ADD_PLACE, payload: res.data});

// };
export const startAddPlace = () => {
    return {
      type: START_ADD_PLACE
    };
};

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        let authToken;
        dispatch(uiStartLoading());
        dispatch(authGetToken())
        .catch(() => {
            alert("No valid token found!");
          })
        .then(token => {
            authToken = token;
            return fetch(
                storeUrl,
                {
                    method: "POST",
                    body: JSON.stringify({
                        image: image.base64
                    }),
                    headers: {
                        Authorization: "Bearer " + authToken
                    }
                }
            );
        })        
        .catch(err => {
            console.log(err);
            alert("Something went wrong, please try again!");
            dispatch(uiStopLoading());
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error();
            }
        })
        .then(parsedRes => {
            console.log(parsedRes)
            const placeData = {
                name: placeName,
                location: location,
                image: parsedRes.imageUrl,
                imagePath: parsedRes.imagePath
            };
            console.log(placeData.imagePath,"Hello image path");
            return fetch(dbUrl+"?auth="+authToken, {
                method: "POST",
                body: JSON.stringify(placeData)
            })
        })  
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error();
            }
        })
        .then(parsedRes => {
            //console.log(parsedRes);
            dispatch(uiStopLoading());
            dispatch(placeAdded());
        })
        .catch(err => {
            console.log(err);
            alert("Something went wrong, please try again!");
            dispatch(uiStopLoading());
        });
    };
};

export const placeAdded = () => {
    return {
      type: PLACE_ADDED
    };
};

export const getPlaces = () => {
    return dispatch => {
        dispatch(authGetToken())
        .then(token => {
            //console.log("token",token)
            return fetch(
                dbUrl + 
                "?auth=" +
                token
            );
        })
        .catch(() => {
            alert("No valid token found! get places");
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
            throw new Error();
            }
        })
        .then(parsedRes => {
            const places = [];
            for (let key in parsedRes) {
                places.push({
                    ...parsedRes[key],
                    image: {
                        uri: parsedRes[key].image
                    },
                    key: key
                });
            }
            dispatch(setPlaces(places));
        })
        .catch(err => {
            alert("Something went wrong, sorry :/");
            console.log(err);
        });
    };
};

export const setPlaces = places => {
    return {
        type: SET_PLACES,
        places: places
    };
};


export const deletePlace = (key) => {
    return dispatch => {
        dispatch(authGetToken())
        .catch(() => {
            alert("No valid token found!");
        })
        .then(token => {
            dispatch(removePlace(key));
            return fetch(
                dbdUrl + 
                key + 
                ".json?auth=" + 
                token, 
                {
                    method: "DELETE"
                }
            )
        })
        .then(res => {
            if (res.ok) {
                console.log(res.ok,"ok")
                return res.json();
            } else {
                console.log("error")
                throw new Error();
            }
        })
        .then(parsedRes => {
            console.log("Done!");
        })
        .catch(err => {
            alert("Something went wrong, sorry :/");
            console.log(err);
        });
    };
};

export const removePlace = key => {
    return {
        type: REMOVE_PLACE,
        key: key
    };
};
