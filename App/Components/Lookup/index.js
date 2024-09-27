import React, { useState } from "react";
import { Platform } from "react-native";
import { Picker as NativeBasePicker } from '@react-native-picker/picker';
import { BootstrapColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

import styles from './styles';
import ContainerInput from "../Views/ContainerInput";

export default function Lookup({
  label,
  name,
  error = { msgError: "" },
  setError = () => { },
  clearError = () => { },
  value,
  onValueChange = () => { },
  editable,
  items,
  holdData = false,
  visible,
  inputRef,
  nextField,
  onSubmitEditing = () => { }
}) {
  const [focusPickerSeletect, setFocusPickerSeletect] = useState(false);

  function onFocus() {
    setFocusPickerSeletect(true);
    clearError(name);
  }

  function onBlur() {
    setFocusPickerSeletect(false);
    setError(name);
  }

  const handleChange = valueField => {
    const details = holdData && valueField ? items.find(item => item?.value == valueField) : {};
    onValueChange(name, valueField, details);
    onSubmitEditing(nextField);
  };

  const renderItem = (e, i) => {
    return <NativeBasePicker.Item
      style={styles.item}
      label={e.label}
      value={e.value}
      key={i} />;
  }

  return (
    <ContainerInput
      onFocused={focusPickerSeletect}
      label={label}
      msgError={error?.msgError}
      hasError={!!error?.msgError}
      visible={visible}
    >

      {Platform.OS === 'ios' ? (
        <NativeBasePicker
          selectedValue={value}
          style={styles.picker}
          textStyle={styles.textPicker}
          iosHeader={hasError}
          mode='dialog'
          dropdownIconColor={BootstrapColors.darkGrey}
          onValueChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={editable}
          ref={inputRef}
        >
          {items.map(renderItem)}
        </NativeBasePicker>
      ) : (
        <NativeBasePicker
          selectedValue={value}
          style={styles.picker}
          itemStyle={styles.itemPicker}
          mode='dialog'
          dropdownIconColor={BootstrapColors.darkGrey}
          onValueChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={editable}
          ref={inputRef}
        >
          {items.map(renderItem)}
        </NativeBasePicker>
      )}

    </ContainerInput>
  );


}
