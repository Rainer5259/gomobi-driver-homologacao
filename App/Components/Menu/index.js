// Modules
import React, {PureComponent} from 'react';
import {
	View,
	Image,
	Alert,
	TouchableOpacity,
	NativeModules,
  Text,
  ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import VersionNumber from 'react-native-version-number';
import {connect} from 'react-redux';
import {Icon as TypedIcon} from 'react-native-elements';

// Themes
import {Images} from '../../Themes';

// Util
import * as parse from '../../Util/Parse';
import * as constants from '../../Util/Constants';

// Locales
import {strings} from '../../Locales/i18n';

//Styles
import styles from './styles';

// Services
import NavigationService from '../../Services/NavigationService';

// Store
import {providerAction} from '../../Store/actions/providerProfile';

const listMenu = [
	{
		name: strings('requests.myRequests'),
		screen: 'MyRequestsScreen',
    icon_type: 'ionicon',
    icon_old: 'directions-car',
		icon: 'car',
		page_id: null,
	},
	{
		name: strings('checkingAccount.yearReport'),
		screen: 'ReportMainScreen',
    icon_type: 'ionicon',
    icon_old: 'insert-chart',
		icon: 'podium',
		page_id: null,
	},
	{
		name: strings('price.price_title'),
		screen: 'PriceScreen',
    icon_type: 'ionicon',
    icon_old: 'attach-money',
    icon: 'logo-usd',
		page_id: null,
	},
	{
		name: strings('config.configuration'),
		screen: 'ConfigScreenLocal',
    icon_type: 'ionicon',
    icon_old: 'settings',
    icon: 'settings',
		page_id: null,
	},
	{
		name: strings('menu_titles.messages'),
		screen: 'ListDirectsScreen',
    icon_type: 'ionicon',
    icon_old: 'chat',
    icon: 'chatbox-ellipses',
		page_id: null,
	},
	{
		name: strings('logout.title_alert'),
		screen: '',
    icon_type: 'ionicon',
    icon_old: 'input',
    icon: 'exit-outline',
		page_id: null,
	},
];

const {RNProviderBubble} = NativeModules;
class Menu extends PureComponent{
	static navigationOptions = {
		gesturesEnabled: false,
	};

	constructor(props) {
		super(props);
		this.state = {
			image: Images.avatar_register,
			firstName: 'Your name',
			lastName: 'Last name',
		};
		penultimatePosition = listMenu.length - 2;
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.getDataUser();
	}

	componentDidMount() {
		listMenu.forEach((item, index) => {
			if (item.screen == 'PriceScreen' && !this.props.settings.is_active_autonomous_tariff) {
        listMenu.splice(index, 1);
			}

			if (this.props.settings && index === penultimatePosition) {
				if (this.props.settings.show_provider_menu_indication) {
					let formatterIndication = {
						name: strings('menu_titles.indication'),
						screen: 'SigScreen',
            icon_type: 'ionicon',
            icon_old: 'people',
						icon: 'people',
						page_id: null,
					};
					if (listMenu.filter((item) => item.name == formatterIndication.name).length == 0) {
						listMenu.splice(index, 0, formatterIndication);
					}
				}
				this.props.aplicationPage.filter((custom_menu_item) => {
					if (custom_menu_item.id > 2 && custom_menu_item.show_menu == 1) {
            const formattedAplication = {
              name: custom_menu_item.title,
              screen: 'TermsScreen',
              icon_type: 'material',
              icon: custom_menu_item.icon ? custom_menu_item.icon : 'assignment-turned-in', // document-text
              page_id: custom_menu_item.id,
            };
            if (listMenu.filter((item) => item.name == formattedAplication.name).length == 0) {
              listMenu.splice(index, 0, formattedAplication);
            }
					}
				});
			}
      return true;
		});
	}

	logout = ({onItemSelected}) => {
		this.menuNavigate({
			onItemSelected: onItemSelected,
			screen: 'LoginScreen',
		});
	};

	doLogout = ({onItemSelected}) => {
		Alert.alert(
			strings('logout.title_alert'),
			strings('logout.message_alert'),
			[
				{
					text: strings('general.no'),
					onPress: () => {},
					style: 'cancel',
				},
				{
					text: strings('general.yes'),
					onPress: () =>
						this.logout({onItemSelected: onItemSelected}),
				},
			],
			{cancelable: false}
		);
	};

	menuNavigate = ({onItemSelected, screen, page_id}) => {
		if (screen == 'LoginScreen') {
			RNProviderBubble.setupProviderContext(
				'-1',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				false,
				false
			);

			parse.logout(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				onItemSelected
			);

			this.props.onProviderAction({
				_id: '',
				_token: '',
				_is_active: '',
			});
		} else if (screen == '') {
			this.doLogout({onItemSelected});
		} else if (screen == 'ListDirectsScreen') {
			NavigationService.navigate(screen, {
				id: this.props.providerProfile._id,
				token: this.props.providerProfile._token,
				url: constants.BASE_URL,
				socket_url: constants.SOCKET_URL,
				audio: this.props.audioChatProvider,
			});
		} else {
			NavigationService.navigate(screen, {page_id: page_id});
		}
	};

	/* Get data user and put on objetc 'dataUser' */
	getDataUser = () => {
		var image = Images.avatar_register;
		if (
			this.props.providerProfile._picture != '' &&
			this.props.providerProfile._picture != null
		) {
			image = {uri: this.props.providerProfile._picture};
		}

		this.setState({
			image,
			firstName: this.props.providerProfile._first_name,
			lastName: this.props.providerProfile._last_name,
		});
	};

	render() {
		var onItemSelected = this.props.onItemSelected;
		return (
      <View style={{flex:1}}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
					<TouchableOpacity
						style={styles.boxAvatar}
						onPress={() => onItemSelected('EditProfileMainScreen')}>
						<View style={styles.avatarContainer}>
							<View style={{flexDirection: 'row'}}>
								<View style={styles.areaAvatar}>
									<Image
										/*resizeMode="contain" */ style={
											styles.avatar
										}
										source={this.state.image}
									/>
								</View>
								<View
									style={{
										justifyContent: 'center',
										marginLeft: 7,
									}}>
									<Text style={styles.name}>
										{this.state.firstName}
									</Text>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
										}}>
										{this.props.providerProfile ? (
											<Text
												style={{
													fontWeight: 'bold',
													color: '#313131',
												}}>
												{
													this.props.providerProfile
														._rate
												}
											</Text>
										) : null}
										<TypedIcon
											type="ionicon"
											name="star"
											color="#000000"
											size={14}
											style={{marginLeft: 5}}
										/>
									</View>
									<Text style={styles.editText}>
										{strings('menu_titles.edit_profile')}
									</Text>
								</View>
							</View>
						</View>
					</TouchableOpacity>

          <ScrollView style={{flex:1, paddingTop: 24}}>
            {listMenu.map((page, i) =>
            <TouchableOpacity
              key={i}
              onPress={() => this.menuNavigate({
                onItemSelected: onItemSelected,
                screen: page.screen,
                page_id: page.page_id,
              })}
              style={styles.contentMenu}
            >
              <View  style={{ flexDirection:'row'}}>
                <TypedIcon type={page.icon_type} name={page.icon} size={22} color="#969696" style={styles.iconMenu} />
                <Text style={styles.txtMenu}>{page.name}</Text>
              </View>
            </TouchableOpacity>)}
          </ScrollView>

					<TouchableOpacity
						onPress={() =>
							NavigationService.navigate('VersionScreen')
						}
						style={{
							alignItems: 'center',
							paddingVertical: 10,
						}}>
						<Text
							style={{
								fontSize: 12,
								color: '#555',
							}}>
							{strings('menu_titles.version', { version: VersionNumber.appVersion })}
						</Text>
					</TouchableOpacity>
        </View>
      </View>
		);
	}

	navigateToScreen(screen) {
		NavigationService.navigate(screen);
	}
}

Menu.propTypes = {
	onItemSelected: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	const {settings, audioChatProvider} = state.settingsReducer;
	const {aplicationPage} = state.settingsReducer;
	const {providerProfile} = state.providerProfile;
	return {settings, providerProfile, aplicationPage, audioChatProvider};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onProviderAction: (provider) => dispatch(providerAction(provider)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
