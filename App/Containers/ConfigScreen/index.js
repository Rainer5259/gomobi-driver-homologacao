// Modules
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux';

// Components
import DefaultHeader from '../../Components/DefaultHeader';

// Locales
import { strings } from "../../Locales/i18n";

// Themes
import image from '../../Themes/WhiteLabelTheme/Images'

// Util
import * as constants from '../../Util/Constants';

// Styles
import styles from './styles';

class ConfigScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    navigateToScreen(screen) {
      const { navigate } = this.props.navigation;
      /**
       * First parameter: Screen to be initialized passed in "screen" variable
       * Second parameter: Information sent from CurrentScreen to NextScreen.
       * Use "this.props.navigation.state.params.loginBy" to use data on the other Screen
       */
      navigate(screen);
    }


  render() {
    return (
      <View style={styles.parentContainer}>
        <DefaultHeader
          btnBackListener={() => this.props.navigation.goBack()}
          title={strings("config.configuration")}
        />
                <View style={{ paddingHorizontal: 25 }}>
                    <View style={styles.cardPerfil}>
                        <Image source={{ uri: this.props.providerProfile._picture }} style={styles.image} />
                        <View style={styles.information}>
                            <Text style={{ fontWeight: "bold" }}>
                                {this.props.providerProfile._first_name + " " +
                                    this.props.providerProfile._last_name
                                }
                            </Text>
                            <Text>{this.props.providerProfile._phone}</Text>
                            <Text>{this.props.providerProfile._email}</Text>
                        </View>
                    </View>
                    {
                        //this.props.settings.allow_provider_to_choose_payment_method ?
                            <TouchableOpacity
                                onPress={() => this.navigateToScreen("ManagePaymentScreen")}
                                style={styles.cardContact}>
                                <View style={styles.leftContact}>
                                    <Image source={image.forma_pagamento} resizeMode='contain' style={styles.shield} />
                                    <Text style={{ color: "#000" }}>{strings("config.manage_payment")}</Text>
                                </View>
                                <Icons name="right" size={26} color={"#000"} />
                            </TouchableOpacity>
                            //: null
                    }

                    {
                        this.props.settings.language_enabled ?
                            <TouchableOpacity
                                onPress={() => this.navigateToScreen("ManageLanguageScreen")}
                                style={styles.cardContact}>
                                <View style={styles.leftContact}>
                                    <MaterialIcons style={styles.shield} name="language" size={25} color={"#000"} />
                                    <Text style={{ color: "#000" }}>{strings("config.manage_language")}</Text>
                                </View>
                                <Icons name="right" size={26} color={"#000"} />
                            </TouchableOpacity>
                            : null
                    }

                    {
                        this.props.settings.emergency_contacts_enabled ?
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('EmergencyContactScreen')}
                                style={styles.cardContact}>
                                <View style={styles.leftContact}>
                                    <Image source={image.shield} resizeMode='contain' style={styles.shield} />
                                    <Text style={{ color: "#000" }}>{strings("config.manage")}</Text>
                                </View>
                                <Icons name="right" size={26} color={"#000"} />
                            </TouchableOpacity>
                            : null
                    }

                    {
                        (this.props.settings.is_app_select_theme_enabled && constants.APP_THEME_ENABLED) &&
                        <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.navigate('ThemeSelectorScreen', {
                                    url: constants.BASE_URL,
                                    is_register: false,
                                    type: 'provider',
                                    id: this.props.providerProfile._id,
                                    token: this.props.providerProfile._token,
                                    navigateAfterConfirm: 'ConfigScreen'
                                })
                            }
                            style={styles.cardContact}
                        >
                            <View style={styles.leftContact}>
                                <Icon name="paint-brush" type="font-awesome" size={25} color={"#000"} style={styles.shield} />
                                <Text style={{ color: "#000" }}>{strings("config.select_theme")}</Text>
                            </View>

                            <Icons name="right" size={26} color={"#000"} />
                        </TouchableOpacity>
                    }

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('DestinationScreen')}
                        style={styles.cardContact}>
                        <View style={styles.leftContact}>
                            <Icon name="location-arrow" type="font-awesome" size={25} color={"#000"} style={styles.shield} />
                            <Text style={{ color: "#000" }}>{strings("config.destination")}</Text>
                        </View>

                        <Icons name="right" size={26} color={"#000"} />
                    </TouchableOpacity>

                    {/* Removido botao formas de pagamento e detalhes de assinatura
                      isso não é usado, é algo relacionado a assinatura de pagamento
                        this.props.settings.is_register_payment_screen_enabled &&
                        <>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('SubscriptionScreen', {
                                    routeBack: 'ConfigScreenLocal',
                                    is_change: false,
                                    provider: this.props.providerProfile,
                                    route: constants.BASE_URL,
			                        themeColor: BootstrapColors.primary,
			                        buttonTextColor: textButton,
			                        routeAPI : constants.API_VERSION,
			                        isContainerPaymentType: true,
                                    checkedPaymentForm: false

                                })}
                                style={styles.cardContact}
                            >
                                <View style={styles.leftContact}>
                                    <Icon name="pencil" type="font-awesome" size={25} color={"#000"} style={styles.shield} />
                                    <Text style={{ color: "#000" }}>
                                        {strings('subscription.paymentForms')}
                                    </Text>
                                </View>
                                <Icons name="right" size={26} color={"#000"} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('SubscriptionDetailsScreen', {
                                        provider: this.props.providerProfile,
                                        route: constants.BASE_URL,
                                        routeAPI: constants.API_VERSION,
                                        routeBack: 'ConfigScreenLocal',
                                        isContainerPaymentType: true,
                                    })}
                                    style={styles.cardContact}
                                >
                                <View style={styles.leftContact}>
                                    <Icons name="wallet" size={25} color={"#000"} style={styles.shield} />
                                    <Text style={{ color: "#000" }}>
                                        {strings('subscription.subscriptionDetails')}
                                    </Text>
                                </View>
                                <Icons name="right" size={26} color={"#000"} />
                            </TouchableOpacity>
                        </>
                    */}
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { settings } = state.settingsReducer
    const { providerProfile } = state.providerProfile;

    return { settings, providerProfile };
};


const mapDispatchToProps = dispatch => {
    return {

    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfigScreen);
