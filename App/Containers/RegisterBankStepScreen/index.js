"use strict";

// Modules
import React, { Component } from "react";
import {
	ScrollView,
	Text,
	View,
	TouchableOpacity,
	BackHandler,
} from "react-native";
import moment from "moment";
import BankForm from "react-native-bank";
import Toast from "react-native-root-toast";
import { CheckBox } from 'react-native-elements';
import { connect } from "react-redux";
import { Picker as SelectPicker } from '@react-native-picker/picker';
import { NavigationActions, StackActions } from "react-navigation"

// Utils
import * as parse from "../../Util/Parse";

//Translate file
import { strings } from "../../Locales/i18n";

// Styles
import styles from "./styles";

// Custom components
import DefaultHeader from "../../Components/DefaultHeader";

// Services
import ProviderApi from "../../Services/Api/ProviderApiFormData";
import { handlerException } from '../../Services/Exception';

// Themes
import { formStructConfig, projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Util
import * as constants from "../../Util/Constants";

// BankLib

let t = require("tcomb-form-native-codificar");
let Form = t.form.Form;
const stylesheet = formStructConfig(t.form.Form.stylesheet);
const stylesheetSelected = formStructConfigSelected (t.form.Form.stylesheet);

// Actions
import { changeRegisterBankAccount } from '../../Store/actions/actionRegister'
import formStructConfigSelected from "../../Themes/Global/Global";

var TypeTitular = t.enums({
	individual: strings("bank_account.individual"),
	company: strings("bank_account.corporative")
})

var TypeAccount = t.enums({
	conta_corrente: strings("bank_account.current_account"),
	conta_corrente_conjunta: strings("bank_account.joint_current_account"),
	conta_poupanca: strings("bank_account.saving_account"),
	conta_poupanca_conjunta: strings("bank_account.joint_saving_account")
})

var banksArray = t.enums({
	bank: 'empty'
})


class RegisterBankStepScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			valueOtherPerson: {
				typeTitular: ""
			},
			valueBank: {
				bank: 1,
				agency: "",
				account: "",
				accountDigit: "",
				agencyDigit: "",
				typeAccount: "",
			},
			valueTitular: {
				accountTitular: "",
				document: "",
				birthDate: new Date()
			},
			document_type: strings("register.document"),
			isLoggingIn: false,
			banks: banksArray,
			maxDocument: 14,
			checkboxState: true,
			isFocusedAccountTitular: false,
			isFocusedDocumentTitular: false,
			errorAccountTitular: false,
			errorDocumentTitular: false,
			errorMsgDocumentTitular: null,
			idFirstBank: 1
		}

		this.didFocus = this.props.navigation.addListener("didFocus", () => {
			this.setState({ isLoggingIn: false })
			this.selectBankFromSearchAllBanksScreen()
		})

		this.api = new ProviderApi()
		this.getProviderBankInformation()
	}

	componentDidMount() {
		BackHandler.addEventListener("backPress", () => {
			this.props.navigation.navigate("RegisterVehicleStepScreen")
			return true
		})

		let maxDate = new Date()
		maxDate.setFullYear(maxDate.getFullYear() - 18)
		this.setState({ valueOtherPerson: { birthDate: maxDate } })

		this.getProviderBankInformation()
		this.getDefaultBanksInfo()
	}

	/*
	  * Read the provider information from params
	  */
	getProviderBankInformation() {
		this.setState({
			valueOtherPerson: {
				accountTitular: this.props.bankAccountRegister.accountTitular,
				document: this.props.bankAccountRegister.document,
				typeTitular: this.props.bankAccountRegister.typeTitular
			},
			value: {
				typeAccount: this.props.bankAccountRegister.typeAccount,
				bank: this.props.bankAccountRegister.bank
			},
			valueAgency: {
				agency: this.props.bankAccountRegister.agency
			},
			valueAgencyDigit: {
				agencyDigit: this.props.bankAccountRegister.agencyDigit
			},
			valueAccount: {
				account: this.props.bankAccountRegister.account
			},
			valueAccountDigit: {
				accountDigit: this.props.bankAccountRegister.accountDigit
			}
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener("backPress")
		this.didFocus.remove()
	}

	getTitularForm() {
		return t.struct({
			accountTitular: t.String,
			birthDate: t.Date,
			document: t.String
		})
	}

	selectBankFromSearchAllBanksScreen() {
		if (this.props.navigation.state.params && this.props.navigation.state.params.bankID) {
			this.getDefaultBanksInfo();

			let aux = this.state.value;
			aux.bank = this.props.navigation.state.params.bankID
			this.setState({ value: aux });
		}
	}

	getOptionsInputTitular() {
		let maxDate = new Date()
		maxDate.setFullYear(maxDate.getFullYear() - 18)

		let optionsInput = {
			fields: {
				accountTitular: {
					stylesheet: this.state.isFocusedAccountTitular ? stylesheetSelected : stylesheet,
					hasError: this.state.errorAccountTitular,
					error: strings("register.empty_account_titular"),
					label: strings("register.account_titular"),
					onFocus: () => this.focusAccountTitular(),
					onBlur: () => this.checkAccountTitular()
				},
				birthDate: {
					stylesheet: stylesheet,
					error: strings("register.empty_birth_day"),
					mode: "date",
					maximumDate: maxDate,
					config: {
						format: () =>
							moment(this.state.valueTitular.birthDate).format("DD/MM/YYYY"),
						dialogMode: "spinner",
					},
					label: strings("register.titular_birth_day")
				},
				document: {
					stylesheet: this.state.isFocusedDocumentTitular ? stylesheetSelected : stylesheet,
					maxLength: this.props.settings.language !== "ao" ? this.state.maxDocument : null,
					hasError: this.state.errorDocumentTitular,
					error: this.state.errorMsgDocumentTitular,
					label: this.state.document_type,
					keyboardType:  this.props.settings.language !== "ao" ? "numeric" : null,
					onFocus: () => this.focusDocument(),
					onBlur: () => this.props.settings.language !== "ao" ? this.checkDocumentTitular() : null
				}
			}
		}
		return optionsInput
	}

	focusAccountTitular() {
		this.setState({ errorAccountTitular: false, isFocusedAccountTitular: true })
	}

	checkAccountTitular() {
		this.setState({ isFocusedAccountTitular: false })
		if (!this.state.valueTitular.accountTitular) {
			this.setState({ accountTitularMsgError: strings("register.empty_account_titular"), errorAccountTitular: true })
			return true
		} else {
			this.setState({ accountTitularMsgError: null })
			return false
		}
	}

	focusDocument() {
		this.setState({ errorMsgDocumentTitular: null, isFocusedDocumentTitular: true, errorDocumentTitular: false })
	}

	checkDocumentTitular() {
		this.setState({ isFocusedDocumentTitular: false })
		if (this.state.valueTitular.document) {
			let formatedDocument = this.state.valueTitular.document
			formatedDocument = formatedDocument.replace(".", "")
			formatedDocument = formatedDocument.replace(".", "")
			formatedDocument = formatedDocument.replace("-", "")
			formatedDocument = formatedDocument.replace("/", "")

			let errorDocument = null
			if (this.state.valueOtherPerson.typeTitular == "individual" || this.state.valueOtherPerson.typeTitular == '' || this.state.valueOtherPerson.typeTitular == undefined) {
				errorDocument = this.props.settings.language !== "ao" ? !this.checkCPF(formatedDocument) : false;
			} else {
				errorDocument = this.props.settings.language !== "ao" ? !this.validateCNPJ(formatedDocument) : false;
			}

			if (errorDocument === true) {
				let msgError = this.state.valueOtherPerson.typeTitular == "company" ? strings("register.invalid_document3") : strings("register.invalid_document2")
				this.setState({ errorMsgDocumentTitular: msgError, errorDocumentTitular: true })
				return true
			} else {
				this.setState({ errorMsgDocumentTitular: null, errorDocumentTitular: false })
				return false
			}
		} else {
			let msgError = this.state.valueOtherPerson.typeTitular == "company" ? strings("register.empty_document2") : strings("register.empty_document")
			this.setState({ errorMsgDocumentTitular: msgError, errorDocumentTitular: true })
			return true
		}
	}

	/**
	 * Validation of the document, function find on: http://www.geradordecpf.org/funcao-javascript-validar-cpf.html
	 * @param {string} cpf
	 */
	checkCPF = cpf => {
		var numeros, digitos, soma, i, resultado, digitos_iguais;
		digitos_iguais = 1;
		if (cpf.length < 11) return false;
		for (i = 0; i < cpf.length - 1; i++)
			if (cpf.charAt(i) != cpf.charAt(i + 1)) {
				digitos_iguais = 0;
				break;
			}
		if (!digitos_iguais) {
			numeros = cpf.substring(0, 9);
			digitos = cpf.substring(9);
			soma = 0;
			for (i = 10; i > 1; i--) soma += numeros.charAt(10 - i) * i;
			resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
			if (resultado != digitos.charAt(0)) return false;
			numeros = cpf.substring(0, 10);
			soma = 0;
			for (i = 11; i > 1; i--) soma += numeros.charAt(11 - i) * i;
			resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
			if (resultado != digitos.charAt(1)) return false;
			return true;
		} else return false;
	}

	/**
	 * Change default values, if checkbox is true or false
	 */
	onPressCheckbox() {
		this.setState({ checkboxState: !this.state.checkboxState })
	}

	/**
	 * Get main banks
	 */
	getDefaultBanksInfo() {
		var banks = this.props.settings.banks;
		var banksAux = "";

		for (let i = 0; i < banks.length; i++) {
			let id = banks[i].id;
			let code = banks[i].code;
			let name = banks[i].name;
			if (code == "001" || code == "104" || code == "341" || code == "237" || code == "033") {
				banksAux += '"' + id + '":"' + code + " - " + name + '",';
			}
		}
		if (this.props.navigation.state.params && this.props.navigation.state.params.bankID) {
			banksAux = banksAux + '"' + this.props.navigation.state.params.bankID + '":"' + this.props.navigation.state.params.bankName + '",';
		}
		banksAux = banksAux + '"allBanks"' + ':' + '"Ver todos os bancos"';
		banksAux = "{" + banksAux + "}";
		banksAux = JSON.parse(banksAux)
		this.setState({
			banks: t.enums(banksAux),
			idFirstBank: Object.keys(banksAux)[0]
		});

	}

	onChangeOtherTitular(value) {
		if (value == "individual" || value == "" || value == undefined) {

			this.setState({
				valueOtherPerson: {typeTitular: value},
				document_type: strings("register.document"),
				maxDocument: 14,
        valueTitular:  {
          accountTitular: '',
          document: '',
        }
			});
		} else if (value == "company") {

			this.setState({
				valueOtherPerson: {typeTitular:value},
				document_type: strings("register.document"),
				maxDocument: 18,
        valueTitular:  {
          accountTitular: '',
          document: '',
        }
			})
		}
	}

	onChangeTitular(value) {
		const titularType = this.state.valueOtherPerson.typeTitular;

		if (titularType == "individual" || titularType == "" || titularType == undefined) {
			if (value.document != undefined) {
				if (this.props.settings.language !== 'ao') {
					value.document = value.document.replace(/\D/g, "");
					value.document = value.document.replace(/(\d{3})(\d)/, "$1.$2");
					value.document = value.document.replace(/(\d{3})(\d)/, "$1.$2");
					value.document = value.document.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
				}
			}
		} else if (titularType == "company") {
			if (value.document != undefined) {
				if (this.props.settings.language !== 'ao') {
					value.document = value.document.replace(/^(\d{2})(\d)/, "$1.$2");
					value.document = value.document.replace(
						/^(\d{2})\.(\d{3})(\d)/,
						"$1.$2.$3"
					);
					value.document = value.document.replace(/\.(\d{3})(\d)/, ".$1/$2");
					value.document = value.document.replace(/(\d{4})(\d)/, "$1-$2");
				}
			}
		}
		this.setState({ valueTitular: value })
	}

	/**
	 * Validation of the document, function find on: http://www.geradorcnpj.com/javascript-validar-cnpj.htm
	 * @param {string} cnpj
	 */
	validateCNPJ = document => {
		let cnpj = document;
		if (!cnpj) {
			return false;
		}
		cnpj = cnpj.replace(/[^\d]+/g, "");

		if (cnpj == "") return false;

		if (cnpj.length != 14) return false;

		if (
			cnpj == "00000000000000" ||
			cnpj == "11111111111111" ||
			cnpj == "22222222222222" ||
			cnpj == "33333333333333" ||
			cnpj == "44444444444444" ||
			cnpj == "55555555555555" ||
			cnpj == "66666666666666" ||
			cnpj == "77777777777777" ||
			cnpj == "88888888888888" ||
			cnpj == "99999999999999"
		)
			return false;

		let tamanho = cnpj.length - 2;
		let numeros = cnpj.substring(0, tamanho);
		let digitos = cnpj.substring(tamanho);
		let soma = 0;
		let pos = tamanho - 7;
		for (let i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2) pos = 9;
		}
		let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
		if (resultado != digitos.charAt(0)) return false;

		tamanho = tamanho + 1;
		numeros = cnpj.substring(0, tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (let i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2) pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
		if (resultado != digitos.charAt(1)) return false;

		return true;
	};

	async registerBankData() {
		let errorDocument = false
		let errorAccountTitular = false

		if (!this.state.checkboxState) {
			errorDocument = this.props.settings.language !== 'ao' ? this.checkDocumentTitular() : false;
			errorAccountTitular = this.checkAccountTitular()
		}

		if (errorDocument == false && errorAccountTitular == false ) {
			this.setState({ isLoggingIn: true })
			if (this.state.valueTitular.birthDate != undefined) {
				var birth = moment(this.state.valueTitular.birthDate).format("DD/MM/YYYY")
			} else {
				var birthAux = new Date()
				var birth = moment(birthAux).format("DD/MM/YYYY")
			}

			let document = 0
			let accountTitular = ''
			if (!this.state.checkboxState) {
				if (this.state.valueOtherPerson.typeTitular == "company") {
					document = this.state.valueTitular.document.replace(/[^\d]+/g, "")
					accountTitular = this.state.valueTitular.accountTitular
				} else {
					document = this.state.valueTitular.document
					document = document.replace(".", "")
					document = document.replace(".", "")
					document = document.replace("-", "")
					accountTitular = this.state.valueTitular.accountTitular
				}
			} else {
				document = this.props.basicRegister.document
				accountTitular = this.props.basicRegister.firstName + ' ' + this.props.basicRegister.lastName
			}

			try {
				const response = await this.api.RegisterBankAccount(
					this.props.addProviderId,
					this.state.valueBank.account,
					this.state.valueBank.accountDigit,
					this.state.valueBank.agency,
					this.state.valueBank.agencyDigit,
					accountTitular,
					this.state.valueOtherPerson.typeTitular ? this.state.valueOtherPerson.typeTitular : 'individual',
					document,
					document,
					this.state.valueBank.bank,
					this.state.valueBank.typeAccount,
					birth,
					this.props.latitude,
					this.props.longitude
				)
				this.setState({ isLoggingIn: false })
				let responseJson = response.data
				if (responseJson.success) {
					this.props.changeRegisterBankAccount(
						accountTitular,
						birth,
						this.state.valueOtherPerson.typeTitular ? this.state.valueOtherPerson.typeTitular : 'individual',
						document,
						this.state.valueBank.typeAccount,
						this.state.valueBank.bank,
						this.state.valueBank.agency,
						this.state.valueBank.agencyDigit,
						this.state.valueBank.account,
						this.state.valueBank.accountDigit
					)
					parse.showToast(strings('register.sucessRegisterBankData'), Toast.durations.LONG)
					await this.props.navigation.dispatch(
						StackActions.reset({
						index: 0,
						key: null,
						actions: [
							NavigationActions.navigate({
							routeName: 'RegisterFinishedScreen',
							}),
						],
						})
					);
				} else {
					parse.showToast(responseJson.error, Toast.durations.LONG)
				}
			} catch (error) {
				this.setState({ isLoggingIn: false })
        		handlerException('RegisterBankStepScreen.registerBankData', error);
				parse.showToast(strings("error.try_again"), Toast.durations.LONG)
			} finally{
        this.setState({ isLoggingIn: false })
      }

		} else {
			parse.showToast(strings("error.correctly_fill"), Toast.durations.SHORT)
		}
	}

	setValueBank(valueBank) {
		if (valueBank) {
			this.setState({
				bankFormValid: true,
				valueBank: Object.assign({}, this.state.valueBank, valueBank)
			})
		}
	}

	render() {
		return (
			<ScrollView style={styles.parentContainer} keyboardShouldPersistTaps="handled">
        <DefaultHeader
          loading={this.state.isLoggingIn}
          loadingMsg={strings("register.creating-provider")}
          btnBack={true}
          btnBackListener={() => this.props.navigation.navigate('RegisterVehicleStepScreen')}
          btnNext={this.props.bankAccountFilled}
          btnNextListener={() => this.props.navigation.navigate('RegisterFinishedScreen')}
          title={strings('register_steps.bank_data')}
        />

				<CheckBox
					title={strings("register.same_titular")}
					checked={this.state.checkboxState}
					containerStyle={styles.contCheck}
					checkedColor={projectColors.green}
					onPress={() => this.onPressCheckbox()}
				/>

				<View style={styles.sectionInputs}>

					{!this.state.checkboxState ? (
              <>
                <Text
                    style={{
                        color: '#6c727c',
                        fontSize: 12,
                    }}
                >
                    {strings('register_bank.account_type_titular')}
                </Text>
                <SelectPicker
                selectedValue={this.state.valueOtherPerson.typeTitular}
                style={{
                    inputAndroid: { color: 'black' },
                    inputIOS: {
                        fontSize: 16,
                        marginBottom: 8,
                        paddingStart: 8,
                    },
                }}
                onValueChange={(state) =>this.onChangeOtherTitular(state)}
                placeholder={{
                    label: strings(
                        'register_bank.empty_type_titular'
                    ),
                    value: null,
                }}
                >
                  <SelectPicker.Item label={strings('bank_account.individual')} value="individual" />
                  <SelectPicker.Item label={strings('bank_account.corporative')} value="company" />
                </SelectPicker>
              </>
            ) : null}

					<BankForm
						ref={ref => (this.formRef = ref)}
						stylesheet={stylesheet}
						initialData={this.state.valueBank}
						params={{ id: '', token: '', lang: this.props.settings.language }}
						route={constants.BANKLIB_URL}
						onSubmit={(value) => {
							this.setValueBank(value)
							this.registerBankData()
						}}
					/>

					{!this.state.checkboxState ? (
						<Form
							ref={ref => (this._formRefOtherPerson = ref)}
							type={this.getTitularForm()}
							options={this.getOptionsInputTitular()}
							value={this.state.valueTitular}
							onChange={this.onChangeTitular.bind(this)}
						/>
					) : null}
					<TouchableOpacity
						style={styles.buttonRegister}
						onPress={() => this.formRef.submitForm()}
					>
						<Text style={styles.txtButtonRegister}>
							{" "}
							{strings("register.final_step")}{" "}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		)
	}
}

const mapStateToProps = state => (
	{
		latitude: state.CoordinatesProviderReducer.latitude,
		longitude: state.CoordinatesProviderReducer.longitude,
		settings: state.settingsReducer.settings,
		bankAccountRegister: state.registerReducer.bankAccountRegister,
		bankAccountFilled: state.registerReducer.bankAccountFilled,
		basicRegister: state.registerReducer.basicRegister,
		addProviderId: state.registerReducer.addProviderId
	}
)

const mapDispatchToProps = dispatch => (
	{
		changeRegisterBankAccount: (
			accountTitular,
			birthday,
			typeTitular,
			document,
			typeAccount,
			bank,
			agency,
			agencyDigit,
			account,
			accountDigit
		) => dispatch(changeRegisterBankAccount(accountTitular, birthday, typeTitular, document, typeAccount, bank, agency, agencyDigit, account, accountDigit))
	}
)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterBankStepScreen)
