import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import HR from '../HR';

const { width } = Dimensions.get('window');

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);

  const handleCrossClick = () => {
    setShowHeader(false);
  };

  if (!showHeader) {
    return null;
  }

  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Image source={require('../assets/menu.png')} style={styles.headerLeftIcon} />
        </TouchableOpacity>
        <Image source={require('../assets/assupolLogo.png')} style={styles.headerLogo} />
        <View style={styles.headerRight}>
          <View style={styles.profileContainer}>
            <Text style={styles.profile}>{'SA'}</Text>
          </View>
          <TouchableOpacity onPress={handleCrossClick}>
            <Image source={require('../assets/cross.png')} style={[styles.headerLeftIcon, { marginLeft: 10 }]} />
          </TouchableOpacity>
        </View>
      </View>
      <HR />
    </View>
  );
};


export default Header

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  headerLeftIcon: {
    width: width * 0.05,
    height: width * 0.05,
    resizeMode: 'contain'
  },
  headerLogo: {
    width: width * 0.35,
    height: width * 0.11,
    resizeMode: 'contain'
  },
  profileContainer: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: (width * 0.09) / 2,
    backgroundColor: '#8EC6A5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profile: {
    textAlign: 'center',
    color: '#FFFFFF'
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
})