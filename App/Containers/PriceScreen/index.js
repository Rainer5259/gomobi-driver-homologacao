import React, { Component } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Toast from 'react-native-root-toast';

import { connect } from "react-redux";

import { strings } from "../../Locales/i18n";
import styles from "./styles";

import ProviderApi from "../../Services/Api/ProviderApi";
import { handlerException } from '../../Services/Exception';
import { BootstrapColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

import { Picker } from "@react-native-picker/picker";
import Button from "../../Components/RoundedButton";
import DefaultHeader from "../../Components/DefaultHeader";
import { TextInputMask } from "react-native-masked-text";
import ContainerInput from "../../Components/Views/ContainerInput";
import ProviderApiFormData from "../../Services/Api/ProviderApiFormData";

let t = require("tcomb-form-native-codificar");

class PriceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      type: null,
      price_value: 0,
      errorMessage: null,
      price_data: { per_unit_distance_value: 0 },
      default_price_data: { per_unit_distance_value: 0 },
    };

    this._refPriceValue = React.createRef();
    this.api = new ProviderApiFormData();
    this.providerApi = new ProviderApi();
  }

  loadDefaultValue() {
    this.uniqueTypeService = this.props?.providerProfile?._services_types.length == 1;
    if (this.uniqueTypeService) {
      this.handleChangePicker(this.props?.providerProfile?._services_types[0].id);
    }
  }

  componentDidMount() {
    this.loadDefaultValue();
  }

  /**
 * Recupera a tabela de pagamento do motorista.
 */
  async getPrice() {
    this.setState({ isLoading: true });

    const { _id, _token } = this.props.providerProfile;

    this.providerApi.getPrice(
      _id,
      _token,
      this.state.type,
    )
      .then(response => {
        const { data = {} } = response;

        const defaultPriceData = { per_unit_distance_value: data.defaultPrice?.per_unit_distance_value || 0 }

        this.setState({
          price_data: data.priceData || defaultPriceData,
          price_value: (data.priceData || defaultPriceData).per_unit_distance_value,
          default_price_data: defaultPriceData
        });
      })
      .catch(error => handlerException('PriceScreen.getPrice', error))
      .finally(() => this.setState({ isLoading: false }));
  }

  /**
 * Salva a tabela de preço
 */
  async savePrice() {
    this.setState({ isLoading: true });

    const { _id, _token } = this.props.providerProfile;

    await this.providerApi.savePrice(
      _id,
      _token,
      this.state.price_data,
      this.state.type
    )
      .then(() => Toast.show(strings('price.successful')))
      .catch(error => {
        Toast.show('Error to save price, try again later', Toast.LONG);
        handlerException('PriceScreen.savePrice', error);
      }).finally(() => this.setState({ isLoading: false }));
  }

  /**
 * Torna o valor da tabela de preço padrão
 */
  resetPrice() {
    this.setState({
      price_data: this.state.default_price_data,
    }, () => this.savePrice());
  }

  handleChangePicker(type) {
    this.setState({ type }, () => Number(this.getPrice()));
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container} backgroundColor={BootstrapColors.white}>
          <DefaultHeader
            loading={this.state.isLoading}
            loadingMsg={strings("load.Loading")}
            btnBackListener={() => this.props.navigation.goBack()}
            title={strings('price.price_title')}
          />

          <ScrollView style={styles.parentContainer} >

            <Text style={styles.titleText}>
              {strings('price.price_description')}
            </Text>
            <Text style={styles.titleText}>
              {strings('price.price_description_details')}
            </Text>


            <View style={styles.sectionInputs}>

              <Picker
                selectedValue={this.state.type}
                onValueChange={this.handleChangePicker.bind(this)}
                enabled={!this.uniqueTypeService}

              >
                <Picker.Item
                  label={strings("price.default_option")}
                  value="" />

                {this.props?.providerProfile?._services_types.map(type =>
                  <Picker.Item label={type.name} value={type.id} key={type.id} />
                )}
              </Picker>

              {this.state.type &&
                <>
                  <ContainerInput
                    onFocused={false}
                    label={strings('price.per_unit_distance_value')}
                  >
                    <TextInputMask
                      refInput={this._refPriceValue}
                      type='money'
                      includeRawValueInChangeText='true'
                      value={this.state.price_value}
                      checkText={(previous, next) => { return next || 0; }}
                      onChangeText={(value, realValue) => {
                        this.state.price_value = realValue || 0;
                        this.state.price_data = { per_unit_distance_value: realValue };
                      }}
                    />
                  </ContainerInput>

                  <Button
                    onPress={() => this.savePrice()}
                    text={strings("price.save")}
                  />
                  <Button customStyle={{ button: { marginTop: 10 } }}
                    onPress={() => this.resetPrice()}
                    text={strings("price.reset")}
                  />
                </>
              }
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settingsReducer.settings,
    providerProfile: state.providerProfile.providerProfile
  }
};

const mapDispatchToProps = dispatch => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PriceScreen);
