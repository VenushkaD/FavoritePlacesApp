import {
  useForegroundPermissions,
  PermissionStatus,
  getCurrentPositionAsync,
} from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { getAddress, getMapPreview } from '../../util/location';
import OutlinedButton from '../UI/OutlinedButton';
import { useNavigation, useRoute } from '@react-navigation/native';
const LocationPicker = ({ onPickLocation }) => {
  const [pickedLocation, setPickedLocation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const [locationRequestPermissionInfo, requestPermission] =
    useForegroundPermissions();

  const verifyPermission = async () => {
    if (
      locationRequestPermissionInfo.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }
    if (locationRequestPermissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'Provide location access to proceed'
      );
      return false;
    }
    return true;
  };
  const getLocationHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    setIsLoading(true);
    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    const handleLocation = async () => {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.lat,
          pickedLocation.lng
        );
        onPickLocation({ ...pickedLocation, address });
      }
    };

    handleLocation();
  }, [pickedLocation, onPickLocation]);

  const pickOnMapHandler = async () => {
    const hasPermission = await verifyPermission();
    if (hasPermission) {
      setIsLoading(true);
      const location = await getCurrentPositionAsync();

      navigation.navigate('Map', {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      setIsLoading(false);
      onPickLocation(pickedLocation);
    }
  };

  useEffect(() => {
    if (route.params) {
      setPickedLocation({
        lat: route.params.location.latitude,
        lng: route.params.location.longitude,
      });
    }
  }, [route.params]);

  let locationPreview = <Text style={styles.text}>No location picked yet</Text>;

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{ uri: getMapPreview(pickedLocation.lat, pickedLocation.lng) }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapPreview}>
        {isLoading ? (
          <ActivityIndicator
            color={'white'}
            size='large'
            style={styles.activityIndicator}
          />
        ) : (
          locationPreview
        )}
      </View>
      <View style={styles.actions}>
        <OutlinedButton icon='location' onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon='map' onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
  },
  mapPreview: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: Colors.primary900,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
