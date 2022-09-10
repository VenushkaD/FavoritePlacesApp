import { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import IconButton from '../components/UI/IconButton';
const Map = ({ route, navigation }) => {
  const [pickedLocation, setPickedLocation] = useState({
    latitude: route.params?.lat || 6.79326,
    longitude: route.params?.lng || 79.88065,
  });
  const region = {
    latitude: route.params?.lat || 6.79326,
    longitude: route.params?.lng || 79.88065,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const selectedLocationHandler = (event) => {
    setPickedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon={'save'}
          size={24}
          color={tintColor}
          onPress={handleSaveLocation}
        />
      ),
    });
  });

  const handleSaveLocation = () => {
    if (!pickedLocation) {
      Alert.alert(
        'Please select a location',
        'Tap on any location to add a marker'
      );
      return;
    }
    navigation.navigate('AddPlace', {
      location: pickedLocation,
    });
  };
  return (
    <MapView
      onPress={selectedLocationHandler}
      style={styles.map}
      initialRegion={region}
    >
      <Marker coordinate={pickedLocation} />
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
