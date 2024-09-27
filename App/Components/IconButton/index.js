import React from 'react';
import { TouchableOpacity } from 'react-native';
import { BootstrapColors } from '../../Themes/WhiteLabelTheme/WhiteLabel';
import Icon from 'react-native-vector-icons/Ionicons';

export default function IconButton({ icon, size = 35, onPress, hint = '', color }) {
  return (
    <TouchableOpacity accessibilityHint={hint} onPress={onPress} style={{ minWidth: 50, alignItems: 'center' }}>
      <Icon name={icon} size={size} color={color || BootstrapColors.primary} />
    </TouchableOpacity>
  );
}
