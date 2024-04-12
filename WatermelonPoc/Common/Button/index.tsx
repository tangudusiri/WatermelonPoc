import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";

interface CommonBtnProps {
  title: string;
  colors?: string[];
  textColor: string;
  borderColor?: string;
}

const CommonButton: React.FC<CommonBtnProps> = ({
  title,
  colors,
  textColor,
  borderColor
}) => {
  if (colors && colors.length > 0) {
    return (
      <LinearGradient
        colors={colors}
        style={styles.gradient}
      >
        <TouchableOpacity>
          <Text 
            style={[styles.btnText, { color: textColor }]}
          >{title}</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  } else {
    return (
      <View style={[styles.gradient, { backgroundColor: 'white', borderColor: borderColor || 'transparent', borderWidth: borderColor ? 1 : 0 }]}>
        <TouchableOpacity>
          <Text style={styles.btnText}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default CommonButton;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderRadius: 20
  },
  btnText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 16.4,
  }
});
