import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {
  Input,
  InputField,
  Text
} from '@gluestack-ui/themed';

interface CommonTextInputProps {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  variant: string | undefined;
  size: string,
  onChangeText: (text: string) => void;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  isTextArea?: boolean;
};

const CommonTextInput: React.FC<CommonTextInputProps> = ({
  label,
  placeholder,
  type,
  value,
  variant,
  size,
  onChangeText,
  isDisabled,
  isInvalid,
  isReadOnly,
  isTextArea
}) => {
  console.log('textare.....', isTextArea)
  return (
    <View style={styles.container}>
      <View style={label ? styles.labelContainer : null}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Input
        variant={variant as 'rounded' | 'underlined' | 'outline'}
        style={[styles.input]}
        size={size as 'xl' | 'md' | 'lg'}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        isReadOnly={isReadOnly}
      >
        <InputField
          type={type as 'text' | 'password'}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline={isTextArea}
        />
      </Input>
    </View>
  );
};

export default CommonTextInput;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // backgroundColor: '#FFFFFF',
  },
  labelContainer: {
    position: 'absolute',
    top: 2,
    left: 22,
    paddingHorizontal: 5,
    zIndex: 2,
    backgroundColor: '#FFFFFF'
  },
  input: {
    margin: 10,
    borderColor: '#141C22',
    // borderWidth: 1,
    // borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0.5,
    color: '#141C22'
  },
  label: {
    color: '#141C22',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center'
  },
});
