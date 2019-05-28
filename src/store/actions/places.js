import { SET_PLACES, REMOVE_PLACE  } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
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
        fetch(storeUrl, {
            method: "POST",
            body: JSON.stringify({
                image: image.base64
            })
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
        .catch(err => {
            console.log(err);
            alert("Something went wrong, please try again!");
            dispatch(uiStopLoading());
        })
        .then(res => res.json())
        .then(parsedRes => {
            console.log(parsedRes);
            dispatch(uiStopLoading());
        });
    };
};

export const getPlaces = () => {
    return dispatch => {
        fetch(dbUrl)
        .catch(err => {
            alert("Something went wrong, sorry :/");
            console.log(err);
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

        fetch(dbUrl + key + ".json", {
            method: "DELETE"
        })
        .catch(err => {
            alert("Something went wrong, sorry :/");
            console.log(err);
        })
        .then(res => res.json())
        .then(parsedRes => {
            console.log("Done!", parsedRes);
            dispatch(removePlace(key));
        });
    };
};

export const removePlace = key => {
    return {
        type: REMOVE_PLACE,
        key: key
    };
};
