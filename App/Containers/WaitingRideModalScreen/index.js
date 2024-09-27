import React from "react";
import { connect } from 'react-redux';
import {
    Text,
    View,
    BackHandler,
	TouchableOpacity,
	Dimensions,
	Alert
  } from "react-native";
import { strings } from "../../Locales/i18n";

import ProviderApi from "../../Services/Api/ProviderApi";

import { waitingRequestClear } from "../../Store/actions/request"

import { PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel";
import DefaultHeader from "../../Components/DefaultHeader";
const btnWidth = Dimensions.get('window').width - 25;


class WaitingRideModalScreen extends React.Component {
    constructor(props) {
        super(props);

		this.api = new ProviderApi();

    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack()
            return true
        })
    }

	cancelWaitingRequest() {
		Alert.alert(
			strings("ServiceUserBoardScreen.cancel_request_title"),
			null,
			[
			  {
				text: strings("general.no"),
				onPress: () => function() {},
				style: "cancel"
			  },
			  {
				text: strings("general.yes"),
				onPress: () => this.cancelRequest()
			  }
			],
			{ cancelable: false }
		  );
	}

	cancelRequest() {
		const cancelRequest = this.api.CancelRequestByProvider(
			this.props.providerProfile._id,
			this.props.providerProfile._token,
			this.props.waiting_request.request_id
		);

		cancelRequest.then(response => {
			const data = response.data;

			if (!data.success)
				return;

			this.props.navigation.goBack();
			this.props.onWaitingRequestClear();
		});
	}

    render() {
        return (
			this.props.waiting_request && (
				<View style={{ flex: 1 }}>
          <DefaultHeader
            btnBack={true}
            btnBackListener={() => this.props.navigation.goBack()}
            title={strings('requests.waiting_ride_title')}
          />

					<View
						style={{ paddingHorizontal: 25 }}
					>
						<View
							style={{ marginBottom: 15 }}
						>
							<Text
								style={{ fontSize: 16 }}
							>
								{strings('requests.waiting_ride_user')} {this.props.waiting_user.full_name}
							</Text>
						</View>

						<Text style={{ fontSize: 16 }}>
							{ this.props.waiting_request.source }
						</Text>

						<Text
							style={{ textAlign: 'center' }}
						>
							-
						</Text>

						<Text style={{ fontSize: 16 }}>
							{ this.props.waiting_request.destination }
						</Text>

						<View
							style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}
						>
							<Text style={{ fontSize: 16 }}>
								{ this.props.waiting_request.estimate_time_to_source }
							</Text>
							<Text style={{ fontSize: 16 }}>
								{ this.props.waiting_request.estimate_distance_to_source }
							</Text>
						</View>
					</View>

					<View
						style={{
							alignContent: "center",
							alignItems: "center",
							marginVertical: 20
						}}
					>
						<TouchableOpacity
							onPress={() => this.cancelWaitingRequest()}
							style={{
								backgroundColor: PrimaryButton,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 3,
								height: 50,
								width: btnWidth,
								marginHorizontal: 25
							}}
						>
							<Text
								style={{
									color: "white",
									fontSize: 18,
									fontWeight: "bold",
								}}
							>
								{strings("requests.cancel")}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
        );
    }
}

const mapStateToProps = state => {
    const { waiting_request, waiting_user } = state.request;
	const { providerProfile } = state.providerProfile;

    return {
        waiting_request,
        waiting_user,
		providerProfile
    };
};


const mapDispatchToProps = dispatch => {
    return {
		onWaitingRequestClear: () => dispatch(waitingRequestClear()),
	};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WaitingRideModalScreen);
