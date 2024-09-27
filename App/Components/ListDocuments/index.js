// Modules
import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Platform,
	ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import I18n from 'react-native-i18n';
import Toast from 'react-native-root-toast';
import * as ImagePicker from 'react-native-image-picker';
import RNHeicConverter from 'react-native-heic-converter';
import DatePicker from '@react-native-community/datetimepicker';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';

// Locales
import {strings} from '../../Locales/i18n';

// Modal
import ImageUpload from '../Modal/ImageUpload';

// Permissions
import {permissionsAction} from '../../Actions/permissions.action';

// Services
import ProviderApiFormData from '../../Services/Api/ProviderApiFormData';

// Store
import {getDocs, saveAddDocs} from '../../Store/actions/actionRegister';
import {providerAction} from '../../Store/actions/providerProfile';

// Themes
import {projectColors} from '../../Themes/WhiteLabelTheme/WhiteLabel';

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


class ListDocuments extends Component {
	constructor(props) {
		super(props);
    this._imageUpload = React.createRef();

		const currentLocale = I18n.currentLocale();
		let today = new Date();
		let dateToday = null;
		let dateInitialEver = null;
		let month = (today.getMonth() + 1).toString();
		if (parseInt(month) < 10) {
			month = '0' + month.toString();
		}
		let day = today.getDate().toString();
		if (parseInt(day) < 10) {
			day = '0' + day;
		}
		if (currentLocale.indexOf('pt') === 0) {
			dateToday =
				today.getDate() + '/' + month + '/' + today.getFullYear();
			dateInitialEver = moment('01-01-1970').toDate();
		} else {
			dateToday =
				today.getFullYear() + '/' + month + '/' + today.getDate();
			dateInitialEver = moment('1970-01-01').toDate();
		}

		(this.state = {
			docId: null,
			has_validity: null,
			isLoading: false,
			picture: '',
			validate: this.props.date_validity ? this.formatDate(this.props.date_validity) : moment().toDate(),
			validateFormatted: this.props.date_validity ? this.props.date_validity : '',
			uploaded: this.props.uploaded ? this.props.uploaded : false,
			minInitial: dateInitialEver,
			modalVisible: false,
			minInitial: moment('1970-01-01').toDate(),
			showDatePicker: false,
		}),
			(this.api = new ProviderApiFormData());
	}

	uploadDocumentPhoto(docId, has_validity) {
		let permissionGranted = true;
		if (Platform.OS == constants.ANDROID) {
			permissionsAction.requestReadExternalStorage().then((response) => {
				permissionGranted = response;
				if (permissionGranted) {
					ImagePicker.launchCamera(options, (res) => {
						if (res && res.assets && res.assets[0]) {
							let response = res.assets[0];

							if (!response.customButton) {
								this.setState({
									picture: {
										uri: response.uri,
										type: response.type,
										name: response.fileName,
									},
								});
								this.registerDocProvider(docId, has_validity);
							}
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
								},
							});
							this.registerDocProvider(docId, has_validity);
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

						this.setState({
							picture: {
								uri: response.uri,
								type: response.type,
								name: new Date().getTime() + '.jpg',
							},
						});
						this.registerDocProvider(docId, has_validity);
					}
				}
			});
		}
	}

	registerDocProvider(docId, has_validity) {
		this.setState({isLoading: false});
		let formmatedValidity;
		if (this.state.validateFormatted) {
			formmatedValidity = this.state.validateFormatted;
		} else {
			formmatedValidity = moment().format('DD/MM/YYYY');
		}
		let arrayAux = this.props.docs;
		if (formmatedValidity) {
			this.setState({isLoading: true});
			this.api
				.RegisterDocsProvider(
					this.props.addProviderId,
					docId,
					this.state.picture,
					formmatedValidity
				)
				.then((response) => {
					let responseJson = response.data;

					this.props.onProviderAction({
						_id: responseJson.provider.id,
						_token: responseJson.provider.token,
					});
					this.setState({isLoading: false});
					if (responseJson.success) {
						parse.showToast(
							strings('register.sucessRegisterDocument'),
							Toast.durations.SHORT
						);
						for (let i = 0; i < arrayAux.length; i++) {
							if (arrayAux[i].id == docId) {
								arrayAux[i].sent = true;
								arrayAux[i].uploaded = true;
							}
						}
						this.props.getDocs(arrayAux);
						this.setState({uploaded: true});
						this.checkAllDocSave();
					} else {
						parse.showToast(
							responseJson.error_messages[0],
							Toast.durations.LONG
						);
					}
				})
				.catch((error) => {
					this.setState({isLoading: false});
					parse.showToast(
						strings('error.try_again'),
						Toast.durations.LONG
					);
					console.error(
						'Erro ao tentar cadastrar o documento: ',
						error
					);
				});
		} else {
			this.setState({uploaded: true});
		}
	}

	/**
	 * Check if all docs are uploaded for exibe Next button
	 */
	checkAllDocSave() {
		let arrayDocs = this.props.docs;
		let allUploaded = true;
		for (let i = 0; i < arrayDocs.length; i++) {
			if (arrayDocs[i].uploaded === false && arrayDocs[i].required == 1) {
				allUploaded = false;
				break;
			}
		}

		if (allUploaded) {
			this.props.saveAddDocs(true);
		} else {
			this.props.saveAddDocs(false);
		}
	}

	/**
	 * Check if picture already uploaded locally
	 * @param {any} date
	 * @param {any} docId
	 */
	changeDateCheckPicture(date, docId, has_validity) {
		let Validity = moment(date);
		this.setState({
      validate: Validity.toDate(),
      validateFormatted: Validity.format('DD/MM/YYYY'),
      showDatePicker: Platform.OS == 'ios',
      }, () => {
			if (this.state.uploaded) {
				this.registerDocProvider(docId, has_validity);
			}
		});
	}

	/**
	 * function for standardization and date formatting
	 * @param {string} date
	 * @return {date} date
	 */
  formatDate(date) {
    if(date){
      const [DD, MM, YYYY] = date.split('/')
      return moment(`${YYYY}-${MM}-${DD}`).toDate()
    }
    return moment().toDate()
  };

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
		let textColor = this.state.uploaded
			? projectColors.green
			: projectColors.gray;
		let textWeight = this.state.uploaded ? 'bold' : 'normal';
		let borderColor = this.state.uploaded
			? projectColors.green
			: projectColors.gray;
		let backgroundColorIcon = this.state.uploaded
			? projectColors.green
			: projectColors.white;
		let uploadIcon = this.state.uploaded ? 'check' : 'add';
		let iconColor = this.state.uploaded
			? projectColors.white
			: projectColors.gray;

		return (
			<View style={styles.container}>
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
							<ActivityIndicator
								color={projectColors.green}
								size="small"
							/>
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
						{!this.state.validate ? (
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
								this.changeDateCheckPicture(
									date,
									item.id,
									item.has_validity
                )
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
	uploadDocuments: state.registerReducer.uploadDocuments,
	addProviderId: state.registerReducer.addProviderId,
	docs: state.registerReducer.docs,
	settings: state.settingsReducer.settings,
});

const mapDispatchToProps = (dispatch) => ({
	getDocs: (values) => dispatch(getDocs(values)),
	saveAddDocs: (value) => dispatch(saveAddDocs(value)),
	onProviderAction: (provider) => dispatch(providerAction(provider)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListDocuments);
