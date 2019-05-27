import { SET_PLACES, REMOVE_PLACE  } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';

//import axios from 'axios';

// export const addPlace = (placeName, location,image ) => async dispatch => {
//     const placeData = {
//         name: placeName,
//         location: location
//     };
//     console.log(image.content)
//     const res = await axios.post("https://my-project-1558248234390.firebaseio.com//places.json", placeData)
//     console.log("hello",res);
//     dispatch ({ type: ADD_PLACE, payload: res.data});

// };

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        dispatch(uiStartLoading());
        fetch("https://us-central1-my-project-1558248234390.cloudfunctions.net/storeImage", {
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
            return fetch("https://my-project-1558248234390.firebaseio.com//places.json", {
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
        fetch("https://my-project-1558248234390.firebaseio.com//places.json")
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

        fetch("https://my-project-1558248234390.firebaseio.com//places/" + key + ".json", {
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
