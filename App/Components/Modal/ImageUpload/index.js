// Modules
import React, {useCallback, useImperativeHandle, useState} from 'react';
import * as ImagePicker from 'react-native-image-picker';
import {Platform} from 'react-native';

// Actions
import {permissionsAction} from '../../../Actions/permissions.action';

//Locales
import {strings} from '../../../Locales/i18n';

// Themes
import {PrimaryButton} from '../../../Themes/WhiteLabelTheme/WhiteLabel';

// Services
import {handlerException} from '../../../Services/Exception'

// Util
import * as constants from '../../../Util/Constants';

// Modules
import {
	RNStatusBar,
	ContainerModal,
	Container,
  CloseRanger,
	ContainerInner,
	Title,
	Text,
	Buttom,
	Icon,
} from './styles';

const ImageUpload = React.forwardRef((
  {
    title,
    getImage,
    showModal,
    setShowModal,
    onFinished
  }, ref) => {
    const [options] = useState({
      title: strings('profileProvider.selectPhoto'),
      takePhotoButtonTitle: strings('profileProvider.takePhoto'),
      chooseFromLibraryButtonTitle: strings(
        'profileProvider.fromGallery'
      ),
      cancelButtonTitle: strings('general.cancel'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
	  maxWidth: 1800,
	  maxHeight: 1200,
      quality: 1,
      currentItem: '',
    });

		const HandleCloseModal = useCallback(() => {
			if (setShowModal) setShowModal(false);
		}, [setShowModal]);

		const LaunchImageLibrary = useCallback(() => {
      try {
        let permissionGranted = true;

        if (Platform.OS == constants.ANDROID) {
          permissionsAction
            .requestCameraPermission()
            .then((response) => {
              permissionGranted = response;

              if (permissionGranted) {
                ImagePicker.launchImageLibrary(
                  options,
                  (response) => {
                    if (response.didCancel) {
                    } else if (response.error) {
                    } else if (response.customButton) {
                    } else {
                      const asset = response.assets[0];
                      if (asset.type == null) {
                        asset.type = `image/${asset.path.substring(
                          asset.path.indexOf('.') + 1
                        )}`;
                      }
                      getImage({
                        picture: {
                          uri: asset.uri,
                          type: asset.type,
                          name: asset.fileName,
                        },
                      });
                      if(onFinished) { onFinished() }
                    }
                  }
                );
              }
            });
        } else {
          ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
              const asset = response.assets[0];
              if (asset.type == null) {
                asset.type = `image/${asset.uri.substring(
                  asset.uri.indexOf('.') + 1
                )}`;
              }

              getImage({
                picture: {
                  uri: asset.uri,
                  type: asset.type,
                  name: asset.fileName,
                },
              });
              if(onFinished) { onFinished() }
            }
          });
        }
      } catch (error) {
        handlerException('Modal.ImageUpload.LaunchImageLibrary', error)
      }
		}, [getImage, options]);

		const LaunchCamera = useCallback(() => {

      try {
        let permissionGranted = true;
        if (Platform.OS == constants.ANDROID) {
          permissionsAction
            .requestCameraPermission()
            .then((response) => {
              permissionGranted = response;

              if (permissionGranted) {
                ImagePicker.launchCamera(options, (response) => {
                  if (response) {
                    if (response.didCancel) {
                    } else if (response.error) {
                    } else if (response.customButton) {
                    } else {
                      const asset = response.assets[0];
                      getImage({
                        picture: {
                          uri: asset.uri,
                          type: asset.type,
                          name: asset.fileName,
                        },
                      });
                      if(onFinished) { onFinished() }
                    }
                  }
                });
              }
            });
        } else {
          ImagePicker.launchCamera(options, (response) => {
            if(response.errorCode == 'camera_unavailable'){
              LaunchImageLibrary();
              return;
            }
            if (response) {
              if (!response.didCancel && response.assets[0].uri) {
                const asset = response?.assets[0];
                asset.type = `image/${asset.uri.substring(
                  asset.uri.indexOf('.') + 1
                )}`;
                getImage({
                  picture: {
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName,
                  },
                });
                if(onFinished) { onFinished() }
              }
            }
          });
        }
      } catch (error) {
        handlerException('Modal.ImageUpload.LaunchCamera', error)
      }

		}, [getImage, options]);

		useImperativeHandle(ref, () => ({
			launchCamera: LaunchCamera,
			launchImageLibrary: LaunchImageLibrary,
		}));

		return (
			<ContainerModal
				animationType="fade"
				transparent
				visible={showModal}
				onRequestClose={HandleCloseModal}
				useNativeDriver>
				<RNStatusBar backgroundColor="#00000080" />
				<Container>
          <CloseRanger onPress={HandleCloseModal}></CloseRanger>
					<ContainerInner>
						<Title>{title}</Title>
						<Buttom onPress={() => LaunchCamera()}>
							<Icon
								name="camera"
								size={30}
								color={PrimaryButton}
							/>
							<Text>{strings('register.camera')}</Text>
						</Buttom>

						<Buttom onPress={() => LaunchImageLibrary()}>
							<Icon
								name="photo"
								size={30}
								color={PrimaryButton}
							/>
							<Text>{strings('register.gallery')}</Text>
						</Buttom>
					</ContainerInner>
				</Container>
			</ContainerModal>
		);
	}
);

export default ImageUpload;
