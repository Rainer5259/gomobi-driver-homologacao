// Modules
import React, {Component} from 'react';
import {
	View,
	Text,
	BackHandler,
	TouchableOpacity,
	Platform,
	FlatList,
	Image,
	Alert,
	SafeAreaView,
} from 'react-native';
import Toast from 'react-native-root-toast';
import {connect} from 'react-redux';
//import { readFile } from 'react-native-fs';

// Assets
import images from '../../Assets/Images/EmergencyContacts';

// Custom components
import ImageUpload from '../../Components/Modal/ImageUpload';
import Avatar from '../../Components/Avatar';
import DefaultHeader from '../../Components/DefaultHeader';

// Locales
import {strings} from '../../Locales/i18n';

// Services
import ProviderApiFormData from '../../Services/Api/ProviderApiFormData';
import ProviderApi from '../../Services/Api/ProviderApi';
import { handlerException } from '../../Services/Exception';

// Store
import {
	changePhotoProvider,
	changeProviderData,
	changeProviderBasic,
	changeProviderAddress,
	changeProviderServices,
	changeProviderVehicle,
	changeProviderBankAccount,
} from '../../Store/actions/actionProvider';
import {providerAction} from '../../Store/actions/providerProfile';

// Themes
import {Images} from '../../Themes';

// Util
import * as parse from '../../Util/Parse';
import * as constants from '../../Util/Constants';
import {menuList} from '../../Util/EditProfileMenuList';

//Styles
import styles from './styles';

class EditProfileMainScreen extends Component {
	constructor(props) {
		super(props);
    this._imageUpload = React.createRef();
		this.provider = {};
		this.apiProvider = new ProviderApiFormData();
		this.api = new ProviderApi();
		this.state = {
			isLoading: false,
			avatarSource: Images.avatar_register,
			picture: null,
			editable: true,
			modalVisible: false,
		};
		this.deviceData = {
			token: '0',
			type: Platform.OS,
		};
	}

	returnConstNavigate() {
		const {navigate} = this.props.navigation;
		return navigate;
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				this.props.navigation.navigate('MainScreen');
				return true;
			}
		);
		this.getProviderProfile();

		if (
			this.props.settings.is_approved_provider_picture_update_enabled ==
				0 &&
			this.props.provider._status_id !== 'PENDENTE' &&
			this.props.provider._status_id !== 'EM_ANALISE'
		) {
			this.setState({editable: false});
		}
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress');
	}

	async getProviderProfile() {
		this.setState({isLoading: true});

		try {
			let response = await this.api.GetProviderProfile(
				this.props.provider._id,
				this.props.provider._token
			);
			let responseJson = response.data;

			this.setState({isLoading: false});
			if (
				parse.isSuccess(responseJson, this.returnConstNavigate()) ==
				true
			) {
				this.setState({
					avatarSource: {uri: responseJson.provider.picture},
				});
				this.props.changeProviderBasic(
					responseJson.provider.first_name,
					responseJson.provider.last_name,
					responseJson.provider.birthday,
					responseJson.provider.ddd,
					responseJson.provider.gender,
          responseJson.provider.type_person,
					responseJson.provider.document,
          responseJson.provider.cpf,
          responseJson.provider.cnpj,
					responseJson.provider.phone,
					responseJson.provider.email,
					responseJson.provider.referral_code
				);

				this.props.changeProviderAddress(
					responseJson.provider.zipcode,
					responseJson.provider.address,
					responseJson.provider.address_number,
					responseJson.provider.address_complements,
					responseJson.provider.address_neighbour,
					responseJson.provider.address_city,
					responseJson.provider.state
				);

				this.props.changeProviderServices(
					responseJson.provider.services_types
				);

				this.props.changeProviderVehicle(
					responseJson.provider.car_number,
					responseJson.provider.car_model,
					responseJson.provider.car_brand,
					responseJson.provider.car_color,
					responseJson.provider.car_manufaturing_year,
					responseJson.provider.car_model_year,
				);
				if (responseJson.provider.bank_account != undefined) {
					this.props.changeProviderBankAccount(
						responseJson.provider.bank_account.holder,
						responseJson.provider.bank_account.birthday_date,
						responseJson.provider.bank_account.person_type,
						responseJson.provider.bank_account.document,
						responseJson.provider.bank_account.account_type,
						responseJson.provider.bank_account.bank.id,
						responseJson.provider.bank_account.agency,
						responseJson.provider.bank_account.agency_digit,
						responseJson.provider.bank_account.account,
						responseJson.provider.bank_account.account_digit,
            responseJson.provider.type_pix,
            responseJson.provider.key_pix,
					);
				}
			} else if (responseJson.error_code == 406) {
				this.doLogout(
					strings('invalidToken.expiredSession'),
					strings('invalidToken.expiredSessionMessage')
				);
			}
		} catch (error) {
      console.error("EditProfileMainScreen.getProviderProfile", error);
		} finally {
			this.setState({isLoading: false});
    }
	}

	/**
	 * Show alert of defined message
	 * and call Logout function
	 * @param {String} firstMessage
	 * @param {String} scndMessage
	 */
	doLogout(firstMessage, scndMessage) {
		Alert.alert(
			firstMessage,
			scndMessage,
			[{text: strings('general.OK'), onPress: () => this.logout()}],
			{cancelable: false}
		);
	}

	/**
	 * Clear data and call logout function.
	 */
	logout() {
		const {navigate} = this.props.navigation;
		parse.logout(
			this.props.provider._id,
			this.props.provider._token,
			navigate
		);
	}

  /**
   * Validate open mode according of settings user_picture
   */
  changePhoto() {
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
    this.updatePhoto();
  }

	photoBothEnable(visible) {
		this.setState({modalVisible: visible});
	}

  async updatePhoto() {
    this.setState({ isLoading: true });

    try {
      const params = {
        provider_id: this.props.provider._id,
        picture: this.state.picture,
        token: this.props.provider._token,
        device_type: this.deviceData.type,
        login_by: this.props.provider._login_by
      };
      const response = await this.apiProvider.changePhoto(params);
      const responseJson = response.data;

      if (parse.isSuccess(responseJson, this.returnConstNavigate()) == true) {
        this.props.changePhotoProvider(
          responseJson.provider.picture,
          responseJson.provider.token
        );

      } else if (responseJson.error_messages) {
        parse.showToast(
          responseJson.error_messages[0],
          Toast.durations.LONG
        );
      }
    } catch (error) {
      parse.showToast(strings('error.try_again'), Toast.durations.LONG);
      handlerException('EditProfileMainScreen', error);
      console.debug("EditProfileMainScreen - updatePhoto", error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

	/**
	 * Open a specific profile edit data page
	 * @param {Number} id
	 */
	openProfileScreen(page) {
    this.props.navigation.navigate(page);
	}

	render() {
		return (
			<SafeAreaView style={{flex: 1}}>
				<View style={styles.parentContainer}>
          <DefaultHeader
						loading={this.state.isLoading}
						loadingMsg={strings('load.Loading')}
						btnBackListener={() => this.props.navigation.goBack()}
            title={strings('profileProvider.profile')}
          />
					<View style={{paddingHorizontal: 25}}>
						<Avatar
              refImage={this._imageUpload}
              modalVisible={this.state.modalVisible}
              photoBothEnable={this.photoBothEnable.bind(this)}
              setImageState={this.setImageState.bind(this)}
              changePhoto={this.changePhoto.bind(this)}
              avatarSource={this.state.avatarSource}
              />
						<View style={styles.divider} />

						<View style={styles.contMenuList}>
							<FlatList
								data={menuList}
								scrollEnabled={true}
								showsVerticalScrollIndicator={false}
								keyExtractor={(item) => `${item.id}`}
								renderItem={({item}) => (
									<TouchableOpacity
										style={styles.btnMenuItem}
										onPress={() =>
											this.openProfileScreen(item.page)
										}>
										<Image
											resizeMode="contain"
											style={styles.imgMenuItem}
											source={item.image}
										/>
										<Text style={styles.nameMenuList}>
											{item.name}
										</Text>
									</TouchableOpacity>
								)}></FlatList>

							<TouchableOpacity
								style={styles.btnMenuItem}
								onPress={() =>
									this.props.navigation.navigate(
										'DeleteAccountScreen',
										{
											url:
												constants.BASE_URL +
												constants.DELETE_ACCOUNT,
											id: this.props.provider._id,
											token: this.props.provider._token,
											logout_function: parse.logout,
										}
									)
								}>
								<View style={styles.contTitleBtn}>
									<Image
										source={images.icon_remove}
										style={styles.imgMenuItem}
									/>
									<Text style={styles.nameMenuList}>
										{strings(
											'profileProvider.delete_account'
										)}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>

          <ImageUpload
            ref={this._imageUpload}
            showModal={this.state.modalVisible}
            setShowModal={(value) => this.photoBothEnable(value)}
            getImage={(value) => this.setImageState(value)}
            title={strings('register.photoUpload')}
          ></ImageUpload>
				</View>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => ({
	provider: state.providerProfile.providerProfile,
	providerProfile: state.providerProfile.providerProfile,
	basicProvider: state.providerReducer.basicProvider,
	settings: state.settingsReducer.settings,
	latitude: state.CoordinatesProviderReducer.latitude,
	longitude: state.CoordinatesProviderReducer.longitude,
});

const mapDispatchToProps = (dispatch) => ({
	onProviderAction: (provider) => dispatch(providerAction(provider)),
	changePhotoProvider: (picture, token) =>
		dispatch(changePhotoProvider(picture, token)),
	changeProviderData: (values) => dispatch(changeProviderData(values)),
  changeProviderBasic: (
    firstName,
    lastName,
    birthday,
    ddd,
    gender,
    typePerson,
    document,
    cpf,
    cnpj,
    phone,
    email,
    indicationCode) => dispatch(
      changeProviderBasic(
        firstName,
        lastName,
        birthday,
        ddd,
        gender,
        typePerson,
        document,
        cpf,
        cnpj,
        phone,
        email,
        indicationCode)),
	changeProviderAddress: (
		zipCode,
		address,
		number,
		complement,
		neighborhood,
		city,
		state
	) =>
		dispatch(
			changeProviderAddress(
				zipCode,
				address,
				number,
				complement,
				neighborhood,
				city,
				state
			)
		),
	changeProviderServices: (values) =>
		dispatch(changeProviderServices(values)),

  changeProviderVehicle: (carNumber,
    carModel,
    carBrand,
    carColor,
    carManufaturingYear,
    carModelYear) =>
    dispatch(
      changeProviderVehicle(carNumber,
        carModel,
        carBrand,
        carColor,
        carManufaturingYear,
        carModelYear)
    ),
	changeProviderBankAccount: (
		accountTitular,
		birthday,
		typeTitular,
		document,
		typeAccount,
		bank,
		agency,
		agencyDigit,
		account,
		accountDigit,
    typePix,
    keyPix
	) =>
		dispatch(
			changeProviderBankAccount(
				accountTitular,
				birthday,
				typeTitular,
				document,
				typeAccount,
				bank,
				agency,
				agencyDigit,
				account,
				accountDigit,
        typePix,
        keyPix
			)
		),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditProfileMainScreen);
