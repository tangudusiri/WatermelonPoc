import { 
  Dimensions,
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('window')

const AssupolLogin = () => {
  return (
    <View style={styles.loginContainer}>
      <View style={styles.login}>
      <Image
      source={require('../assets/assupallogo.png')}
      style={styles.loginLogo}
      />
      <TouchableOpacity>
        <Text>{'Signin'}</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default AssupolLogin

const styles = StyleSheet.create({
  loginContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login : {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    width:  width * 0.8,
    margin: 20,
    alignItems: 'center',
    
  },
  loginLogo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
  },
})