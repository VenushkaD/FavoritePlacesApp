import { useContext, createContext, useReducer, useState } from 'react';
import { Place } from '../models/place';
import { fetchPlaces, insertPlace } from '../util/database';

const AppContext = createContext();

const useAppContext = () => {
  return useContext(AppContext);
};

const AppProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);

  const createPlace = async (place) => {
    // setPlaces((currValues) => [...currValues, place]);
    await insertPlace(place);
  };

  const getPlaces = async () => {
    const results = await fetchPlaces();
    // console.log(placesData.rows._array);
    const placesList = [];
    for (const db of results.rows._array) {
      placesList.push(
        new Place(db.id, db.title, db.imageUri, {
          address: db.address,
          lat: db.lat,
          lng: db.lng,
        })
      );
    }
    setPlaces([...placesList]);
  };

  return (
    <AppContext.Provider value={{ places, createPlace, getPlaces }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, useAppContext };
