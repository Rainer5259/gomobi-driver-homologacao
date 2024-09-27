// Modules
import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import Toast from 'react-native-root-toast';
import WithdrawalsReport from 'react-native-withdrawals';
import { connect } from 'react-redux';

// Locales
import i18n from '../../Locales/i18n';

// Services
import ProviderApi from '../../Services/Api/ProviderApi';

// Store
import { getProviderBankAccount } from '../../Store/actions/actionProvider';

// Themes
import { PrimaryButton } from '../../Themes/WhiteLabelTheme/WhiteLabel';

// Util
import * as parse from '../../Util/Parse';
import * as constants from '../../Util/Constants';

class TransactionsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            urlReport: '',
            urlAdd: '',
            withdrawSettings: '',
        };
        this.apiProvider = new ProviderApi();

        this.willFocus = this.props.navigation.addListener('willFocus', () => {
            this.getBankAccount();
        });
    }

    async getBankAccount() {
        const id = this.props.provider._id;
        const token = this.props.provider._token;
        await this.props.getProviderBankAccount(id, token).catch((error) => {
            parse.showToast(error.message, Toast.durations.SHORT);
        });
    }

    async componentDidMount() {
        this.getBankAccount();
        this.backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                this.props.navigation.goBack();
                return true;
            }
        );

        var baseUrl = this.getFormattedUrl();
        this.setState({
            urlReport: baseUrl + '/libs/withdrawals/report',
            urlAdd: baseUrl + '/libs/withdrawals/add',
            withdrawSettings: baseUrl + '/libs/withdrawals/settings',
        });
    }

    navigateBankScreen() {
        this.props.navigation.navigate('EditBankStepScreen', {
            returnScreen: 'TransactionsScreen',
        });
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    getFormattedUrl() {
        var fullUrl = constants.BASE_URL;

        var newUrl = fullUrl.replace('/api/v1', '');

        return newUrl;
    }

    onClose() {
        this.props.navigation.goBack();
    }

    onWithdrawAdded(status, msg) {
        parse.showToast(msg, Toast.durations.LONG);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.props.provider._id &&
                this.props.provider._token &&
                this.state.urlReport &&
                this.state.urlAdd &&
                this.state.withdrawSettings ? (
                    <WithdrawalsReport
                        providerId={this.props.provider._id}
                        providerToken={this.props.provider._token}
                        lang={i18n.locale}
                        urlReport={this.state.urlReport}
                        urlAdd={this.state.urlAdd}
                        urlSettings={this.state.withdrawSettings}
                        onClose={this.onClose.bind(this)}
                        onWithdrawAdded={this.onWithdrawAdded.bind(this)}
                        buttonColor={PrimaryButton}
                        isBankAccount={
                            this.props.bankAccountProvider.account
                                ? true
                                : false
                        }
                        navigateBankScreen={() => this.navigateBankScreen()}
                    />
                ) : null}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    provider: state.providerProfile.providerProfile,
    bankAccountProvider: state.providerReducer.bankAccountProvider,
});

const mapDispatchToProps = (dispatch) => ({
    getProviderBankAccount: (id, token) =>
        dispatch(getProviderBankAccount(id, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsScreen);
