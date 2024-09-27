import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { PhoneInput, getCountriesByCallingCode, getCountryByCca2 } from 'react-native-international-phone-number';

import ContainerInput from '../../Views/ContainerInput';
import { strings } from '../../../Locales/i18n';
import { BootstrapColors } from '../../../Themes/WhiteLabelTheme/WhiteLabel';


const PhoneNumberInput = (
  {
    label,
    name,
    error,
    setError,
    clearError,
    value,
    onValueChange,
    editable,
    visible,
    inputRef,
    onSubmitEditing,
    setDDD,
    ddd
  }
) => {

  const [isFocused, setIsFocused] = useState(false);
  const cca = getCountriesByCallingCode(ddd)[0];
  const [selectedCountry, setSelectedCountry] = useState(ddd || getCountryByCca2(cca ? cca.cca2 : 'BR'));

  const handleFocus = () => {
    setIsFocused(true);
    clearError(name);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setError(name);
  };

  const handleChange = valueField => {
    valueField && onValueChange(name, valueField)
  };


  function handleSelectedCountry(country) {
    setSelectedCountry(country);
    country && setDDD(country.callingCode);
  }

  return (
    <ContainerInput
      onFocused={isFocused}
      label={label}
      msgError={error.msgError}
      hasError={error.msgError}
      visible={visible}
    >
      <PhoneInput
        onSubmitEditing={onSubmitEditing}
        containerStyle={styles.input}
        flagContainerStyle={styles.input}
        inputStyle={styles.input}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={handleSelectedCountry}
        placeholder={strings('register.empty_phone')}
        value={value}
        onChangePhoneNumber={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={editable}
        defaultValue={`${ddd || '+55'} ${value}`}
      />

    </ContainerInput>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#ffffff00',
    fontSize: 14,
    color: BootstrapColors.darkGrey
  }
});

export default PhoneNumberInput;
