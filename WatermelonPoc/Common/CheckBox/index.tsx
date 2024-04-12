import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
  CheckIcon,
} from '@gluestack-ui/themed';

const { width } = Dimensions.get('window')


const CheckBox = ({ label, onChange }: { label: string; onChange?: (checked: boolean) => void }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onChange && onChange(!isChecked);
  };

  return (

    <Checkbox
      value={isChecked.toString()}
      isChecked={isChecked}
      aria-label='label'
      style={styles.checkBox}
      onPress={handleToggle}>
      <CheckboxIndicator style={styles.indicator}>
        <CheckboxIcon as={CheckIcon} />
      </CheckboxIndicator>
      <CheckboxLabel style={styles.labelStyle}>{label}</CheckboxLabel>
    </Checkbox>
  )
}

export default CheckBox

const styles = StyleSheet.create({
  checkBox: {
    margin: 10
  },
  indicator: {
    width: width * 0.06,
    height: width * 0.06,
    borderColor: '#37424A'
  },
  labelStyle: {
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.03,
    fontWeight: '500',
    marginLeft: 10
  }
})