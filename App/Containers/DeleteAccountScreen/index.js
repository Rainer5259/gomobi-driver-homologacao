// Modules
import React, { Component } from 'react';
import DeleteAccount from 'react-native-delete-account/src/pages/DeleteAccount';
import { connect } from 'react-redux';

class DeleteAccountScreen extends Component {
    constructor(props) {
        super(props)

        const { url, id, token, logout_function } =
        this.props.navigation.state.params;

        this.state = {
            url,
            id,
            token,
            logout_function,
          };
    }

    render() {
        return(
        <DeleteAccount
            url={this.state.url}
            id={this.state.id}
            token={this.state.token}
            logout_function={this.state.logout_function}
            navigation={this.props.navigation}
          />
        )
    }
}

const mapStateToProps = state => {
    const { providerProfile } = state.providerProfile;

    return { providerProfile };
};


const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeleteAccountScreen);
