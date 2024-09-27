import {  PixelRatio, Dimensions } from 'react-native'

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scaleWidth = SCREEN_WIDTH / 320;

/**
 * 
 * @param {Number} size Tamanho referente ao padrão do layout que está sendo construido 
 */
const normalize = (size) => {
    const newSize = size * scaleWidth

    if (Platform.OS === 'IOS')
    {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }
}

export default {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    scaleWidth,
    normalize
  }