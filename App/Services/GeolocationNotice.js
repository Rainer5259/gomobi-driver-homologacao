import React, { useState, useEffect } from "react";
import {
  GeolocationStatus,
  GeolocationService,
} from "react-native-geolocation-service";

// Services
import { WPROJECT_NAME } from "../Themes/WhiteLabelTheme/WhiteLabel";
import images from "../Themes/Images";
import { strings } from "../Locales/i18n";
import ProviderApi from "./Api/ProviderApi";

//Redux
import { changeCoordinatesProvider } from '../Store/actions/actionCoordinatesProvider';
import { gpsStatusChange } from "../Store/actions/ActionBgGeolocation";
import { useSelector, useDispatch } from "react-redux";

import { setAvailable } from "../Store/actions/providerProfile";

import RNProviderBubble from "react-native-provider-bubble";
import { BgLocationClear } from "./configBgLocation"

export default function GeolocationNotice() {
  const [providerApi] = useState(new ProviderApi());

  const dispatch = useDispatch();
  const profile = useSelector((state) => state.providerProfile.providerProfile);

  useEffect(() => {
    const loadProviderPosition = async () => {
     if(profile._id){
      GeolocationService.getCurrentLocation(
        (position) => {
          let latitude = position.coords.latitude
          let longitude = position.coords.longitude
          let region = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.00922 * 1.5,
            longitudeDelta: 0.00421 * 1.5
          };
          dispatch(changeCoordinatesProvider(region, latitude, longitude));
        },
        {
          text: strings("map_screen.active_gps_msg"),
          yes: strings("map_screen.active_gps"),
          no: strings("map_screen.running_out_of"),
        }
      );
     }
    };
    loadProviderPosition()
  }, []);

  const onEnableLocation = async () => {
    dispatch(gpsStatusChange(true));
    setProviderLocation()
  };

  const setProviderLocation = async () => {
    if(profile._id){
      GeolocationService.getCurrentLocation(
        (position) => {
          let latitude = position.coords.latitude
          let longitude = position.coords.longitude
          let region = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.00922 * 1.5,
            longitudeDelta: 0.00421 * 1.5
          };
          dispatch(changeCoordinatesProvider(region, latitude, longitude));
        },
        {
          text: strings("map_screen.active_gps_msg"),
          yes: strings("map_screen.active_gps"),
          no: strings("map_screen.running_out_of"),
        }
      );
     }
  };

  const onDisableLocation = async () => {
    dispatch(gpsStatusChange(false));
    await setProviderOffline();
    await disableBubble();
  };

  const onPressModalButton = async () => {
    GeolocationService.getCurrentLocation(() => {}, {
      text: strings("map_screen.active_gps_msg"),
      yes: strings("map_screen.active_gps"),
      no: strings("map_screen.running_out_of"),
    });
  };

  const onPressGoWithoutButton = async () => {};

  const setProviderOffline = async () => {
    const response = await providerApi.SetState(
      profile._id,
      profile._token,
      profile._latitude,
      profile._longitude,
      0
    );
    if (response.data.success) {
      dispatch(setAvailable(response.data.is_active));
    }
  };

  const disableBubble = async () => {
    RNProviderBubble.stopService().then(function (value) {});
    BgLocationClear();
  };

  return profile._id > 0 ? (
    <GeolocationStatus
      title={strings("permissionGeolocation.prominentDisclosureTitle")}
      subtitle={strings("permissionGeolocation.prominentDisclosureText", {
        app_name: WPROJECT_NAME,
      })}
      btntext={strings("permissionGeolocation.enable")}
      image={images.free_map}
      icon="map-marker-check-outline"
      onEnableLocation={() => onEnableLocation()}
      onDisableLocation={() => onDisableLocation()}
      onPressModalButton={() => onPressModalButton()}
      onPressGoWithoutButton={() => onPressGoWithoutButton()}
      showGoWithout={true}
      goWithoutText={strings("permissionGeolocation.go_without")}
    />
  ) : (
    <></>
  );
}
