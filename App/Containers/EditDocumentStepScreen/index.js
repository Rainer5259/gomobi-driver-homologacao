// Modules
import React, { Component } from 'react'
import { View, FlatList, ScrollView, Alert, SafeAreaView } from 'react-native'
import Toast from "react-native-root-toast"
import { connect } from "react-redux"
import { Divider } from 'react-native-elements'

// Components
import ListEditDocument from '../../Components/ListDocuments/edit'
import Button from '../../Components/RoundedButton'

// Locales
import { strings } from "../../Locales/i18n"

// Services
import ProviderApi from "../../Services/Api/ProviderApi"
import { handlerException } from '../../Services/Exception';

// Store
import { getDocs, changeProviderDocuments } from '../../Store/actions/actionProvider'

// Utils
import * as parse from "../../Util/Parse"

// Styles
import styles from "./styles"
import DefaultHeader from '../../Components/DefaultHeader'
class EditDocumentStepScreen extends Component {
	constructor() {
		super()
		this.state = {
			isLoading: false
		},
    this.api = new ProviderApi()
	}

	componentDidMount() {
		this.setState({ isLoading: true })
		this.api.RegisterGetDocs(this.props.provider._id)
			.then(response => {
				var responseJson = response.data
				if(responseJson.success) {
					let arrayAux = responseJson.documents
					this.props.getDocs(arrayAux)
				} else {
					let message = strings("error.try_again");
					if(responseJson.error) {
						message = responseJson.error;
					}
					parse.showToast(message, Toast.durations.LONG);
				}
				this.setState({ isLoading: false })
			})
			.catch(error => {
				parse.showToast(strings("error.try_again"), Toast.durations.LONG)
				this.setState({ isLoading: false })
				handlerException('EditDocumentStepScreen.RegisterGetDocs', error);
			})
	}

	notifyEditDoc() {
		Alert.alert(
			`${strings("profileProvider.doc_in_analyse")}`,
			`${strings("profileProvider.doc_in_analyse_text")}`,
			[
				{ text: `${strings("general.confirm")}`, onPress: () => this.props.navigation.navigate('EditProfileMainScreen')},
			],
			{ cancelable: false },
		)
	}

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <DefaultHeader
            loading={this.state.isLoading}
            loadingMsg={strings("register.creating-provider")}
            btnBackListener={() => this.props.navigation.goBack()}
            title={strings('profileProvider.sendDocuments')}
          />
          <View style={styles.containerTitle}>
            <FlatList
              style={{ marginBottom: 25 }}
              data={this.props.docs}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => `${item.id}`}
              renderItem={({ item }) => (
                <View>
                  <ListEditDocument key={item.id} {...item} />
                  <Divider style={styles.divider} />
                </View>
              )}>
            </FlatList>
            <Button
              onPress={() => this.notifyEditDoc()}
              text={strings("register.save")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}


const mapStateToProps = state => (
	{
		docs: state.providerReducer.docs,
		documentsProvider: state.providerReducer.documentsProvider,
		provider: state.providerProfile.providerProfile
	}
)

const mapDispatchToProps = dispatch => (
	{
		getDocs: values => dispatch(getDocs(values)),
		changeProviderDocuments: values => dispatch(changeProviderDocuments(values))
	}
)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditDocumentStepScreen)
