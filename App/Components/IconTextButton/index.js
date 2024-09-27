import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { BootstrapColors } from '../../Themes/WhiteLabelTheme/WhiteLabel';

export default function IconTextButton({
  id,
  icon,
  text,
  onPress,
  size = 30,
  accessibilityLabel,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      testID={id || 'iconTextButton'}
      accessibilityLabel={accessibilityLabel}
      style={styles.iconButton}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconButtonImgContainer}>
        <View style={styles.iconButtonImg}>
          <Icon name={icon} size={size} color={BootstrapColors.white} />
        </View>
        {text &&
          <Text style={styles.iconButtonText}>{text}</Text>}
      </View>
    </TouchableOpacity>
  );
};
