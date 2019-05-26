import {ADD_PLACE, DELETE_PLACE } from './actionTypes';
import axios from 'axios';

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
        fetch("https://us-central1-my-project-1558248234390.cloudfunctions.net/storeImage", {
            method: "POST",
            body: JSON.stringify({
                image: image.base64
            })
        })
        .catch(err => console.log(err))
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
        .catch(err => console.log(err))
        .then(res => res.json())
        .then(parsedRes => {
            console.log(parsedRes);
        });
    };
};

export const deletePlace = (key) => {
    return {
        type: DELETE_PLACE,
        placeKey: key
    };
};

