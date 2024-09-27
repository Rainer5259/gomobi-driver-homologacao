// Modules
import React, { Component } from 'react';
import {
  View,
  Text,
  BackHandler,
  FlatList,
  TouchableOpacity
} from 'react-native';
import Toast from "react-native-root-toast";
import IconCheck from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { CheckBox } from 'react-native-elements';

// Components
import DefaultHeader from '../../Components/DefaultHeader';

// Locales
import { strings } from "../../Locales/i18n";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";
import {handlerException} from '../../Services/Exception';

// Util
import * as parse from "../../Util/Parse";
import * as constants from '../../Util/Constants';

// Styles
import styles from './styles';

class SubscriptionScreen extends Component {
    constructor(props) {
        super(props)
        this.apiProvider = new ProviderApi();
        this.state = {
            checkedPaymentForm: !this.props.navigation.state.params.is_change,
            checkedPaymentType: 'billet',
            selectedPlan: 0,
            plans: [],
            selectedPlan: {},
            screen: this.props.navigation.state.params.screen,
            is_change: this.props.navigation.state.params.is_change
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack();
            return true
        })

        this.getAvailablePlans();
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    /**
     * Api to get available plans
     * @return {void}
     */
    getAvailablePlans() {
        this.apiProvider.getAvailablePlans(
            this.props.providerProfile._id,
            this.props.providerProfile._token
        ).then(response => {
            const { data } = response;
            const plans = data.plans;
            this.setState({
                plans: plans,
                selectedPlan: plans.length > 0 ? plans[0] : {}
            });
        }).catch(error => {
          handlerException('SubscriptionScreen.getAvailablePlans', error);
        });
    }

    /**
     * Toggle payment form check box
     * @return {void}
     */
    handleTogglePaymentForm() {
        this.setState({
            checkedPaymentForm: !this.state.checkedPaymentForm
        });
    }

    /**
     * Toggle payment type check box
     * @return {void}
     */
    handleTogglePaymentType(type) {
        this.setState({
            checkedPaymentType: type
        });
    }

    /**
     * Toggle selected plan
     * @return {void}
     */
    handleSelectPlan(item) {
        parse.showToast(`${item.name} ${strings('subscription.selected')}`, Toast.durations.SHORT)
        this.setState({
            selectedPlan: item
        });
    }

    /**
     * Handle confirm button press
     * @return {void}
     */
    handleConfirmButton() {
        const { navigate } = this.props.navigation
        if (!this.state.checkedPaymentForm) {
            navigate(
                'SubscriptionFinishScreen', {
                    item: this.state.selectedPlan,
                    type: this.state.checkedPaymentType,
                    screen: this.state.screen,
                    is_change: this.state.is_change
                }
            );
        } else {
            if (this.state.screen == 'RegisterBankStepScreen') {

				if (this.props.settings.is_app_select_theme_enabled && constants.APP_THEME_ENABLED) {
					this.props.navigation.navigate('ThemeSelectorScreen', {
						url: constants.BASE_URL,
						is_register: true,
						type: 'provider',
						id: this.props.providerProfile._id,
						token: this.props.providerProfile._token,
						navigateAfterConfirm: 'RegisterFinishedScreen'
					});
				} else {
                    navigate('RegisterFinishedScreen');
                }

            } else {
                navigate('ConfigScreen');
            }
        }
    }

    render() {
        return (
            <View style={styles.parentContainer}>
              <DefaultHeader
                btnBack={true}
                btnBackListener={() => this.props.navigation.goBack()}
                title={strings('subscription.paymentForm')}
              />

                <View
                    style={styles.containerCheckBox}
                >
                    <View>
                        <CheckBox
                            title={strings('subscription.byService')}
                            checked={this.state.checkedPaymentForm}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            onPress={() => this.handleTogglePaymentForm()}
                            containerStyle={styles.checkBoxStyle}
                        />
                        <CheckBox
                            title={strings('subscription.bySubscription')}
                            checked={!this.state.checkedPaymentForm}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            onPress={() => this.handleTogglePaymentForm()}
                            containerStyle={styles.checkBoxStyle}
                        />
                    </View>

                    {
                        !this.state.checkedPaymentForm &&
                        <View style={{
                            flex: 1,
                            justifyContent: 'space-between'
                        }}>
                            <View style={styles.containerList}>
                                <Text
                                    style={styles.listPlanTitle}
                                >
                                    {strings('subscription.selectedAPlan')}
                                </Text>

                                <FlatList
                                    data={this.state.plans}
                                    keyExtractor={(x, i) => i.toString()}
                                    renderItem={({item}) => (
                                        <TouchableOpacity
                                            style={styles.listPlanItem}
                                            onPress={() => this.handleSelectPlan(item)}
                                        >
                                            <Text>{ item.name }</Text>
                                            {
                                                this.state.selectedPlan.id == item.id &&
                                                <View style={styles.iconCheck}>
                                                    <IconCheck name="check" size={18} color="#ffffff" />
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>

                            <View>

                                <View>
                                    <Text
                                        style={styles.selectPayment}
                                    >
                                        {strings("subscription.paymentType")}
                                    </Text>
                                    <CheckBox
                                        title={strings('subscription.billet')}
                                        checked={this.state.checkedPaymentType == 'billet'}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        onPress={() => this.handleTogglePaymentType('billet')}
                                        containerStyle={styles.checkBoxStyle}
                                    />
                                    <CheckBox
                                        title={strings('subscription.card')}
                                        checked={this.state.checkedPaymentType == 'card'}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        onPress={() => this.handleTogglePaymentType('card')}
                                        containerStyle={styles.checkBoxStyle}
                                    />
                                </View>
                            </View>
                        </View>
                    }

                    <View
                        style={styles.nextButton}
                    >
                        <TouchableOpacity
                            style={styles.nextBtn}
                            onPress={() => this.handleConfirmButton()}
                        >
                            <Text style={styles.nextTxt}>
                                {strings('subscription.next')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { providerProfile } = state.providerProfile;
	const { settings } = state.settingsReducer;

    return {
        providerProfile,
		settings
    };
};


const mapDispatchToProps = dispatch => {
    return {};
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubscriptionScreen);
