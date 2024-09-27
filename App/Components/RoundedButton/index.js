import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import defaultStyle from './styles';
import { BootstrapColors } from '../../Themes/WhiteLabelTheme/WhiteLabel';

function Button({
  id = 'roundedButton',
  text = 'OK',
  accessibilityLabel,
  onPress,
  customStyle,
  disabled = false,
  width = '100%',
  children,
}) {
  let customButtonStyle = customStyle?.button || defaultStyle.button;
  let customTextStyle = customStyle?.text || defaultStyle.text;
  return (
    <TouchableOpacity
      testID={id ? id : 'roundedButton'}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[
        defaultStyle.button,
        customButtonStyle,
        {
          backgroundColor: disabled ? "grey" : (customButtonStyle.backgroundColor || defaultStyle.button.backgroundColor),
          width: width
        }
      ]}
      disabled={disabled}>
      <Text style={customTextStyle}>{text}</Text>
      {children}
    </TouchableOpacity>
  );
}

export default Button;
