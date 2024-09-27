// Modules
import React, { Component } from "react";
import {
    View,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";

// Actions
import { permissionsAction } from "../../Actions/permissions.action";

// Components
import ShowInfoBeforeAction from "../../Components/ShowInfo";

// Locales
import { strings } from "../../Locales/i18n";

// Themes
import { WPROJECT_NAME } from '../../Themes/WhiteLabelTheme/WhiteLabel';
import images from "../../Themes/Images";

/**
 * Show info about sensitive data usage before permissions appearence
 */
class ProminentDisclosure extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * Function to test permission response granted and  navigate to next screen
     */
    async prominentDisclosureLocation() {
        granted = await permissionsAction.requestLocationPermission();
        if (granted) {
          const {handleConnectivityChange} = this.props.navigation.state.params
          NetInfo.addEventListener(handleConnectivityChange);
        }

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ShowInfoBeforeAction
                    title={strings("splash.prominentDisclosureTitle")}
                    subtitle={strings("splash.prominentDisclosureText", { app_name: WPROJECT_NAME })}
                    btntext={strings("splash.outBtn")}
                    image={images.free_map}
                    icon="map-marker-check-outline"
                    action={() => this.prominentDisclosureLocation()}
                />

            </View>

        )
    }
}

export default ProminentDisclosure;
