import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import ContainerInput from '../../Views/ContainerInput';
import { TextInputMask } from 'react-native-masked-text';
import { TextInput } from 'react-native';

const TextInputField = (
  {
    type,
    label,
    name,
    mask,
    error,
    setError = () => {},
    clearError = () => {},
    value,
    onValueChange = () => {},
    editable,
    visible,
    inputRef,
    onSubmitEditing = () => {},
    secureTextEntry,
    rawValue = false,
    options = {}
  }) => {

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    clearError(name);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setError(name);
  };

  const handleChange = valueField => {
    onValueChange(name, valueField);
  };

  return (

    <ContainerInput
      onFocused={isFocused}
      label={label}
      msgError={error?.msgError}
      hasError={!!error?.msgError}
      visible={visible}
    >
      {(type || mask) ?
        <TextInputMask
          onSubmitEditing={onSubmitEditing}
          refInput={inputRef}
          type={type || 'custom'}
          options={{ mask, ...options }}
          includeRawValueInChangeText={rawValue}
          value={value}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
        />
        : <TextInput
          ref={inputRef}
          onSubmitEditing={onSubmitEditing}
          value={value}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          secureTextEntry={secureTextEntry}
        />
      }
    </ContainerInput>
  );
};

const styles = StyleSheet.create({
  input: {
  },
});

export default TextInputField;
