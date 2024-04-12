import { StyleSheet, Text, View } from 'react-native'
import React from 'react';

const QuickQuoteData = [
    {
        quoteType: 'Funeral Quick quote',
        formType: 'Product',
         formData: [
            {
                isdropdown: true,
                label: 'Available products',
                placeholder: 'Select Product'
            },
            {
                isdropdown: false,
                label: 'Policy start date',
                placeholder: 'Select date'
            },
         ]
    },
    {
        quoteType: 'Funeral plan calculator',
        formType: 'Applicant',
         formData: [
            {
                isdropdown: false,
                label: 'Date of birth',
                placeholder: 'Select DOB'
            },
            {
                isdropdown: true,
                label: 'Insured amount',
                placeholder: 'Select insured type'
            },
         ]
    },
];

const InsuredLifeData = [
    {
        isdropdown: true,
        label: 'Relation to the applicant',
        placeholder: 'Select relation'
    },
    {
        isdropdown: false,
        label: 'Date of birth',
        placeholder: 'Select DOB'
    },
    {
        isdropdown: true,
        label: 'Relation to the applicant',
        placeholder: 'Select Insured type'
    },
]

const QuickQuote = () => {
  return (
    <View style={styles.quoteContainer}>
      {QuickQuoteData.map((quote,index) => (
        <View>
          <Text style={styles.quoteText}>{quote?.quoteType}</Text>
        </View>
      ))}
    </View>
  )
}

export default QuickQuote

const styles = StyleSheet.create({
  quoteContainer: {
    flex: 1,
    margin: 10
  },
  quoteText: {
    color: '#37424A',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.03,
    fontWeight: 'bold'
  }
})