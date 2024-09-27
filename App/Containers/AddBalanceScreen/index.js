// Modules
import React, {Component} from 'react';
import { BackHandler } from 'react-native';
import {connect} from 'react-redux';
import AddBalanceScreenLib from "react-native-finance/src/AddBalanceScreen";

import GLOBAL from 'react-native-finance/src/Functions/Global';

class AddBalanceScreen extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
    GLOBAL.id = this.props.providerProfile._id;
    GLOBAL.token = this.props.providerProfile._token;
    GLOBAL.ledger_id = this.props.providerProfile._ledger_id;

		this.backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				this.props.navigation.goBack();
				return true;
			}
		);
	}

	componentWillUnmount() {
		this.backHandler.remove();
	}

	render() {
		return (
      <AddBalanceScreenLib
        id={this.props.providerProfile._id}
        token={this.props.providerProfile._token}
        ledger_id={this.props.providerProfile._ledger_id}
        navigation={this.props.navigation}
      />
    );
	}
}

const mapStateToProps = (state) => {
	const {settings} = state.settingsReducer;
	const {providerProfile} = state.providerProfile;
	return {settings, providerProfile};
};

const mapDispatchToProps = () => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBalanceScreen);
