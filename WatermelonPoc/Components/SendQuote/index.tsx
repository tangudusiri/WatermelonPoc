import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CommonTextInput from '../../Common/TextInput';
import RNDropdown from '../../Common/Dropdown';
import CheckBox from '../../Common/CheckBox';
import Button from '../../Common/Button';
import CommonButton from '../../Common/Button';
import Header from '../Header';

const SendQuoteForm = [
  {
    isInput: false,
    label: 'Title',
    placeholder: 'Select title',
    variable: 'title',
    options: ['Mr', 'Ms', 'Miss'],
    variant: 'underlined',
  },
  {
    isInput: true,
    label: 'First name',
    placeholder: 'Enter name',
    type: 'text',
    variable: 'First name',
    variant: 'outline',
    size: 'lg'
  },
  {
    isInput: true,
    label: 'Surname',
    placeholder: 'Enter surname',
    type: 'text',
    variable: 'Surname',
    variant: 'outline',
    size: 'lg',
    isTextArea: true
  },
  {
    isInput: true,
    label: 'Cellphone number',
    placeholder: 'Enter phone number',
    type: 'text',
    variable: 'Phn-num',
    variant: 'outline',
    size: 'lg'
  },
  {
    isInput: true,
    label: 'Email address',
    placeholder: 'Enter email',
    type: 'text',
    variable: 'Email',
    variant: 'outline',
    size: 'lg'
  },
];

const extraData = [
  {
    isChecked: true,
    infoText: 'Products interested in',
    products: [
      'Funeral', 'Life', 'Savings', 'Retirement'
    ]
  },
  {
    isChecked: false,
    label: 'Capture reason',
    placeholder: 'Select region',
    variant: 'outline',
    size: 'lg',
    variable: 'reason',
    options: ['India', 'Malasia', 'Chennai'],
  },
  {
    isChecked: false,
    isTextArea: true,
    placeholder: 'Type Here..........',
    variant: 'outline',
    size: 'lg',
    variable: 'description',
  },
]

const SendQuote = () => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [isChecked, setIsChecked] = useState(false);
  const scrollViewRef = useRef(null);

  console.log('formData........', formData);

  const handleInputChange = (variable: string, value: string) => {
    setFormData({ ...formData, [variable]: value });
  };

  const handleToggleCheckbox = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <KeyboardAvoidingView
        style={styles.container}
    >
    <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Header/>
        <View style={styles.textWrapper}>
          <Text style={styles.quoteText}>{'Send quote'}</Text>
          <Text style={styles.quoteDesc}>{'Capture the client details to send the quote and save the interaction. '}</Text>
        </View>
        {SendQuoteForm.map((quote, index) => (
          <View key={index}>
            {quote.isInput ?
              <CommonTextInput
                label={quote.label}
                placeholder={quote.placeholder}
                type={quote.type}
                variant={quote.variant}
                size={quote.size || 'md'}
                value={formData[quote.variable] || ''}
                onChangeText={(text: any) => handleInputChange(quote.variable, text)}

              />
              :
              <RNDropdown
                label={quote.label}
                placeholder={quote.placeholder}
                variant={quote.variant}
                options={quote.options || []}
                value={formData[quote.variable] || ''}
                onChangeText={(text: any) => handleInputChange(quote.variable, text)}
              />

            }
          </View>
        ))}
        <CheckBox 
         label={'Create lead and assign to region'} 
         onChange={(checked) => handleToggleCheckbox(checked)} 
         />
        {isChecked && (
          <View>
            {extraData.map((data, index) => (
              <View key={index}>
                {/* <Text style={styles.productInfo}>{data.infoText}</Text> */}
                {data.isChecked ?
                  <View key={index}>
                    {data.products?.map((product, productIndex) => (
                      <CheckBox key={productIndex} label={product} />
                    ))}
                  </View>
                  : data.isTextArea ? (
                    <CommonTextInput
                      label={data.label || ''}
                      placeholder={data.placeholder || ''}
                      variant={data.variant}
                      size={data.size || 'md'}
                      isTextArea={data.isTextArea}
                      value={data.variable ? formData[data.variable] || '' : ''}
                      onChangeText={(text: any) => handleInputChange(data.variable || '', text)}
                    />) : (
                    <RNDropdown
                      label={data.label || ''}
                      placeholder={data.placeholder || ''}
                      variant={data.variant}
                      options={data.options || []}
                      value={data.variable ? formData[data.variable] || '' : ''}
                      onChangeText={(text: any) => handleInputChange(data.variable || '', text)}
                    />
                  )
                }
              </View>
            ))}
          </View>
        )}
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
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SendQuote

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  textWrapper: {
    margin: 10,
  },
  quoteText: {
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.03,
    color: '#37424A',
    fontWeight: '700',
    marginVertical: 12
  },
  quoteDesc: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '400',
    color: '#37424A',
  },
  btnContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginVertical: 30
  },
  productInfo: {
    fontSize: 16,
    lineHeight: 24,
    color: '#37424A',
    margin: 10
  }
})