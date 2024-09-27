"use strict"

// Modules
import React, { Component } from "react"
import {
    ScrollView,
    Text,
    Platform,
    View,
    TouchableOpacity,
    BackHandler
} from "react-native"
import I18n from 'react-native-i18n';
import Toast from "react-native-root-toast"
import { connect } from "react-redux"
import { Picker as NativeBasePicker } from '@react-native-picker/picker';

// Components
import DefaultHeader from "../../Components/DefaultHeader";

// Locales
import { strings } from "../../Locales/i18n"

// Services
import ProviderApi from "../../Services/Api/ProviderApi"
import {handlerException} from '../../Services/Exception';
import ProviderApiFormData from "../../Services/Api/ProviderApiFormData"

// Store
import { changeRegisterAddress } from '../../Store/actions/actionRegister'

// Themes
import { formStructConfig } from "../../Themes/WhiteLabelTheme/WhiteLabel"

// Utils
import * as parse from "../../Util/Parse"
import _ from 'lodash';

//Hooks
import useLoadValuesRASS from './hooks/useLoadValuesRASS';

// Styles
import styles from "./styles"
import formStructConfigSelected from "../../Themes/Global/Global";

// Form
let t = require("tcomb-form-native-codificar")
let Form = t.form.Form
const stylesheet = formStructConfig(t.form.Form.stylesheet)
const stylesheetSelected = formStructConfigSelected(t.form.Form.stylesheet)

export const currentLocale = I18n.currentLocale();

var countries = [
    { id: 1, label: '-', value: '-' },
    { id: 2, label: 'AC', value: 'AC' },
    { id: 3, label: 'AL', value: 'AL' },
    { id: 4, label: 'AP', value: 'AP' },
    { id: 5, label: 'AM', value: 'AM' },
    { id: 6, label: 'BA', value: 'BA' },
    { id: 7, label: 'CE', value: 'CE' },
    { id: 8, label: 'DF', value: 'DF' },
    { id: 9, label: 'ES', value: 'ES' },
    { id: 10, label: 'GO', value: 'GO' },
    { id: 11, label: 'MA', value: 'MA' },
    { id: 12, label: 'MT', value: 'MT' },
    { id: 13, label: 'MS', value: 'MS' },
    { id: 14, label: 'MG', value: 'MG' },
    { id: 15, label: 'PA', value: 'PA' },
    { id: 16, label: 'PB', value: 'PB' },
    { id: 17, label: 'PR', value: 'PR' },
    { id: 18, label: 'PE', value: 'PE' },
    { id: 19, label: 'PI', value: 'PI' },
    { id: 20, label: 'RJ', value: 'RJ' },
    { id: 21, label: 'RN', value: 'RN' },
    { id: 22, label: 'RS', value: 'RS' },
    { id: 23, label: 'RO', value: 'RO' },
    { id: 24, label: 'RR', value: 'RR' },
    { id: 25, label: 'SC', value: 'SC' },
    { id: 26, label: 'SP', value: 'SP' },
    { id: 27, label: 'SE', value: 'SE' },
    { id: 28, label: 'TO', value: 'TO' },
]

class RegisterAddressStepScreen extends Component {

    useLoadValues = useLoadValuesRASS();

    constructor(props) {
        super(props)
        this.state = {
          value: {
                zipCode: "",
                address: "",
                complement: ""
            },
            valueNumber: {
                number: ""
            },
            valueNeighborhood: {
                neighborhood: ""
            },
            valueCity: {
                city: ""
            },
            valueState: {
                state: ""
            },
            isLoggingIn: false,
            isFocusedZipCode: false,
            isFocusedAddress: false,
            isFocusedNumber: false,
            isFocusedNeighborhood: false,
            isFocusedComplement: false,
            isFocusedCity: false,
            isFocusedState: false,
            errorZipCode: false,
            errorAddress: false,
            errorNumber: false,
            errorNeighborhood: false,
            errorCity: false,
            errorState: false,
            errorMsgZipCode: null,
        }
        // API settings
        this.api = new ProviderApiFormData()
        this.apiProvider = new ProviderApi()
    }

    componentDidMount() {
        BackHandler.addEventListener("backPress", () => {
            this.props.navigation.navigate("RegisterBasicStepScreen")
            return true
        })
        this.useLoadValues.deleteInfoByStorage();
        this.loadInfo();
    }

  /**
  * @description Carrega as informacoes do motorista logado ou do storage
  * (Se carregar do storage a tela foi fechada na hora do cadastro)
  */
  async loadInfo() {
    const data = await this.useLoadValues.getAdddressInfo(this.props);

    if (data) {
      this.setState({
        value: {
          ...data.value
        },
        valueNumber: {
          number: data.valueNumber.number
        },
        valueNeighborhood: {
          neighborhood: data.valueNeighborhood.neighborhood
        },
        valueCity: {
          city: data.valueCity.city
        },
        valueState: {
          state: data.valueState.state
        },
        cepValidationWeb: true
      });
    }
  }

  /**
   * @param {Object} prevState Valores anteriores de cada campo.
   * @returns {Boolean} Caso for alterado algum valor de campo que precisa ser salvo no storage.
   */
  verifyToSaveInfo(prevState) {
    return !_.isEmpty(this.state.value) &&
      ((prevState.value.zipCode != this.state.value.zipCode && this.state.value.zipCode) ||
        (prevState.value.address != this.state.value.address && this.state.value.address) ||
        (prevState.value.complement != this.state.value.complement && this.state.value.complement) ||
        (prevState.valueNumber.number != this.state.valueNumber.number && this.state.valueNumber.number) ||
        (prevState.valueNeighborhood.neighborhood != this.state.valueNeighborhood.neighborhood && this.state.valueNeighborhood.neighborhood) ||
        (prevState.valueCity.city != this.state.valueCity.city && this.state.valueCity.city) ||
        (prevState.valueState.state != this.state.valueState.state && this.state.valueState.state));
  }

  /**
 * @description Salva os valores informados no storage para eventuais problemas
 * @param {Object} prevProps
 * @param {Object} prevState
 */
  componentDidUpdate(prevProps, prevState) {
    if (this.verifyToSaveInfo(prevState)) {
      this.useLoadValues.saveValues(this.state);
    }
  }

    getForm() {
        return t.struct({
            zipCode: t.String,
            address: t.String,
            complement: t.maybe(t.String)
        })
    }

    getFormNumber() {
        return t.struct({
            number: t.Number
        })
    }

    getFormNeighborhood() {
        return t.struct({
            neighborhood: t.String
        })
    }

    getformCity() {
        return t.struct({
            city: t.String
        })
    }

    getformState() {
        return t.struct({
            state: t.String
        })
    }

	/**
	 * Focus to next input on press next button at keyboard
	 * @param {String} input
	 * @param {Boolean} hasMask
	 */
    focusToNext(input, hasMask = false) {
        if (hasMask)
            this._formRef.getComponent(input).refs.input._inputElement.focus()
        else
            this._formRef.getComponent(input).refs.input.focus()
    }

    /**
     * Fields form
     */
    getOptionsInput() {
        let optionsInput = {
            fields: {
                zipCode: {
                    stylesheet: this.state.isFocusedZipCode ? stylesheetSelected : stylesheet,
                    hasError: this.state.errorZipCode,
                    error: this.state.errorMsgZipCode,
                    maxLength: this.props.settings.language == 'ao' ? null : 9,
                    label: strings("register.zip_code"),
                    keyboardType: "numeric",
                    mask: this.props.settings.language == 'ao' ? "9999-9999" : "99999-999",
                    onFocus: () => this.setState({ isFocusedZipCode: true }),
                    onBlur: () => this.props.settings.language == 'ao' ? null : this.checkCEP(this.state.value.zipCode),
					hidden: this.props.settings.language == 'ao' ? true : false
                },
                address: {
                    stylesheet: this.state.isFocusedAddress ? stylesheetSelected : stylesheet,
                    hasError: this.state.errorAddress,
                    error: strings("register.empty_address"),
                    label: strings("register.address"),
                    onFocus: () => this.setState({ isFocusedAddress: true, errorAddress: false }),
                    onBlur: () => this.checkAddress()
                },
                complement: {
                    stylesheet: this.state.isFocusedComplement ? stylesheetSelected : stylesheet,
                    label: strings("register.complement"),
                    onSubmitEditing: () => this._formRefNumber.getComponent('number').refs.input.focus(),
                    onFocus: () => this.setState({ isFocusedComplement: true }),
                    onBlur: () => this.setState({ isFocusedComplement: false })
                }

            }
        }
        return optionsInput
    }

    /**
    * Fields form
    */
    getOptionsInputNumber() {
        let optionsInput = {
            fields: {
                number: {
                    stylesheet: (this.state.isFocusedNumber) ? stylesheetSelected : stylesheet,
                    hasError: this.state.errorNumber,
                    error: strings("register.empty_number"),
                    label: strings("register.number"),
                    onSubmitEditing: () => this._formRefNeighborhood.getComponent('neighborhood').refs.input.focus(),
                    onFocus: () => this.setState({ isFocusedNumber: true, errorNumber: false }),
                    onBlur: () => this.props.settings.language !== 'ao' ? this.checkNumber() : this.setState({ errorNumber: false }),
					hidden: this.props.settings.language == 'ao' ? true : false
                }
            }
        }
        return optionsInput
    }

    /**
     * Fields form
     */
    getOptionsInputNeighborhood() {
        let optionsInput = {
            fields: {
                neighborhood: {
                    stylesheet: (this.state.isFocusedNeighborhood) ? stylesheetSelected : stylesheet,
                    hasError: this.state.errorNeighborhood,
                    error: strings("register.empty_neighborhood"),
                    label: strings("register.neighborhood"),
                    onSubmitEditing: () => this._formRefCity.getComponent('city').refs.input.focus(),
                    returnKeyType: "next",
                    onFocus: () => this.setState({ isFocusedNeighborhood: true, errorNeighborhood: false }),
                    onBlur: () => this.checkNeighborhood()
                }
            }
        }
        return optionsInput
    }

    /**
     * Fields form
     */
    getOptionsInputCity() {
        let optionsInput = {
            fields: {
                city: {
                    stylesheet: (this.state.isFocusedCity) ? stylesheetSelected : stylesheet,
                    hasError: this.state.errorCity,
                    error: strings("register.empty_city"),
                    label: strings("register.city"),
                    onFocus: () => this.setState({ isFocusedCity: true, errorCity: false }),
                    onBlur: () => this.checkCity()
                }
            }
        }
        return optionsInput
    }

    /**
     * Fields form
     */
    getOptionsInputState() {
        let optionsInput = {
            fields: {
                state: {
                    stylesheet: (this.state.isFocusedState) ? stylesheetSelected : stylesheet,
                    hasError: this.state.errorState,
                    error: strings("register.empty_state"),
                    label: strings("register.state"),
                    onFocus: () => this.setState({ isFocusedState: true }),
                    onBlur: () => this.checkState()
                }
            }
        }
        return optionsInput
    }

    /**
     * Check neighborhood address field
     */
    checkNeighborhood() {
        this.setState({ isFocusedNeighborhood: false })
        if (!this.state.valueNeighborhood.neighborhood) {
            this.setState({ errorNeighborhood: true })
        } else {
            this.setState({ errorNeighborhood: false })
        }
    }

    /**
    * Check  address field
    */
    checkAddress() {
        this.setState({ isFocusedAddress: false })
        if (!this.state.value.address) {
            this.setState({ errorAddress: true })
        } else {
            this.setState({ errorAddress: false })
        }
    }

    /**
     * Check city address field
     */
    checkCity() {
        this.setState({ isFocusedCity: false })
        if (!this.state.valueCity.city) {
            this.setState({ errorCity: true })
        } else {
            this.setState({ errorCity: false })
        }
    }

    /**
     * Check number address field
     */
    checkNumber() {
        this.setState({ isFocusedNumber: false })
        if (!this.state.valueNumber.number) {
            this.setState({ errorNumber: true })
        } else {
            this.setState({ errorNumber: false })
        }
    }

  /**
  * @description Check  state field is valid
  */
  checkState() {
    this.setState({ isFocusedState: false })
    this.setState({ errorAddress: this.state.valueState.state == '-' })
  }


	/**
	 * Get Cep Information.
	 */
    getCepInformation(value) {
        let zipCode = value.zipCode.replace("-", "")
        this.apiProvider
            .CepInformation(zipCode)
            .then(response => {
                var responseJson = response.data
                if (parse.isSuccess(responseJson, this.returnConstNavigate()) == true) {
                    value.address = responseJson.result.logradouro
                    this.setState({
                        value: { address: responseJson.result.logradouro },
                        valueNeighborhood: { neighborhood: responseJson.result.bairro },
                        valueCity: { city: responseJson.result.localidade },
                        valueState: { state: responseJson.result.uf },
                        invalidCep: false,
                        cepValidationWeb: true,
                        value: value
                    })
                    this._formRefNumber.getComponent('number').refs.input.focus()
                } else {
                    value.address = ""
                    value.city = ""
                    value.state = ""
                    value.neighborhood = ""

                    this.setState({ value: value, invalidCep: true, cepValidationWeb: false })
                }
            })
            .catch(error => {
                this.setState({ isLoggingIn: false })
                handlerException('RegisterAddressStepScreen.getCepInformation', error);
                parse.showToast(strings("error.try_again"), Toast.durations.LONG)
            })
    }

    /**
	 * return const navigate = this.props.navigation
	 */
    returnConstNavigate() {
        const { navigate } = this.props.navigation
        return navigate
    }

    onChange(value) {
      if (this.props.settings.language !== 'ao') {
        if (
          value.zipCode != undefined &&
          value.zipCode.length == 9 &&
          value.zipCode != this.state.value.zipCode
        ) {
          this.getCepInformation(value)
        }
      }
      this.setState({ value })
    }

	/**
	 * Validation for zip code (CEP - pt-br)
	 * @param {String} strCEP
	 */
    checkCEP(strCEP) {
        this.setState({ isFocusedZipCode: false, errorMsgZipCode: null, errorZipCode: false })
        strCEP = strCEP.replace('-', '')
		var invalidCep = false;
        if (this.state.value.zipCode) {
			if (this.props.settings.language !== 'ao') {
				var invalidCep = true
				if (strCEP != null) {
					if (strCEP.length < 8 && this.props.settings.language !== 'ao') {
						this.setState({ invalidCep: true, errorMsgZipCode: strings("register.insert_valid_zip_code") })
						invalidCep = true
					} else {
						if (this.state.cepValidationWeb == false && this.props.settings.language !== 'ao') {
							this.setState({ invalidCep: true, errorMsgZipCode: strings("register.insert_valid_zip_code") })
							invalidCep = true
						} else {
							this.setState({ invalidCep: false })
							invalidCep = false
						}
					}
				}
			}

            return invalidCep
        } else {
            this.setState({ errorMsgZipCode: strings("register.empty_zip_code"), errorZipCode: true })
        }

    }

    onChangeNeighborhood(value) {
        this.setState({ valueNeighborhood: { neighborhood: value.neighborhood } })
    }

    onChangeCity(value) {
        this.setState({ valueCity: { city: value.city } })
    }

    onChangeState(value) {
        this.setState({ valueState: { state: value, errorState: value == '-' } })
    }

    onChangeStateAng(value) {
        this.setState({ valueState: { state: value.state, errorState: value == '-'} })
    }

    onChangeNumber(value) {
        this.setState({ valueNumber: { number: value.number } })
    }

  verifyFieldsBR() {
    const zipCodeError = this.checkCEP(this.state.value.zipCode);

    return !zipCodeError &&
      this.state.value.zipCode &&
      !this.state.errorZipCode &&
      this.state.cepValidationWeb &&
      this.state.value.address &&
      !this.state.errorAddress &&
      this.state.valueNumber.number &&
      !this.state.errorNumber &&
      this.state.valueNeighborhood.neighborhood &&
      !this.state.errorNeighborhood &&
      this.state.valueCity.city &&
      !this.state.errorCity &&
      this.state.valueState.state != '-' &&
      !this.state.errorState
  }

	/**
	 * Call the Register API
	 */
    async registerAddress() {

      if (this.props.settings.language == 'ao') {
        this.setState({
          valueNumber: { number : 0 }
        })
      }

        if (this.props.settings.language == 'ao' ?
            this.state.value.address :
            this.verifyFieldsBR()) {

            this.setState({ isLoggingIn: true })
            let formattedCep = this.state.value.zipCode.replace('-', '')

            try {
                const response = await this.api.RegisterAddressData(
                    this.props.addProviderId,
                    formattedCep,
                    this.state.value.address,
                    this.state.valueNumber.number,
                    this.state.value.complement,
                    this.state.valueNeighborhood.neighborhood,
                    this.state.valueCity.city,
                    this.state.valueState.state,
                    this.props.settings.language !== 'ao' ? 'Brasil' : 'Angola'
                )
                let responseJson = response.data
                this.setState({ isLoggingIn: false })
                if (parse.isSuccess(responseJson, this.returnConstNavigate()) == true) {
                    this.props.changeRegisterAddress(
                        this.state.value.zipCode,
                        this.state.value.address,
                        this.state.valueNumber.number,
                        this.state.value.complement,
                        this.state.valueNeighborhood.neighborhood,
                        this.state.valueCity.city,
                        this.state.valueState.state
                    )
                    parse.showToast(strings('register.successRegisterAddress'), Toast.durations.LONG)
                    this.props.navigation.navigate('RegisterVehicleStepScreen')
                } else {
                    parse.showToast(strings("error.try_again"), Toast.durations.LONG)
                }

              this.setState({ isLoggingIn: false })
            } catch (error) {
                this.setState({ isLoggingIn: false })
                parse.showToast(strings("error.try_again"), Toast.durations.LONG)
                handlerException('RegisterAddressStepScreen.registerAddress', error);
            } finally {
              this.setState({ isLoggingIn: false })
            }

        } else {
            parse.showToast(strings("error.correctly_fill"), Toast.durations.SHORT)
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.parentContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                  <DefaultHeader
                    loading={this.state.isLoggingIn}
                    loadingMsg={strings("register.creating-provider")}
                    btnBack={true}
                    btnBackListener={() => this.props.navigation.navigate('RegisterBasicStepScreen')}
                    btnNext={this.props.addressFilled}
                    btnNextListener={() => this.props.navigation.navigate('RegisterVehicleStepScreen')}
                    title={strings('profileProvider.addressData')}
                  />
                    <View style={styles.containerScrollSecondary}>
                        <View style={styles.sectionInputs}>
                            <Form
                                ref={ref => (this._formRef = ref)}
                                type={this.getForm()}
                                options={this.getOptionsInput()}
                                value={this.state.value}
                                onChange={this.onChange.bind(this)}
                            />
                            <View style={styles.containerFormPrimary}>
                                <View style={styles.containerFormNumber}>
                                    <Form
                                        ref={ref => (this._formRefNumber = ref)}
                                        type={this.getFormNumber()}
                                        options={this.getOptionsInputNumber()}
                                        value={this.state.valueNumber}
                                        onChange={this.onChangeNumber.bind(this)}
                                    />
                                </View>
                                <View style={styles.containerFormNeighborhood}>
                                    <Form
                                        ref={ref => (this._formRefNeighborhood = ref)}
                                        type={this.getFormNeighborhood()}
                                        options={this.getOptionsInputNeighborhood()}
                                        value={this.state.valueNeighborhood}
                                        onChange={this.onChangeNeighborhood.bind(this)}
                                    />
                                </View>
                            </View>
                            <View style={[styles.containerFormPrimary, this.props.settings.language !== 'ao' ? { FlexDirection: 'row' } : null]}>
                                <View style={styles.containerFormCity}>
                                    <Form
                                        ref={ref => (this._formRefCity = ref)}
                                        type={this.getformCity()}
                                        options={this.getOptionsInputCity()}
                                        value={this.state.valueCity}
                                        onChange={this.onChangeCity.bind(this)}
                                    />
                                </View>
                                {this.props.settings.language !== 'ao' ? (
									<View style={[styles.containerFormState, { width: 110 }]}>
										<View>
											<Text style={styles.txtState}>{strings('register.state')}</Text>
											{Platform.OS === 'ios' ? (
												<NativeBasePicker
													selectedValue={this.state.valueState.state}
													style={styles.picker}
													textStyle={styles.textPicker}
													iosHeader={strings('register.state')}
													mode='dropdown'
													onValueChange={(itemValue, itemIndex) =>
														this.onChangeState(itemValue)
													}>
													{countries.map((e, i) => {
														return <NativeBasePicker.Item label={e.label} value={e.value} key={i} />
													})}
												</NativeBasePicker>
											) : (
													<NativeBasePicker
														selectedValue={this.state.valueState.state}
														style={styles.picker}
														itemStyle={styles.itemPicker}
														mode='dropdown'
														onValueChange={(itemValue, itemIndex) =>
															this.onChangeState(itemValue)
														}>
														{countries.map((e, i) => {
															return <NativeBasePicker.Item label={e.label} value={e.value} key={i} />
														})}
													</NativeBasePicker>
												)}
										</View>
									</View>
								) :
									<View>
										<Form
                                        ref={ref => (this._formRefState = ref)}
                                        type={this.getformState()}
                                        options={this.getOptionsInputState()}
                                        value={this.state.valueState}
                                        onChange={this.onChangeStateAng.bind(this)}
                                    />
									</View>
								}

                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.buttonRegister}
                            onPress={() => this.registerAddress()}
                        >
                            <Text style={styles.txtButtonRegister}>
                                {strings("register.next_step")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View >
        )
    }
}

const mapStateToProps = state => (
    {
        addressRegister: state.registerReducer.addressRegister,
        addressFilled: state.registerReducer.addressFilled,
        addProviderId: state.registerReducer.addProviderId,
		settings: state.settingsReducer.settings
    }
)

const mapDispatchToProps = dispatch => (
    {
        changeRegisterAddress: (
            zipCode,
            address,
            number,
            complement,
            neighborhood,
            city,
            state
        ) => dispatch(changeRegisterAddress(zipCode, address, number, complement, neighborhood, city, state))
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterAddressStepScreen)
