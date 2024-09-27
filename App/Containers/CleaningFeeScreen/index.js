// Modules
import React, { Component } from 'react'
import { View, TextInput, BackHandler, ScrollView, Alert } from 'react-native'
import Toast from "react-native-root-toast"
import { connect } from "react-redux"

// Components
import Button from '../../Components/RoundedButton'

// Locales
import { strings } from "../../Locales/i18n"

// Services
import ProviderApi from "../../Services/Api/ProviderApi"

// Util
import * as parse from "../../Util/Parse"


import styles from "./styles"
import DefaultHeader from '../../Components/DefaultHeader'

class CleaningFeeScreen extends Component {
    constructor(props) {
      super(props)
        this.api = new ProviderApi()
        this.state = {
            note: '',
            isLoading: false
        }
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

    /**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const { navigate } = this.props.navigation
		return navigate
	}

    notify() {
        if (!this.state.note) {
            parse.showToast(strings('requests.emptyCleaningReason'), Toast.durations.SHORT)
        } else {
            Alert.alert(
                `${strings("profileProvider.warning")}`,
                `${strings("requests.notifyCleaningFee")}`,
                [
                    {
                        text: `${strings("general.cancel")}`,
                        onPress: () => { },
                        style: 'cancel',
                    },
                    { text: `${strings("general.confirm")}`, onPress: () => this.sendCleaningFee() },
                ],
                { cancelable: false },
            )
        }
    }

    /**
     * sends the cleaning charge request
     */
    async sendCleaningFee() {
        this.setState({ isLoading: true })

        let userId = null

        if (this.props.myRequestsView.institution_user_id) {
            userId = this.props.myRequestsView.institution_user_id
        } else {
            userId = this.props.myRequestsView.user_id
        }

        try {
            let response = await this.api.SendCleaningFee(
                this.props.provider._id,
                this.props.provider._token,
                this.props.myRequestsView.id,
                userId,
                this.state.note
            )
            let responseJson = response.data

            if (parse.isSuccess(responseJson, this.returnConstNavigate()) == true) {
                this.setState({ isLoading: false })
                parse.showToast(strings('requests.sentCleaningFee'), Toast.durations.LONG)
                this.props.navigation.goBack()
            } else {
                this.setState({ isLoading: false })
                parse.showToast(strings("error.try_again"), Toast.durations.LONG)

            }
        } catch (error) {
            this.setState({ isLoading: false })
            parse.showToast(strings("error.try_again"), Toast.durations.LONG)

        }
    }

    render() {
        return (
          <View style={styles.container}>
            <DefaultHeader
              loading={this.state.isLoading}
              loadingMsg={strings("load.Sending")}
              btnBackListener={() => this.props.navigation.goBack()}
              title={strings('requests.cleaningFee')}
              subtitle={strings('requests.cleaningDescription')}
            />

                <ScrollView>
                    <View style={styles.body}>
                        <TextInput
                            placeholder={strings('general.placeholderTypeHere')}
                            style={styles.inputNote}
                            multiline
                            numberOfLines={4}
                            onChangeText={text => this.setState({ note: text })}
                            value={this.state.note}
                        />
                        <View marginTop={20}>
                          <Button
                            onPress={() => this.notify()}
                            text={strings('general.send')}
                          />
                        </View>
                    </View>
                </ScrollView>

            </View>
        )
    }
}


const mapStateToProps = state => (
    {
        myRequestsView: state.requestsReducer.myRequestsView,
        provider: state.providerProfile.providerProfile,
    }
)

const mapDispatchToProps = dispatch => (
    {}
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CleaningFeeScreen)
