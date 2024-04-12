import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CommonButton from '../../Common/Button';

const SendQuoteLanding = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const navigation = useNavigation();
  const options = ['Life', 'Funeral', 'Savings', 'Retirement'];

  const renderRadioButton = (option: string) => {
    const isSelected = selectedOption === option;

    return (
      <TouchableOpacity
        key={option}
        style={styles.radioButtonContainer}
        onPress={() => setSelectedOption(option)}>
        <View style={[styles.radioButton, isSelected && styles.radioButtonActive]}>
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={styles.radioButtonText}>{option}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>Quick quote</Text>
      </View>
      <View style={styles.productContainer}>
        <Text style={styles.productText}>Select product</Text>
        {options.map(renderRadioButton)}
      </View>
      <View style={styles.btnContainer}>
          <CommonButton
           title = {'Back' || ''}
           textColor={'#000000'}
           borderColor={'#0058A1'}
          />
          <CommonButton
           title = {'Next' || ''}
           colors={['#4c669f', '#3b5998', '#192f6a']}
           textColor={'#FFFFFF'}
          />
        </View>

    </View>

  );
};
export default SendQuoteLanding;

const styles = StyleSheet.create({
  quoteContainer: {
    marginTop: 50,
    marginBottom: 40,
  },
  quoteText: {
    fontSize: 24,
    color: '#37424A',
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  },
  productContainer: {
    marginBottom: 20,
  },
  productText: {
    fontSize: 20,
    color: '#37424A',
    fontWeight: '500',
    fontFamily: 'Roboto'
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonActive: {
    borderColor: '#005195',
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#005195',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#212121',
    fontFamily: 'Roboto'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 50
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#0058A1',
    borderWidth: 1,
    flex: 1,
    margin: 5,
  },
  backButtonText: {
    color: '#0058A1',
    fontSize: 14,
    fontFamily: 'Roboto'
  },
  gradientButton: {
    borderRadius: 20,
    flex: 1,
    margin: 5,
  },
  nextButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto'
  },
  btnContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginVertical: 30
  },
});