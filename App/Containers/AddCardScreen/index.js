// Modules
import React, { Component } from "react"
import {
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { TextInputMask } from 'react-native-masked-text';

// Components
import DefaultHeader from "../../Components/DefaultHeader";

// Locales
import { strings } from "../../Locales/i18n";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";

// Utils
import * as parse from "../../Util/Parse";

// Styles
import styles from './styles';

class AddCardScreen extends Component {
    constructor(props) {
        super(props);

        this.apiProvider = new ProviderApi();
        this.state = {
            isLoading: false,
            loading_message: strings("load.Loading"),
            cardNumber: '',
            cardName: '',
            cardExpiration: '',
            cardCvv: '',
            nameError: false,
            cvvError: false,
            expirationError: false,
            numberError: false
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack()
            return true
        });
    }

    validationName() {
        if (this.state.cardName.length == 0) {
            this.setState({
                nameError: true
            });
            return true;
        }

        return false;
    }

    validationCvv() {
        if (this.state.cardCvv.length < 3) {
            this.setState({
                cvvError: true
            });
            return true;
        }

        return false;
    }

    validationExpiration() {
        try {
            if (this.state.cardExpiration.length == 0) {
                this.setState({
                    expirationError: true
                });
                return true;
            } else {
                const exp = this.state.cardExpiration.split('/');
                const month = parseInt(exp[0]);
                const year = parseInt(exp[1]);
                let today = new Date();

                if(month > 12 || month == 0 || year < today.getFullYear()) {
                    this.setState({
                        expirationError: true
                    });
                    return true;
                }

                return false;
            }
        } catch (error) {
            this.setState({
                expirationError: true
            });
            return true;
        }
    }

    validationNumber() {
        const number = this.state.cardNumber.split(' ').join('');

        if (number.length < 16) {
            this.setState({
                numberError: true
            });
            return true;
        }

        return false;
    }

    onPress() {
        const name = this.validationName();
        const cvv = this.validationCvv();
        const expiration = this.validationExpiration();
        const number = this.validationNumber();
        if (!name && !cvv && !expiration && !number) {
            this.addCard();
        }
    }

    addCard() {
        this.setState({
            isLoading: true
        });

        const exp = this.state.cardExpiration.split('/');
        const month = parseInt(exp[0]);
        const year = parseInt(exp[1]);

        this.apiProvider.addCard(
            this.props.providerProfile._id,
            this.props.providerProfile._token,
            this.state.cardName,
            this.state.cardNumber.split(' ').join(''),
            this.state.cardCvv,
            month,
            year
        ).then(response => {
            this.setState({
                isLoading: false
            });
            const { data } = response;

            if (parse.isSuccess(data)) {
                this.props.navigation.goBack();
            }
        }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
    }

    render() {
        return (
            <View style={styles.parentContainer}>
              <DefaultHeader
                loading={this.state.isLoading}
                loadingMsg={this.state.loading_message}
                btnBackListener={() => this.props.navigation.goBack()}
                title={strings('subscription.addCardTitle')}
              />

                <View
                    style={styles.container}
                >
                    <View>
                        <View
                            style={styles.marginBottom}
                        >
                            <Text style={styles.DefaultInputLabel}>
                                {strings('subscription.name')}
                            </Text>
                            <TextInput
                                value={this.state.cardName}
                                onChangeText={text => {
                                    this.setState({
                                        cardName: text
                                    })
                                }}
                                style={styles.DefaultInputStyle}
                                placeholder={strings('subscription.namePlaceholder')}
                                onFocus={() => this.setState({nameError: false})}
                            />
                            { this.state.nameError &&
                                <Text style={styles.ErrorLabel} >
                                    {strings('subscription.nameError')}
                                </Text>
                            }
                        </View>

                        <View
                            style={styles.marginBottom}
                        >
                            <Text style={styles.DefaultInputLabel}>
                                {strings('subscription.number')}
                            </Text>
                            <TextInputMask
                                placeholder={strings('subscription.numberPlaceholder')}
                                type={'custom'}
                                options={{
                                    mask: '9999 9999 9999 9999'
                                }}
                                value={this.state.cardNumber}
                                onChangeText={text => {
                                    this.setState({
                                        cardNumber: text
                                    })
                                }}
                                style={styles.DefaultInputStyle}
                                onFocus={() => this.setState({numberError: false})}
                            />
                            { this.state.numberError &&
                                <Text style={styles.ErrorLabel} >
                                    {strings('subscription.numberError')}
                                </Text>
                            }
                        </View>

                        <View
                            style={styles.container2}
                        >
                            <View
                                style={styles.container2Width}
                            >
                                <Text style={styles.DefaultInputLabel}>
                                    {strings('subscription.exp')}
                                </Text>
                                <TextInputMask
                                    placeholder='MM/AAAA'
                                    type={'custom'}
                                    options={{
                                        mask: '99/9999'
                                    }}
                                    value={this.state.cardExpiration}
                                    onChangeText={text => {
                                        this.setState({
                                            cardExpiration: text
                                        })
                                    }}
                                    style={styles.DefaultInputStyle}
                                    onFocus={() => this.setState({expirationError: false})}
                                />
                                { this.state.expirationError &&
                                    <Text style={styles.ErrorLabel} >
                                        {strings('subscription.expError')}
                                    </Text>
                                }
                            </View>
                            <View
                                style={styles.container2Width}
                            >
                                <Text style={styles.DefaultInputLabel}>
                                    {strings('subscription.cvv')}
                                </Text>
                                <TextInputMask
                                    placeholder='123'
                                    type={'custom'}
                                    options={{
                                        mask: '9999'
                                    }}
                                    value={this.state.cardCvv}
                                    onChangeText={text => {
                                        this.setState({
                                            cardCvv: text
                                        })
                                    }}
                                    onFocus={() => this.setState({cvvError: false})}
                                    style={styles.DefaultInputStyle}
                                />
                                { this.state.cvvError &&
                                    <Text style={styles.ErrorLabel} >
                                        {strings('subscription.cvvError')}
                                    </Text>
                                }
                            </View>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.ButtonStyle}
                            onPress={() => this.onPress()}
                        >
                            <Text
                                style={styles.BtnText}
                            >
                                {strings('subscription.save')}
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
)(AddCardScreen);
