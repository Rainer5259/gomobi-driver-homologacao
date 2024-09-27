// Modules
import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Platform,
	ActivityIndicator,
	Image,
	Alert,
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import * as ImagePicker from 'react-native-image-picker';
import RNHeicConverter from 'react-native-heic-converter';
import DatePicker from '@react-native-community/datetimepicker';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';

import ProviderApiFormData from '../../Services/Api/ProviderApiFormData';

// Actions
import {permissionsAction} from '../../Actions/permissions.action';
import { handlerException } from '../../Services/Exception';

// Locales
import {strings} from '../../Locales/i18n';

// Store
import {getDocs} from '../../Store/actions/actionProvider';

// Themes
import {projectColors} from '../../Themes/WhiteLabelTheme/WhiteLabel';

// Modal
import ImageUpload from '../Modal/ImageUpload';

// Utils
import * as parse from '../../Util/Parse';
import * as constants from '../../Util/Constants';

//Styles
import styles from './styles';

var options = {
	title: strings('profileProvider.selectPhoto'),
	takePhotoButtonTitle: strings('profileProvider.takePhoto'),
	chooseFromLibraryButtonTitle: strings('profileProvider.fromGallery'),
	cancelButtonTitle: strings('general.cancel'),
	storageOptions: {
		skipBackup: true,
		path: 'images',
		privateDirectory: true,
	},
	maxWidth: 1800,
	maxHeight: 1200,
	quality: 1,
	currentItem: '',
};

class ListEditDocument extends Component {
	constructor(props) {
		super(props);
    this._imageUpload = React.createRef();

		(this.state = {
      sent: this.props.sent,
			docId: null,
			has_validity: null,
			isLoading: false,
			picture: '',
			validate: this.props.validity ? this.formatDate(this.props.validity) : moment().toDate(),
			validateFormatted: this.props.validity ? this.props.validity : '',
			uploaded: false,
			minInitial: moment('1970-01-01').toDate(),
			photo: this.props.document_url,
			modalVisible: false,
			showDatePicker: false,
		}),
		(this.api = new ProviderApiFormData());
	}

	notifyEditDoc(docId, has_validity) {
		Alert.alert(
			`${strings('profileProvider.warning')}`,
			`${strings('profileProvider.reEvaluationDoc')}`,
			[
				{
					text: `${strings('general.cancel')}`,
					onPress: () => {},
					style: 'cancel',
				},
				{
					text: `${strings('general.confirm')}`,
					onPress: () =>
						this.uploadDocumentPhoto(docId, has_validity),
				},
			],
			{cancelable: false}
		);
	}

	uploadDocumentPhoto(docId, has_validity) {
		let permissionGranted = true;
		if (Platform.OS == constants.ANDROID) {
			permissionsAction.requestReadExternalStorage().then((response) => {
				permissionGranted = response;
				if (permissionGranted) {
					ImagePicker.launchCamera(options, (res) => {
						let response = res.assets[0];

						if (!response.customButton) {
							this.setState({
								picture: {
									uri: response.uri,
									type: response.type,
									name: response.fileName,
								},
								photo: response.uri,
							});
							this.registerDocProvider(docId, has_validity);
						}
					});
				}
			});
		} else {
			ImagePicker.launchCamera(options, (res) => {
				let response = res.assets[0];

				if (!response.customButton) {
					const {error, uri, origURL} = response;
					if (origURL && origURL.endsWith('HEIC')) {
						RNHeicConverter.convert({
							path: origURL,
							extension: 'jpg',
						}).then((result) => {
							this.setState({
								picture: {
									uri: result.path,
									type: 'image/jpg',
									name: new Date().getTime() + '.jpg',
									photo: result.path,
								},
							});
						});
						return;
					}
					else {
						if (response.type == null) {
							response.type =
								'image/' +
								response.path.substring(
									response.path.indexOf('.') + 1
								);
						}
						let imgName = response.fileName;
						if (imgName == undefined) {
							var getFilename = response.uri.split('/');
							imgName = getFilename[getFilename.length - 1];
						}
						this.setState({
							picture: {
								uri: response.uri,
								type: response.type,
								name: imgName,
								photo: response.uri,
							},
						});
					}

					this.registerDocProvider(docId, has_validity);
				}
			});
		}
	}

	async registerDocProvider(docId, has_validity) {
		let validity = new Date();
		let formattedValidity = moment(this.state.validate).format('DD/MM/YYYY');

		if (has_validity == 0) {
			formattedValidity = moment(validity).format('DD/MM/YYYY');
		}

		let arrayAux = this.props.docs;

		if (formattedValidity) {
			try {
				this.setState({isLoading: true});
				const {data} = await this.api.RegisterDocsProvider(
					this.props.provider._id,
					docId,
					this.state.picture,
					formattedValidity
				);

        this.setState({sent: data.success})
				if (data.success) {
					parse.showToast(
						'Documento alterado com sucesso',
						Toast.durations.LONG
					);
					for (let i = 0; i < arrayAux.length; i++) {
						if (arrayAux[i].id == docId) {
							arrayAux[i].sent = true;
							arrayAux[i].validity = formattedValidity;
							arrayAux[i].uploaded = true;
						}
					}

					this.props.getDocs(arrayAux);
					this.setState({uploaded: true, isLoading: false});
				} else {
					if (data.error) {
						parse.showToast(data.error, Toast.durations.LONG);
					} else if (data.erro_messages) {
						parse.showToast(
							data.erro_messages[0],
							Toast.durations.LONG
						);
					}
					this.setState({isLoading: false});
				}
			} catch (error) {
				parse.showToast(strings("error.try_again"), Toast.durations.LONG)
				this.setState({isLoading: false});
				handlerException('ListDocument.registerDocProvider', error);
			}
		}
	}

	/**
	 * Check if picture already uploaded locally
	 * @param {any} date
	 * @param {any} docId
	 */
	changeDateCheckPicture( date, item) {
		let validity = moment(date);

		if (!this.state.picture) {
			this.formatImgObject(item.document_url);
		}

		this.setState({
			validate: validity.toDate(),
			validateFormatted: validity.format('DD/MM/YYYY'),
			showDatePicker: Platform.OS == 'ios',
		}, () => {
			this.registerDocProvider(item.id, item.has_validity);
		});
	}

	/**
	 * function for standardization and date formatting
	 * @param {string} date
	 * @return {date} date
	 */
  formatDate(date) {
    if(typeof date === 'string' && date){
      const [DD, MM, YYYY] = date.split('/')
      return moment(`${YYYY}-${MM}-${DD}`).toDate()
    }
    return moment().toDate()
  };

	formatImgObject(docImgUrl) {
		if (docImgUrl) {
			let nameImg = docImgUrl.substring(
				docImgUrl.lastIndexOf('/') + 1,
				docImgUrl.length
			);
			let extension = docImgUrl.slice(-3);
			this.setState({
				picture: {
					uri: docImgUrl,
					type: 'image/' + extension,
					name: nameImg,
				},
			});
		}
	}

  /**
   * Validate open mode according of settings user_picture
   */
  changePhoto(docId, has_validity) {
    this.setState({docId, has_validity})
    if (this.props.settings.provider_picture == 'camera') {
      this._imageUpload.current.launchCamera()
    } else if (this.props.settings.provider_picture == 'gallery') {
      this._imageUpload.current.launchImageLibrary()
    } else {
        this.photoBothEnable(true);
    }
  }

  setImageState(image) {
    this.setState({
      avatarSource: {uri: image.picture.uri},
      picture: image.picture,
      modalVisible: false,
    });

    this.registerDocProvider(this.state.docId, this.state.has_validity);
  }

	photoBothEnable(visible) {
		this.setState({modalVisible: visible});
	}

	render() {
		const item = this.props;
		let textColor = this.state.sent ? projectColors.green : projectColors.gray;
		let textWeight = this.state.sent ? 'bold' : 'normal';
		let borderColor = this.state.sent ? projectColors.green : projectColors.gray;
		let backgroundColorIcon = this.state.sent
			? projectColors.green
			: projectColors.white;
		let uploadIcon = this.state.sent ? 'check' : 'add';
		let iconColor = this.state.sent ? projectColors.white : projectColors.gray;

		return (
			<View style={styles.container}>
				{this.state.photo ? (
					<View style={{alignItems: 'center'}}>
						<Image
							source={{uri: this.state.photo}}
							style={{width: 100, height: 100}}
						/>
					</View>
				) : null}

				<TouchableOpacity
					style={[styles.uploadButton, {borderColor: borderColor}]}
					onPress={() =>
						this.changePhoto(item.id, item.has_validity)
					}>
					<Text
						style={[
							styles.uploadText,
							{color: textColor, fontWeight: textWeight},
						]}>
						{item.name}
					</Text>
					<View
						style={[
							styles.containerIconUpload,
							{backgroundColor: backgroundColorIcon},
						]}>
						{this.state.isLoading ? (
							<ActivityIndicator color={iconColor} size="small" />
						) : (
							<Icon
								name={uploadIcon}
								color={iconColor}
								size={27}
							/>
						)}
					</View>
				</TouchableOpacity>
				{item.has_validity == 1 ? (
					<View style={styles.contDate}>
						{!item.has_validity ? (
							<Text style={styles.txtValidate}>
								{strings('register.informValidate')}
							</Text>
						) : null}

            <TouchableOpacity
              style={[styles.uploadButton, {borderColor: borderColor}]}
              onPress={() =>
                this.setState({showDatePicker: true})
              }
            >
              <Text
                style={[
                  styles.uploadText,
                  {color: textColor, fontWeight: textWeight},
                ]}>
								{strings('register.expirationDate')+":"}
              </Text>
              <Text
                style={[
                  styles.uploadText,
                  {color: textColor, fontWeight: textWeight, flex:1},
                ]}>
								{(this.state.validateFormatted)}
              </Text>
            </TouchableOpacity>
						{this.state.showDatePicker && <DatePicker
							value={this.state.validate}
							format="DD/MM/YYYY"
							minimumDate={this.state.minInitial}
							display="spinner"
              positiveButton={{label: 'OK', textColor: projectColors.black}}
              negativeButton={{label: 'Cancel', textColor: textColor}}
							onChange={(_, date) =>
								this.changeDateCheckPicture(date, item)
							}
						/>}
					</View>
				) : null}


        <ImageUpload
          ref={this._imageUpload}
          showModal={this.state.modalVisible}
          setShowModal={(value) => this.photoBothEnable(value)}
          getImage={(value) => this.setImageState(value)}
          title={strings('register_step5.choose_document_photo_upload_option')}
        ></ImageUpload>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	provider: state.providerProfile.providerProfile,
	docs: state.providerReducer.docs,
	settings: state.settingsReducer.settings,
});

const mapDispatchToProps = (dispatch) => ({
	getDocs: (values) => dispatch(getDocs(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListEditDocument);
