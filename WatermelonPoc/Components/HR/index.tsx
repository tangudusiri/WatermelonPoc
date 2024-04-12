import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HR = () => {
  return (
    <View style={styles.hr}>

    </View>
  )
}

export default HR

const styles = StyleSheet.create({
  hr: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#3F464D',
    marginVertical: 10
  }
})