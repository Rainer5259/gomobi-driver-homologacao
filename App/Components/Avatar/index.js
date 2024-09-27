import { StyleSheet, ImageBackground, TouchableOpacity, View } from "react-native";
import { PrimaryButton, projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel"
import { Icon } from "react-native-elements";

import ImageUpload from "../../Components/Modal/ImageUpload";
import { strings } from "../../Locales/i18n";

const Avatar = (
  {
    refImage,
    modalVisible,
    photoBothEnable,
    setImageState,
    changePhoto,
    avatarSource
  }
) => {
  return (
    <>
      <ImageUpload
        ref={refImage}
        showModal={modalVisible}
        setShowModal={photoBothEnable}
        getImage={setImageState}
        title={strings('register.photoUpload')}
      ></ImageUpload>

      <TouchableOpacity
        style={styles.contImage}
        onPress={changePhoto}
      >
        <ImageBackground
          borderRadius={80}
          style={styles.image}
          source={avatarSource}
        >
          <View style={styles.imgBackCont}>
            <View style={styles.contIconCamera}>
              <Icon
                type="font-awesome"
                name="camera"
                size={15}
                color={PrimaryButton}
              />
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  imgBackCont: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 80,
    width: '100%',
    alignSelf: 'center'
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 80
  },
  contImage: {
    marginTop: 10,
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 80,
    backgroundColor: projectColors.white,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  contIconCamera: {
    backgroundColor: projectColors.secondaryWhite,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    height: 25,
    width: 25,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end'
  },

});

export default Avatar;