// Modules
import React, { Component } from 'react';
import {
  View,
  Text,
  BackHandler,
  Alert,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import IconCheck from 'react-native-vector-icons/Feather';

// Components
import DefaultHeader from '../../Components/DefaultHeader';

// Locales
import { strings } from "../../Locales/i18n";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";
import {handlerException} from '../../Services/Exception';

// Themes
import { Images } from "../../Themes";

// Util
import * as parse from "../../Util/Parse";

// Styles
import styles from './styles';

class SubscriptionFinishScreen extends Component {
    constructor(props) {
        super(props);

        this.arrayIconsType = {};
        this.arrayIconsType["visa"] = Images.icon_ub_creditcard_visa;
        this.arrayIconsType["mastercard"] = Images.icon_ub_creditcard_mastercard;
        this.arrayIconsType["master"] = Images.icon_ub_creditcard_mastercard;
        this.arrayIconsType["amex"] = Images.icon_ub_creditcard_amex;
        this.arrayIconsType["diners"] = Images.icon_ub_creditcard_diners;
        this.arrayIconsType["discover"] = Images.icon_ub_creditcard_discover;
        this.arrayIconsType["jcb"] = Images.icon_ub_creditcard_jcb;
        this.arrayIconsType["terracard"] = Images.terra_card;

        this.apiProvider = new ProviderApi();
        this.state = {
            isLoading: false,
            loading_message: strings("load.Loading"),
            item: this.props.navigation.state.params.item,
            charge_type: this.props.navigation.state.params.type,
            cards: [],
            selectedCard: null,
            screen: this.props.navigation.state.params.screen,
            is_change: this.props.navigation.state.params.is_change
        }

        this.willFocus = this.props.navigation.addListener("willFocus", () => {
            this.listCards();
        });
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack()
            return true
        });
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    /**
     * Api to list available cards
     * @return {void}
     */
    listCards() {
        this.apiProvider.listCards(
            this.props.providerProfile._id,
            this.props.providerProfile._token
        ).then(response => {

            const { data } = response;
            if (data.success) {
                const cards = data.cards;
                this.setState({
                    cards: cards,
                    selectedCard: cards.length > 0 ? cards[0].id : null
                });
            }
        }).catch(error => {
          handlerException('SubscriptionFinishScreen.listCard', error);
        })
    }

    /**
     * Handle selected card
     * @return {void}
     */
    onSelectedCard(id) {
        this.setState({
            selectedCard: id
        });
    }

    /**
     * Handle success button press
     * @return {void}
     */
    handleSuccessButton() {
        const { navigate } = this.props.navigation;

        if (this.state.screen == 'RegisterBankStepScreen') {
            navigate('RegisterFinishedScreen');
        } else {
            navigate('ConfigScreen');
        }
    }

    /**
     * Api to submit new subscription
     * @return {void}
     */
    newSubscriptionPlan() {
        this.setState({
            isLoading: true
        });

        this.apiProvider.newSubscriptionPlan(
            this.props.providerProfile._id,
            this.props.providerProfile._token,
            this.state.charge_type,
            this.state.item.id,
            this.state.selectedCard,
            this.state.is_change
        ).then(response => {
            this.setState({
                isLoading: false
            });

            const { data } = response;
            if (parse.isSuccess(data)) {
                Alert.alert(
                    '',
                    strings('subscription.successText'),
                    [
                        {
                            text: 'Ok',
                            onPress: () => this.handleSuccessButton()
                        }
                    ],
                    { cancelable: false }
                );
            }
        }).catch(error => {
            this.setState({
                isLoading: true
            });
            handlerException('SubscriptionFinishScreen.newSubscriptionPlan', error);
          });
    }

    /**
     * Api to confirm new subscription
     * @return {void}
     */
    alertConfirmSubscription() {
        Alert.alert(
            '',
            strings('subscription.confirmText'),
            [
                {
                    text: strings("general.no_tinny"),
                    onPress: () => function () { },
                    style: "cancel"
                },
                {
                    text: strings("general.yes_tinny"),
                    onPress: () => this.newSubscriptionPlan()
                }
            ],
            { cancelable: true }
        );
    }

    render() {
        return (
            <View style={styles.parentContainer}>
              <DefaultHeader
                loading={this.state.isLoading}
                loadingMsg={this.state.loading_message}
                btnBack={true}
                btnBackListener={() => this.props.navigation.goBack()}
                title={strings('subscription.checkoutSubscription')}
              />

                <View
                    style={styles.containerDetails}
                >
                    <View>

                        <View style={styles.contentDetails}>
                            <Text style={styles.planName}>{this.state.item.name}</Text>

                            <View
                                style={styles.textContainer}
                            >
                                <Text style={styles.planDetails}>
                                    {strings('subscription.period')} {'\n'}
                                    <Text style={styles.fontBold}>
                                        {this.state.item.period} {strings('subscription.days')}
                                    </Text>
                                </Text>

                                <Text style={styles.planDetails}>
                                    {strings('subscription.value')} {'\n'}
                                    <Text style={styles.fontBold}>
                                        {this.state.item.plan_price}
                                    </Text>
                                </Text>

                            </View>
                            <Text style={styles.planDetails}>
                                {strings('subscription.paymentForm')} {'\n'}
                                <Text style={styles.fontBold}>
                                    { this.state.charge_type == 'billet' ? 'Boleto' : 'Cartão de crédito' }
                                </Text>
                            </Text>

                        </View>

                        {
                            this.state.charge_type != 'billet' &&
                            <View>
                                {
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('AddCardScreen')}
                                    >
                                        <Text style={styles.addCard}>
                                            {strings('subscription.addCard')}
                                        </Text>
                                    </TouchableOpacity>
                                }
                                <FlatList
                                    style={{ marginBottom: 30 }}
                                    data={this.state.cards}
                                    renderItem={({item}) => (
                                        <TouchableOpacity
                                            style={styles.listTypes}
                                            onPress={() => this.onSelectedCard(item.id)}
                                        >
                                            <View style={{ flex: 0.2 }}>
                                                <Image
                                                    source={this.arrayIconsType[item.card_type]}
                                                    style={styles.cardIcon} />
                                            </View>
                                            <View style={{ flex: 0.7 }}>
                                                <Text>**** **** **** { item.last_four }</Text>
                                            </View>
                                            {
                                                this.state.selectedCard == item.id &&
                                                <View style={styles.iconCheck}>
                                                    <IconCheck name="check" size={18} color="#ffffff" />
                                                </View>
                                            }

                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => `${index}`}
                                />
                            </View>
                        }
                    </View>

                    <View
                        style={styles.nextButton}
                    >
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => this.alertConfirmSubscription()}
                        >
                            <Text style={styles.nextTxt}>
                                {strings('subscription.confirm')}
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

    return {
        providerProfile
    };
};


const mapDispatchToProps = dispatch => {
    return {};
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubscriptionFinishScreen);
