// Modules
import React, { Component } from "react";
import {
    BackHandler,
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar
} from "react-native";
import { connect } from "react-redux";

// Themes
import { Images } from "../../Themes";

// Services
import {handlerException} from '../../Services/Exception';

// Styles
import styles from "./styles";


class InvoiceScreenMoney extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestID: 0,
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
            /*   this.props.navigation.goBack(); */
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

        /**
         * Navigate to another Screen.
         * First parameter: Screen to be initialized passed in "screen" variable
         * Second parameter: Information sent from CurrentScreen to NextScreen.
         * Use "this.props.navigation.state.params.loginBy" to use data on the other Screen
         */
        if (screen == "InvoiceScreen") {
            navigate(screen, {
                provider: this.provider,
                request_id: this.state.requestID,
                valueReceived: this.props.bill.estimated_total
            });
        } else if (screen == "ReceiveMoneyScreen") {
            navigate(screen);
        }
      } catch (error) {
        handlerException('InvoiceScreenMoney', error);
      }
    }

    render() {
        return (
            <>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <View style={styles.container}>
                    <Image source={Images.wallet_card} style={styles.image} />
                    <View style={styles.info}>
                        <Text style={styles.name}>{this.props.user.full_name}{' '} precisa pagar</Text>
                        <Text style={styles.valueRice}>{this.props.bill.estimated_total}</Text>
                    </View>

                    <Text style={styles.what}>Quanto você recebeu em dinheiro?</Text>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => this.navigateToScreen('InvoiceScreen')} style={styles.buttonRecib}>
                            <Text style={styles.valueRecib}>{this.props.bill.estimated_total}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.navigateToScreen('ReceiveMoneyScreen')} style={styles.buttonOutro}>
                            <Text style={styles.valueOutro}>Outro</Text>
                        </TouchableOpacity>
                    </View>
                </View >
            </>
        );
    }
}

const mapStateToProps = state => {
    const { request, user, bill } = state.request;
    return { request, user, bill };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoiceScreenMoney);
