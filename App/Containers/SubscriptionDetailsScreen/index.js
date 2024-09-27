// Modules
import React, { Component } from 'react';
import {
  View,
  Text,
  BackHandler,
  Linking,
  TouchableOpacity,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import Icon from "react-native-vector-icons/Feather";

// Components
import DefaultHeader from '../../Components/DefaultHeader';

// Locales
import { strings } from "../../Locales/i18n";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";
import {handlerException} from '../../Services/Exception';

// Util
import * as parse from "../../Util/Parse";

// Styles
import styles from './style';

class SubscriptionDetailsScreen extends Component {
    constructor(props) {
        super(props);

        this.apiProvider = new ProviderApi();
        this.state = {
            signature: {},
            status: ''
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack()
            return true
        })

        this.subscriptionDetails();
    }

    subscriptionDetails() {
        this.apiProvider.subscriptionDetails(
            this.props.providerProfile._id,
            this.props.providerProfile._token
        ).then(response => {

            const { data } = response;

            if (data.is_cancelled == 1) {
                data.status = strings('subscription.cancelled');
            } else if (data.activity == 0) {
                data.status = strings('subscription.inactive');
            } else {
                data.status = strings('subscription.active');
            }

            this.setState({
                signature: data
            });
        }).catch(error => {
          handlerException('SubscriptionDetailsScreen.subscriptionDetails', error);
        })
    }

    alertCancelSubscription() {
        Alert.alert(
            strings('subscription.cancel_alert_title'),
            strings('subscription.cancel_alert') + this.state.signature.good_cancel_date,
            [
                {
                    text: strings("general.no_tinny"),
                    onPress: () => function () { },
                    style: "cancel"
                },
                {
                    text: strings("general.yes_tinny"),
                    onPress: () => this.cancelSubscription()
                }
            ],
            { cancelable: true }
        );
    }

    cancelSubscription() {
        this.apiProvider.cancelSubscription(
            this.props.providerProfile._id,
            this.props.providerProfile._token,
            this.state.signature.id
        ).then(response => {
            const { data } = response;

            let signature = this.state.signature;

            if (parse.isSuccess(data)) {
                signature.status = strings('subscription.cancelled');
                this.setState({
                    signature: signature
                });
            }

        }).catch(error => {
          handlerException('SubscriptionDetailsScreen.cancelSubscription', error);
        });
    }

    navigate() {
        this.props.navigation.navigate('SubscriptionScreen', {
            screen: 'SubscriptionDetailsScreen',
            is_change: true
        });
    }

    handleClickBillet() {
        Linking.openURL(this.state.signature.billet_link);
    }

    render() {
        return (
            <View style={styles.parentContainer}>
              <DefaultHeader
                btnBack={true}
                btnBackListener={() => this.props.navigation.goBack()}
                title={strings('subscription.subscriptionDetails')}
              />

                {
                    this.state.signature.paid_status
                    ?
                    <View
                        style={styles.containerDetails}
                    >
                        <View style={styles.detailsBox}>
                            <Text style={[
                                this.state.signature.paid_status != 'paid' ?
                                styles.statusOpen :
                                styles.statusPaid
                            ]}>
                                {
                                    this.state.signature.paid_status != 'paid' ?
                                    strings('subscription.open') :
                                    strings('subscription.paid')
                                }
                            </Text>

                            <Text style={styles.textDetailsBox}>{this.state.signature.plan_name}</Text>

                            <Text style={styles.planDetails}>
                                {strings('subscription.due')} {"\n"}
                                <Text style={styles.fontBold}>
                                    { this.state.signature.next_expiration}
                                </Text>
                            </Text>
                            <Text style={styles.planDetails}>
                                Status: {"\n"}
                                <Text style={styles.fontBold}>
                                    { this.state.signature.status}
                                </Text>
                            </Text>

                            {
                                this.state.signature.billet_link &&
                                <View style={styles.billetView}>
                                    <Text style={styles.planDetails}>
                                        {strings('subscription.accessBillet')}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => this.handleClickBillet()}
                                    >
                                        <Icon name="external-link" size={28} color={"#000"} />
                                    </TouchableOpacity>
                                </View>
                            }

                            <View
                                style={styles.optionsView}
                            >
                                <TouchableOpacity
                                    onPress={() => this.alertCancelSubscription()}
                                >
                                    <Text style={styles.fontBold}>
                                        {strings('subscription.cancel')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => this.navigate()}
                                >
                                    <Text style={styles.fontBold}>
                                        {strings('subscription.change')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    :
                    <View style={styles.noSubscription}>
                        <Text>
                            {strings('subscription.no_subscription')}
                        </Text>
                    </View>
                }
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
)(SubscriptionDetailsScreen);
