// Modules
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from "react-native";
import Modal from 'react-native-modal';
import Material from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native-gesture-handler';

// Assets
import Images from '../../Assets/Images/Payment'

// Locales
import { strings } from '../../Locales/i18n';
class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            methodPayment: [
                {
                    id: 1,
                    type: this.props.payment_nomenclatures['name_payment_money'] == ""
						? strings("payment.money")
						: this.props.payment_nomenclatures['name_payment_money'],
                    icon: Images.icon_money
                },
                {
                    id: 2,
                    type: this.props.payment_nomenclatures['name_payment_card'] == ""
						? strings("payment.card")
						: this.props.payment_nomenclatures['name_payment_card'],
                    icon: Images.icon_card
                },
                {
                    id: 3,
                    type: this.props.payment_nomenclatures['name_payment_machine'] == ""
						? strings("payment.machine")
						: this.props.payment_nomenclatures['name_payment_machine'],
                    icon: Images.icon_machine
                },
                {
                    id: 4,
                    type: this.props.payment_nomenclatures['name_payment_crypt'] == ""
						? strings("payment.cryptocurrency")
						: this.props.payment_nomenclatures['name_payment_crypt'],
                    icon: Images.icon_cryptocurrency
                },
                {
                    id: 5,
                    type: this.props.payment_nomenclatures['name_payment_prepaid'] == ""
						? strings("payment.user_association")
						: this.props.payment_nomenclatures['name_payment_prepaid'],
                    icon: Images.icon_balance
                },
                {
                    id: 6,
                    type: this.props.payment_nomenclatures['name_payment_debitCard'] == ""
						? strings("payment.card_debit")
						: this.props.payment_nomenclatures['name_payment_debitCard'],
                    icon: Images.icon_card
                },
                {
                    id: 7,
                    type: this.props.payment_nomenclatures['name_payment_balance'] == ""
						? strings("payment.balance")
						: this.props.payment_nomenclatures['name_payment_balance'],
                    icon: Images.icon_balance
                },
                {
                    id: 8,
                    type: this.props.payment_nomenclatures['name_payment_billing'] == ""
					? strings("payment.billing")
					: this.props.payment_nomenclatures['name_payment_billing'],
                    icon: Images.icon_balance
                },
                {
                    id: 9,
                    type: !this.props.payment_nomenclatures['name_payment_gateway_pix']
					? strings("payment.pix")
					: this.props.payment_nomenclatures['name_payment_gateway_pix'],
                    icon: Images.icon_pix
                },
                {
                    id: 10,
                    type: !this.props.payment_nomenclatures['name_payment_direct_pix']
					? strings("payment.direct_pix")
					: this.props.payment_nomenclatures['name_payment_direct_pix'],
                    icon: Images.icon_pix
                }
            ]
        }
    }


    render() {
        return (
            this.state.methodPayment.map((method, id) => {
                if (method.id == this.props.id) {
                    return (
                        <View key={id}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                            }}>
                                <View style={styles.showTypePayment}>
                                    <Text style={styles.showTypePaymentText}>{method.type}</Text>
                                    <Image resizeMode='contain' style={styles.showTypePaymentTextImage} source={method.icon} />
                                </View>
                            </View>


                            {
                                method.id == 4 && this.props.qrCode != null && (
                                    <>
                                        <TouchableOpacity style={
                                            {
                                                marginTop: 20,
                                                padding: 10,
                                                backgroundColor: '#FFF',
                                                borderColor: 'blue',
                                                borderRadius: 5,
                                                alignSelf: 'center',
                                                borderWidth: 0.5
                                            }
                                        } onPress={() => this.setState({ openModal: true })}>
                                            <Text style={styles.qrCodeText}>Gerar QR CODE</Text>
                                        </TouchableOpacity>

                                        <Modal isVisible={this.state.openModal} useNativeDriver>
                                            <View style={{ height: '70%', width: '100%', backgroundColor: '#FFF' }}>
                                                <Material size={30} style={{ right: 0, position: 'absolute', padding: 5 }} name='cancel' color='#000' onPress={() => this.setState({ openModal: false })} />
                                                <View style={{ marginHorizontal: 10, margin: 22, elevation: 2 }}>
                                                    <Image style={{ height: '100%', width: '100%', }} resizeMode='contain' source={{ uri: this.props.qrCode }} />
                                                </View>
                                            </View>
                                        </Modal>
                                    </>
                                )
                            }
                        </View>
                    )
                }
            })
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white'
    },
    showTypePayment: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    showTypePaymentText: {
        marginRight: 5,
        fontWeight: 'bold',
		fontSize: 16
    },
    showTypePaymentTextImage: {
        height: 25,
        width: 40,
    },
    qrCodeText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

export default Payment;
