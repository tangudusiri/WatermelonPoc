import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Stepper from './Stepper'
import Header from './Header'

const Steps = [
  {
    title: 'Introduction',
  },
  {
    title: 'Client Search',
  },
  {
    title: 'ID & Verification',
  },
  {
    title: 'Client Needs',
  },
  {
    title: 'Done',
  },
]


const MainPage = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(3)
  return (
    <View style={{flex: 1}}>
    <Stepper steps = {Steps} activeStep={activeIndex}/>
    <Header/>
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
  }
})