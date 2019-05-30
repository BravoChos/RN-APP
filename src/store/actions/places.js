import { SET_PLACES, REMOVE_PLACE  } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';
import { storeUrl, dbUrl } from '../../../keys'
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

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        dispatch(uiStartLoading());
        dispatch(authGetToken())
        .catch(() => {
            alert("No valid token found!");
          })
        .then(token => {
            return fetch(
                storeUrl,
                {
                method: "POST",
                body: JSON.stringify({
                    image: image.base64
                })
                }
            );
        })        
        .catch(err => {
            console.log(err);
            alert("Something went wrong, please try again!");
            dispatch(uiStopLoading());
        })
        .then(res => res.json())
        .then(parsedRes => {
            console.log(parsedRes)
            const placeData = {
                name: placeName,
                location: location,
                image: parsedRes.imageUrl
            };
            console.log(placeData)
            return fetch(dbUrl, {
                method: "POST",
                body: JSON.stringify(placeData)
            })
        })  
        .then(res => res.json())
        .then(parsedRes => {
            console.log(parsedRes);
            dispatch(uiStopLoading());
        })
        .catch(err => {
            console.log(err);
            alert("Something went wrong, please try again!");
            dispatch(uiStopLoading());
        });
    };
};

export const getPlaces = () => {
    return dispatch => {
        dispatch(authGetToken())
        .then(token => {
            return fetch(
                dbUrl + 
                "?auth=" +
                token
            );
        })
        .catch(() => {
            alert("No valid token found!");
        })
        .then(res => res.json())
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
                dbUrl + 
                key + 
                ".json?auth=" + 
                token, 
                {
                    method: "DELETE"
                }
            )
        })
        .then(res => res.json())
        .then(parsedRes => {
            console.log("Done!", parsedRes);
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
