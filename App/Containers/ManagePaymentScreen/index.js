// Modules
import React, { Component } from 'react';
import PaymentReceive from 'react-native-finance/src/PaymentReceive';
import { connect } from 'react-redux';

// Util
import * as constants from "../../Util/Constants";
class ManagePaymentScreen extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
          <PaymentReceive
            id={this.props.providerProfile._id}
            token={this.props.providerProfile._token}
            navigation={this.props.navigation}
          />
        )
    }
}

const mapStateToProps = state => {
    const { settings, payment_nomenclatures } = state.settingsReducer
    const { providerProfile } = state.providerProfile;

    return { settings, providerProfile, payment_nomenclatures };
};


const mapDispatchToProps = dispatch => {
    return {};
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManagePaymentScreen);
