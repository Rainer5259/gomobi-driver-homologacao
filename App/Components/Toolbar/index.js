// Modules
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Icon as TypedIcon, Text } from 'react-native-elements';

// Themes
import images from '../../Themes/WhiteLabelTheme/Images'
import { projectColors, PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel"

// Styles
import { styles } from './styles'
import IconButton from '../IconButton';

export default function Toolbar({
  handlePress,
  nextPress,
  filterPress,
  helpPress,
  back = false,
  isMain = false,
  nextStep = false,
  isFilter = false,
  isHelp = false,
  leftIcons = [],
  rightIcons = [],
  title,
  subtitle,
  img
}) {
  const iconsOnLeft = leftIcons;
  if (back) {
    iconsOnLeft.push({ icon: 'arrow-back', color: projectColors.black, onPress: handlePress });
  }

  const iconsOnRight = [];
  if (isFilter) {
    iconsOnRight.push({ icon: 'funnel', color: PrimaryButton, onPress: helpPress });
  }
  if (isHelp) {
    iconsOnRight.push({ icon: 'information-circle', color: PrimaryButton, onPress: filterPress });
  }
  if (nextStep) {
    iconsOnRight.push({ icon: 'arrow-forward', color: projectColors.black, onPress: nextPress });
  }
  iconsOnRight.push(...rightIcons);

  const renderIcons = ({ icons }) => {
    if (icons && icons.length > 0) {
      return (
        <View style={styles.iconView}>
          {icons.map((item, index) => item &&
            <IconButton
              key={index}
              icon={item.icon}
              size={item.size || 35}
              color={item.color || PrimaryButton}
              hint={item.hint}
              onPress={item.onPress}
              style={styles.iconButton}
            />
          )}
        </View>
      );
    }
  }

  return (
    <>
      {!isMain ?
        <View style={styles.pageToolbarView}>
          {renderIcons({ icons: iconsOnLeft })}
          {
            !!title &&
            <Text text={title} style={styles.toolbarTitle} alignItems="flex-start" >{title}</Text>
          }
          {renderIcons({ icons: iconsOnRight })}
        </View>
        :
        <>
          <Image source={images.overlay} style={styles.mainToolbarView} />

          {back ?
            // Quando está na tela principal e apresenta o botão Voltar
            <IconButton
              icon={arrow - back}
              size={35}
              color={projectColors.black}
              onPress={handlePress}
              style={styles.iconPress} />
            :
            // Quando está na tela principal e possui (ou não) foto de perfil
            <TouchableOpacity style={styles.areaImage} onPress={handlePress}>
              {img
                ? <Image source={{ uri: img }} style={styles.img} />
                : <TypedIcon type="ionicon" name="menu" size={35} color={PrimaryButton} />}
            </TouchableOpacity>
          }
        </>
      }
    </>
  )
}
