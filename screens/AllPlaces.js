import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import PlacesList from '../components/Places/PlacesList';
import { useAppContext } from '../context/appContext';

function AllPlaces() {
  const { places, getPlaces } = useAppContext();
  const isFocused = useIsFocused();
  useEffect(() => {
    getPlaces();
  }, [isFocused]);
  return <PlacesList places={places} />;
}

export default AllPlaces;
