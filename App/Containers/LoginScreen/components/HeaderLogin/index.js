import { Dimensions, Image, View } from "react-native";
import images from "../../../../Themes/WhiteLabelTheme/Images"
import { StyleSheet } from "react-native";
import { StatusBar } from "react-native";
import { BootstrapColors, projectColors } from "../../../../Themes/WhiteLabelTheme/WhiteLabel";
import IconButton from "../../../../Components/IconButton";

var { width } = Dimensions.get('window');


const HeaderLogin = ({ style, btnBackListener}) => {
  return (
    <View {...style}>
      <View style={{ paddingTop: 33, paddingHorizontal: 12, position: 'absolute', zIndex: 999}}>
        <IconButton icon='arrow-back' color={projectColors.white} onPress={() => btnBackListener()}
          
        />
      </View>

      <StatusBar backgroundColor={BootstrapColors.primary} barStyle="light-content" />
      <Image source={images.logo} resizeMode='cover' style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({

  image: {
    width: '100%',
    height: '100%',
  }
})

export default HeaderLogin;
