// Modules
import React, { Component } from "react";
import {
	BackHandler,
	Platform,
	Alert,
	ScrollView,
	FlatList,
	Text,
	View,
	TouchableOpacity,
	Image
} from "react-native";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import { CheckBox } from 'react-native-elements';

// Components
import DefaultHeader from "../../Components/DefaultHeader";

// Locales
import { strings } from "../../Locales/i18n";



// Services
import ProviderApi from "../../Services/Api/ProviderApi";

// Themes
import { Images } from "../../Themes";
import { invertTree, projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Services
import { handlerException } from "../../Services/Exception";

// Store
import { changeProviderServices } from '../../Store/actions/actionProvider'

// Utils
import * as parse from "../../Util/Parse";
import * as constants from "../../Util/Constants";

// Styles
import styles from "./styles";
class EditServicesStepScreen extends Component {
  constructor(props) {
    super(props)
		this.serviceTree = null
		this.itemSelected = false

		this.state = {
			datasource: [],
			isLoading: false,
			editable: true
		}

		this.apiProvider = new ProviderApi()
	}

	componentDidMount() {
		BackHandler.addEventListener("backPress", () => {
			this.navigateToScreen("EditProfileMainScreen")
			return true
		})
		// Getting services information
		this.getServicesInformation()
	}

	componentWillUnmount() {
		BackHandler.removeEventListener("backPress")
	}

	/**
	 * Invert the tree - types is child and categories is parent if true
	 * @param {Array} typesArray
	 */
	invertTree(typesArray) {
		var types = [];
		for (let type of typesArray) {
			for (let category of type.categories) {
				cat_index = types.findIndex(cat => cat.id === category.id);
				if (cat_index == -1)
					types.push({
						id: category.id,
						name: category.name,
						categories: [{
							id: type.id,
							name: type.name,
							selected: false
						}],
						selected: false
					})
				else
					types[cat_index].categories.push({
						id: type.id,
						name: type.name,
						selected: false
					});
			}
		}
		return types;
	}

	/**
	 * Get Vehicle Information.
	 */
	getServicesInformation() {
		var datasource = [];
		if (this.props.services.length > 0) {
			var types = this.props.services;
			var typesArray = [];
			//Percorrendo os tipos
			for (let i = 0; i < types.length; i++) {
				var type = types[i];
				var categories = types.categories;
				var categoriesArray = [];

				//Percorrendo as categories do tipo
				if (categories && categories.length > 0) {
					for (let j = 0; j < categories.length; j++) {
						var categorie = categories[j];
						categoriesArray.push({
							id: categorie.id,
							name: categorie.name,
							selected: false
						});
					}
				}

				typesArray.push({
					id: type.id,
					name: type.name,
					categories: categoriesArray,
					selected: false
				});
			}
			if (invertTree) {
				datasource = this.invertTree(typesArray);
				this.typesArray = typesArray;
			} else {
				datasource = typesArray;
			}

			for (let i = 0; i < this.props.servicesProvider.length; i++) {
				datasource.map(el => {
					if (el.id == this.props.servicesProvider[i].id) {
						el.selected = true
						if (el.categories.length > 0) {
							for (let j = 0; j < this.props.servicesProvider[i].categories.length; j++) {
								el.categories.map(cat => {
									if (cat.id == this.props.servicesProvider[i].categories[j].id) {
										cat.selected = true
									}
								})
							}
						}
					}
				})
			}

			this.setState({ datasource, isLoading: false });
		}

    if (this.props.settings.is_approved_provider_name_update_enabled == 0 &&
        !["PENDENTE", 'EM_ANALISE'].includes(this.props.provider._status_id)) {
      this.setState({ editable: false });
    }
	}

	/**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const { navigate } = this.props.navigation;
		return navigate;
	}

	async RegisterService() {
		/*
		 * Ajustando o array para verificar quais opções de serviços e categorias o usuário escolheu
		 * caso ele não tenha marcado nenhuma, exibe um alerta, caso contrário vai para a próxima tela
		 */
		let resultArray = [];

		if (invertTree) {
			let category = [];
			for (let i = 0; i < this.state.datasource.length; i++) {
				category = this.state.datasource[i];
				if (category.selected == true) {
					for (let j = 0; j < category.categories.length; j++) {
						var type = category.categories[j];
						if (type.selected == true) {

							type_index = resultArray.findIndex(tp => tp.id === type.id);

							if (type_index == -1)
								resultArray.push({
									id: type.id,
									name: type.name,
									categories: [{
										id: category.id,
										name: category.name
									}]
								});
							else
								resultArray[type_index].categories.push({
									id: category.id,
									name: category.name
								});
						}
					}
				}
			}
		} else {
			let type = [];
			for (let i = 0; i < this.state.datasource.length; i++) {
				type = this.state.datasource[i];
				if (type.selected == true) {
					var categoriesArray = [];
					for (let j = 0; j < type.categories.length; j++) {
						var categorie = type.categories[j];
						if (categorie.selected == true) {
							categoriesArray.push({ id: categorie.id, name: categorie.name });
						}
					}

					resultArray.push({
						id: type.id,
						name: type.name,
						categories: categoriesArray
					});
				}
			}
		}

		if (resultArray.length > 0) {


			let origin = "appv3";

			try {
				const response = await this.apiProvider.RegisterServices(this.props.provider._id, origin, resultArray )
				let responseJson = response.data
				if (parse.isSuccess(responseJson, this.returnConstNavigate()) == true) {
					parse.showToast(strings('register.successRegisterServices'), Toast.durations.LONG)
					this.props.changeProviderServices(resultArray)
			        this.props.navigation.navigate('EditProfileMainScreen')
				} else {
					parse.showToast(responseJson.error_messages[0], Toast.durations.LONG)
				}
			} catch (error) {
				this.setState({ isLoggingIn: false })
        parse.showToast(strings("error.try_again"), Toast.durations.LONG)
        handlerException('EditServicesStepScreen', error);
			}

		} else {
			this.showAlert();
		}
	}

	/**
	 * Navigate to another screen
	 * @param {String} screen
	 */
	navigateToScreen(screen) {
		const { navigate } = this.props.navigation;
		navigate(screen);
	}

	changeFatherValue(pos) {
		let serviceFather = this.state.datasource;
		serviceFather[pos].selected = !serviceFather[pos].selected;
		if (serviceFather[pos].selected === true) {
			serviceFather[pos].categories.map(map => {
				map.selected = true;
			});
		} else if (serviceFather[pos].selected === false) {
			serviceFather[pos].categories.map(map => {
				map.selected = false;
			});
		}
		this.setState({ datasource: serviceFather });
	}

	changeChildValue(pos, index) {
		this.itemSelected = false;
		var serviceChild = this.state.datasource;
		serviceChild[pos].categories[index].selected = !serviceChild[pos]
			.categories[index].selected;
		if (serviceChild[pos].categories[index].selected === true) {
			if (this.state.datasource[pos].selected === false) {
				serviceChild[pos].selected = true;
			}
		} else if (serviceChild[pos].categories[index].selected === false) {
			this.state.datasource[pos].categories.map(map => {
				if (map.selected === true) {
					this.itemSelected = true;
				}
			});
		}
		this.setState({ datasource: serviceChild });
	}

	chargeChildren(obj, pos) {
		return (
			<View>
				<CheckBox
					title={obj.name}
					disabled={!this.state.editable ? true : false}
					checked={this.state.datasource[pos].selected}
					containerStyle={[!this.state.editable ? styles.contCheckDisabled : styles.contCheck]}
					checkedColor={projectColors.green}
					onPress={() => this.changeFatherValue(pos)}
				/>
				<FlatList
					data={this.state.datasource[pos].categories}
					extraData={this.state}
					renderItem={({ item, index }) => (
						<View style={{ flexDirection: "row", alignItems: 'center' }}>
							<Image
								source={Images.icon_deep_checkbox}
								style={styles.spaceCheckBokChild}
							/>

							<CheckBox
								title={item.name}
								disabled={!this.state.editable ? true : false}
								size={21}
								checked={this.state.datasource[pos].categories[index].selected}
                containerStyle={[!this.state.editable ? styles.contCheckDisabled : styles.contCheck]}
								checkedColor={projectColors.green}
								onPress={() => this.changeChildValue(pos, index)}
							/>

						</View>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>
		)
  }

  showAlert() {
		if (Platform.OS == constants.ANDROID) {
			Alert.alert(
				strings("register.error"),
				strings("register_step3.select_least_service_category"),
				[{ text: strings("register.close") }],
				{ cancelable: true }
			);
		} else if (Platform.OS == constants.IOS) {
			Alert.alert(
				strings("register.error"),
				strings("register_step3.select_least_service_category"),
				[{ text: strings("register.close") }],
				{ cancelable: true }
			);
		}
  }

	render() {
		return (
			<View style={styles.parentContainer}>
        <DefaultHeader
          loading={this.state.isLoading}
          loadingMsg={strings('register.updating')}
          btnBackListener={() => this.props.navigation.goBack()}
          title={strings('register_steps.services_data')}
        />
				<ScrollView style={styles.parentContainer} keyboardShouldPersistTaps="handled">
					<View style={styles.subtitleBox}>
						<Text style={styles.subtitleText}>
							{strings("register_steps.select_services")}
						</Text>
					</View>
					<View style={styles.view}>
						<View style={styles.areaFilters}>
							<View style={styles.rowFilters}>
								<View style={styles.column}>
									<FlatList
										data={this.state.datasource}
										extraData={this.state}
										renderItem={({ item, index }) =>
											this.chargeChildren(item, index)
										}
										keyExtractor={(item, index) => index.toString()}
									/>
								</View>
							</View>
						</View>
						{this.state.editable &&
              <TouchableOpacity
                style={styles.buttonRegister}
                onPress={() => this.RegisterService()}
              >
                <Text style={styles.txtButtonRegister}>
                  {strings("register.save")}
                </Text>
              </TouchableOpacity>
            }
					</View>
				</ScrollView>
			</View>
		)
	}
}

const mapStateToProps = state => (
	{
		servicesProvider: state.providerReducer.servicesProvider,
		provider: state.providerProfile.providerProfile,
		services: state.servicesReducer.serviceList,
		settings: state.settingsReducer.settings
	}
)

const mapDispatchToProps = dispatch => (
	{
		changeProviderServices: values => dispatch(changeProviderServices(values))
	}
)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditServicesStepScreen);
