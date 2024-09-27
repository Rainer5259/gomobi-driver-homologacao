import moment from 'moment/moment';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ContainerInput from '../../Views/ContainerInput';
import { BootstrapColors } from '../../../Themes/WhiteLabelTheme/WhiteLabel';

const DateInput = (
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
    maximumDate
  }) => {

  const [isFocused, setIsFocused] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    clearError && clearError(name);
  };


  const handleBlur = () => {
    setIsFocused(false);
    setError && setError(name);
  };

  const handleDateChange = selectedDate => {
    const dateFormated = moment(selectedDate).format('L');
    onValueChange(name, dateFormated, selectedDate);
    hideDatePicker();
  };

  const showDatePicker = () => {
    handleFocus();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  return (

    <ContainerInput
      onFocused={isFocused}
      label={label}
      msgError={error?.msgError}
      hasError={error?.msgError}
      visible={visible}
    >
      <TextInput
        style={styles.input}
        value={value}
        onBlur={handleBlur}
        ref={inputRef}
        onFocus={showDatePicker}
        editable={editable}
        onSubmitEditing={onSubmitEditing}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        maximumDate={maximumDate}
        onConfirm={handleDateChange}
        onCancel={hideDatePicker}
      />
    </ContainerInput>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: 8,
    color: BootstrapColors.darkGrey
  },
});

export default DateInput;
