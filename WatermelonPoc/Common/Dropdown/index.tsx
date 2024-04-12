import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectItem,
  Icon,
  SelectDragIndicator
} from '@gluestack-ui/themed';

interface CustomTriggerProps {
  children: React.ReactNode;
};

interface CommonDropdownProps {
  label: string;
  placeholder: string;
  variant: string | undefined;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  options: string[];
  value: string;
  onChangeText: (text: string) => void;
};

const { width } = Dimensions.get('window')

const RNDropdown: React.FC<CommonDropdownProps> = ({
  label,
  placeholder,
  variant,
  isDisabled,
  isInvalid,
  isReadOnly,
  options,
  value,
  onChangeText
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log('toggle.......', isOpen)
  };

  return (
    <View>
      <Select
        style={styles.dropdownContainer}
        selectedValue={value}
        onValueChange={onChangeText}
        isDisabled={isDisabled}
      >
        <View style={label ? styles.labelContainer : null}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <CustomTrigger>
          <SelectInput placeholder={placeholder} style={styles.input} />
          <TouchableOpacity onPress={handleToggle}>
            <Image source={require('../../Components/assets/arrowdown.png')} style={styles.image} />

          </TouchableOpacity>
        </CustomTrigger>
        <SelectPortal>
          <SelectContent >
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {options.map((option, index) => (
              <SelectItem value={option} key={index} label={option} />
            ))}
          </SelectContent>

        </SelectPortal>
      </Select>
    </View>
  )
}

const CustomTrigger: React.FC<CustomTriggerProps> = ({ children }) => {
  return (
    <SelectTrigger variant={'outline'} size="lg">
      {children}
    </SelectTrigger>
  )
};

export default RNDropdown

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#141C22'
  },
  labelContainer: {
    position: 'absolute',
    top: -8,
    left: 12,
    paddingHorizontal: 6,
    zIndex: 2,
    backgroundColor: '#FFFFFF'
  },
  label: {
    color: '#141C22',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center'
  },
  input: {
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0.5,
    color:'#141C22'
  },
  // imagePlaceholder: {
  //   width: width * 0.058,
  //   height: width * 0.058,
  //   backgroundColor: 'transparent',
  // },
  image: {
    width: width * 0.058,
    height: width * 0.058,
    resizeMode: 'contain',
    marginRight: 20
  },
  optionContainer: {

  }
})