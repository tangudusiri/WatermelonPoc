import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import CommonButton from '../../Common/Button';

const { width } = Dimensions.get('window');

const AssupolLogin = () => {
  return (
    <View style={styles.loginContainer}>
      <View style={styles.login}>
        <Image
          source={require('../assets/assupallogo.png')}
          style={styles.loginLogo}
        />
        <CommonButton
          title="SignIn"
          textColor="#FF"
          colors={['#4c669f', '#3b5998', '#192f6a']}
          // onPress={() => {}}
        />
      </View>
    </View>
  );
};

export default AssupolLogin;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    width: width * 0.8,
    alignItems: 'center',
  },
  loginLogo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
  },
});
