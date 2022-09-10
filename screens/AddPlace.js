import { StyleSheet, View } from 'react-native';
import PlaceForm from '../components/Places/PlaceForm';
import { useAppContext } from '../context/appContext';
import { Place } from '../models/place';
function AddPlace({ navigation }) {
  const { createPlace } = useAppContext();
  const createPlaceHandler = (place) => {
    // console.log(place.title);
    const newPlace = new Place(
      undefined,
      place.title,
      place.imageUri,
      place.location
    );
    createPlace(newPlace);
    navigation.navigate('AllPlaces');
  };
  return <PlaceForm createPlaceHandler={createPlaceHandler} />;
}

export default AddPlace;
