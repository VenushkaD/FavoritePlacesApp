import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import OutlinedButton from '../UI/OutlinedButton';
const ImagePicker = ({ onImageTaken }) => {
  const [pickedImage, setPickedImage] = useState();

  const [cameraRequestPermissionInformation, requestPermission] =
    useCameraPermissions();

  const verifyPermission = async () => {
    if (
      cameraRequestPermissionInformation.status ===
      PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }
    if (cameraRequestPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'Provide camera access to proceed'
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    const result = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (result.cancelled) {
      return;
    }

    // console.log(result);
    setPickedImage(result.uri);
  };

  useEffect(() => {
    onImageTaken(pickedImage);
  }, [pickedImage, onImageTaken]);

  let imagePreview = <Text style={styles.text}>No image to preview</Text>;

  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton icon='camera' onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: Colors.primary900,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
