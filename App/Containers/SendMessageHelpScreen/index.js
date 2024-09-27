// Modules
import React, { Component } from 'react'
import { View, BackHandler } from 'react-native'
import Toast from "react-native-root-toast"
import SendMessageHelp from 'react-native-send-help-message'
import { connect } from "react-redux"

// Components
import DefaultHeader from '../../Components/DefaultHeader'

// Locales
import { strings } from "../../Locales/i18n"

// Themes
import { PrimaryButton, WBASE_URL } from "../../Themes/WhiteLabelTheme/WhiteLabel"

// Util
import * as parse from "../../Util/Parse"
import * as constants from "../../Util/Constants";

// Styles
import styles from "./styles"
class SendMessageHelpScreen extends Component {
    constructor(props) {
        super(props)
    }


    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack()
            return true
        })
    }


    componentWillUnmount() {
        this.backHandler.remove()
    }


    returnValue = (value) => {
        if (value.success) {
            parse.showToast(strings('requests.messageSent'), Toast.durations.SHORT)
        } else {
            parse.showToast(strings("error.try_again"), Toast.durations.SHORT)
        }
    }


    returnEmptyMessage = () => {
        parse.showToast(strings('requests.fieldMessage'), Toast.durations.SHORT)
    }


    render() {
        const urlRequest = WBASE_URL + constants.SEND_HELP
        return (
            <View style={styles.container}>
                <DefaultHeader
                  btnBack={true}
                  btnBackListener={() => this.props.navigation.goBack()}
                  title={strings('checkingAccount.help')}
                />

                <View style={styles.body}>
                    <SendMessageHelp
                        providerId={this.props.provider._id}
                        providerToken={this.props.provider._token}
                        requestId={this.props.myRequestsView.id}
                        route={urlRequest}
                        title={strings('requests.insertMessage')}
                        textButtonSend={strings('general.send')}
                        buttonColor={PrimaryButton}
                        returnRequest={this.returnValue.bind(this)}
                        returnEmptyMessage={this.returnEmptyMessage.bind()}
                    />
                </View>
            </View>
        )
    }
}


const mapStateToProps = state => (
    {
        myRequestsView: state.requestsReducer.myRequestsView,
        provider: state.providerReducer.provider
    }
)

const mapDispatchToProps = dispatch => (
    {}
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SendMessageHelpScreen)
