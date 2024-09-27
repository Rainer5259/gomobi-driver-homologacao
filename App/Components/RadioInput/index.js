import React from "react";
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'

import ContainerInput from "../Views/ContainerInput";
import { BootstrapColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";
import { Text } from "react-native";

const RadioInput = (
  {
    label,
    name,
    value,
    onValueChange,
    editable,
    items,
    visible,
    inputRef
  }) => {

  const handleChange = valueField => {
    onValueChange(name, valueField);
  };


  return (
    <ContainerInput
      label={label}
      visible={visible}
    >
      <RadioGroup
        selectedIndex={items.findIndex(item=> item.option === value)}        
        onSelect={(index, value) => handleChange(value)}
        ref={inputRef}
      >
        {
          items.map(
            item =>
              <RadioButton
                key={item.option}
                value={item.option}
                color={BootstrapColors.primary}
              >
                <Text style={{ fontSize: 12, color: BootstrapColors.darkGrey }}
                >{item.label}</Text>
              </RadioButton>
          )
        }
      </RadioGroup>

    </ContainerInput >
  );


}
export default RadioInput;