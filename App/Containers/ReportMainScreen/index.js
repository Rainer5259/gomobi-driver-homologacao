// Modules
import React, { Component } from 'react'
import { View, BackHandler } from 'react-native'
import Finance from "react-native-finance";
import { connect } from "react-redux";

// Services
import ProviderApi from "../../Services/Api/ProviderApi"
import {handlerException} from '../../Services/Exception';

// Store
import { changeFinancialHelp } from '../../Store/actions/actionHelp'

// Util
import * as constants from "../../Util/Constants";
import { currentLanguage } from '../../Locales/i18n';

class ReportMainScreen extends Component {
    constructor(props) {
    super(props);

		this.state = {
		};


		this.apiProvider = new ProviderApi()

	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack()
            return true
		});
		this.getFinancialHelp()
	}

	componentWillUnmount() {
		    if(this.backHandler){
      this.backHandler.remove();
    }
	}

	/**
     * Check request financial help data
     */
  async getFinancialHelp() {
    this.apiProvider.GetFinancialHelp().then(response => {
      let responseJson = response.data
      if (responseJson.success) {
        this.props.changeFinancialHelp(responseJson)
      }
    })
    .catch(error => handlerException('ReportMainScreen.getFinancialHelp', error));
  }

	render() {
		return (
			<View style={{flex: 1}}>
				{
          this.props.provider._id &&
          this.props.provider._token &&
					<Finance
            data={{
              id: this.props.provider._id,
              token: this.props.provider._token,
            }}
            lang={currentLanguage}
            navigation={this.props.navigation}
            removeCardUrl={constants.BASE_URL + constants.REMOVE_CARD_URL}
            isHelp={!!this.props.financialHelp.content}
						socket_url={constants.SOCKET_URL}
            />
        }
			</View>
		);
	}
}


const mapStateToProps = state => (
    {
		provider: state.providerProfile.providerProfile,
		financialHelp: state.helpReducer.financialHelp
    }
);

const mapDispatchToProps = dispatch => (
    {
		changeFinancialHelp: values => dispatch(changeFinancialHelp(values))
    }
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportMainScreen);
