import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/colors';
import FormButton from '../UI/FormButton';
import ImagePicker from './ImagePicker';
import LocationPicker from './LocationPicker';

function PlaceForm({ createPlaceHandler }) {
  const [inputs, setInputs] = useState({
    title: '',
    imageUri: '',
    location: '',
  });

  // const changeTitleHandler = (enteredText) => {
  //   setEnteredTitle(enteredText);
  // };

  const takeImageHandler = useCallback((imageUri) => {
    handleInputChange('imageUri', imageUri);
  }, []);
  const pickLocationHandler = useCallback((location) => {
    handleInputChange('location', location);
  }, []);

  const savePlaceHandler = () => {
    // console.log(inputs);
    createPlaceHandler(inputs);
  };

  const handleInputChange = (type, content) => {
    setInputs((currValues) => ({
      ...currValues,
      [type]: content,
    }));
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={inputs.title}
            onChangeText={(text) => handleInputChange('title', text)}
          />
        </View>
        <ImagePicker onImageTaken={takeImageHandler} />
        <LocationPicker onPickLocation={pickLocationHandler} />
        <FormButton onPress={savePlaceHandler}>Submit</FormButton>
      </View>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 7,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary700,
    color: 'white',
  },
});
