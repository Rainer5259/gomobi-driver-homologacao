// Modules
import React, { Component } from "react";
import {
    BackHandler,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StatusBar
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from "react-redux";



// Services
import {handlerException} from '../../Services/Exception';

// Themes
import { PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Util
import * as parse from "../../Util/Parse";

// Styles
import styles from "./styles";
class ReceiveMoneyScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestID: 0,
            valueReceived: 0
        };
    }

	/**
	 * Pt-BR
	 * Recupera todas as informações relevantes da tela anterior, como provider e request_id
	 *
	 * EN
	 * Retrieves all relevant information from the previous screen, such as provider and request_id
	 *
	 */
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            return true;
        });
        if (this.props.navigation.state.params) {
            this.provider = this.props.navigation.state.params.provider;
            request_id = this.props.navigation.state.params.request_id;
            this.setState({
                requestID: request_id,
            });

        }
    }

    /**
         * Navigate to another screen
         * @param {String} screen
         */
    navigateToScreen(screen) {
        try {
            const { navigate } = this.props.navigation;

            if (screen == "InvoiceScreen") {
                if (this.state.valueReceived !== 0) {
                    navigate(screen, {
                        provider: this.provider,
                        request_id: this.state.requestID,
                        valueReceived: this.state.valueReceived
                    });
                } else {
                    parse.showToast("Informe o valor que você recebeu", Toast.durations.LONG);
                }

            } else if (screen == 'InvoiceScreenMoney') {
                navigate(screen, {
                    provider: this.provider,
                    request_id: this.state.requestID
                });
            }

        } catch (error) {
          handlerException('ReceiveMoneyScreen.navigateToScreen', error);
        }

    }

    formattedPayment(value) {
        let formated = this.props.settings.generic_keywords_currency + value
        this.setState({ valueReceived: formated })
    }

    render() {
        return (
            <>
                <StatusBar backgroundColor={PrimaryButton} barStyle="light-content" />
                <View style={styles.container}>
                    <View style={styles.toobar}>
                        <Icon onPress={() => this.navigateToScreen('InvoiceScreenMoney')} name='close' size={20} color='#FFF' />
                        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 130 }}>Outro</Text>
                    </View>
                    <View style={styles.painel}>
                        <Text style={styles.what}>Quanto você recebeu em dinheiro?</Text>
                        <TextInput
                            keyboardType='numeric'
                            style={{ height: 40, borderColor: PrimaryButton, borderBottomWidth: 1 }}
                            onChangeText={value => this.formattedPayment(value)}
                            value={String(this.state.valueReceived)}
                        />
                        <View style={styles.footer}>
                            <TouchableOpacity onPress={() => this.navigateToScreen('InvoiceScreen')} style={styles.buttonPront}>
                                <Text style={styles.textButton}>Pronto</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
            </>
        );
    }
}

const mapStateToProps = state => {
    const { settings } =state.settingsReducer
    const { request, user, bill } = state.request;

    return { request, user, bill, settings };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReceiveMoneyScreen);
