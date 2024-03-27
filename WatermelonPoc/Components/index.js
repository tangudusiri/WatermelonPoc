import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'


const MainPage = ({ navigation }) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('LoginPage')}>
        <Text style={styles.btnText}>{'Create User'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Todo')}>
        <Text style={styles.btnText}>{'Create Task'}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MainPage

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'red',
    margin: 20,
    padding: 10,
    borderRadius: 20
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center'
  }
})