import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

//Translate file
import { strings } from "../../Locales/i18n"

//Styles
import styles from "./styles"

//Images
import images from "../../Themes/WhiteLabelTheme/Images"

//Redux
import { connect } from "react-redux"

//Actions
import { resetRegister } from '../../Store/actions/actionRegister'
import { providerAction } from "../../Store/actions/providerProfile";


class RegisterFinishedScreen extends Component {

    finishRegister() {
        this.props.resetRegister();
        this.props.onProviderAction({
            _id: '',
            _token: '',
            _is_active: ''
        });
        this.props.navigation.navigate('LoginMainScreen')
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={images.register_success} style={styles.successImage} />
                <View style={styles.containerTitle}>
                    <Text style={styles.title}>{strings('register.finish_step')}</Text>
                    <Text style={styles.subTitle}>{strings('register.registerComplete')}</Text>
                </View>
                <TouchableOpacity style={styles.beginButton}
                    onPress={() => this.finishRegister()}>
                    <Text style={styles.beginText}>{strings('register.finish')}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


const mapStateToProps = state => (
    {}
)

const mapDispatchToProps = dispatch => (
    {
        resetRegister: () => dispatch(resetRegister()),
        onProviderAction: provider => dispatch(providerAction(provider))
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterFinishedScreen)
