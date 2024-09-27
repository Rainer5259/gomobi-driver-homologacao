// Modules
import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { strings } from "../../Locales/i18n";
import { debounce } from 'debounce';
import Icon from 'react-native-vector-icons/AntDesign';
//Utils
import * as parse from "../../Util/Parse";

const offsetWidth = 100;
const boxWidth = Dimensions.get('window').width - offsetWidth;

export default function GetPlaces({
  api,
  provider_id,
  token,
  lat,
  long,
  returnConstNavigate,
  chooseAutoComplete
}) {

  const [fullAddress, setFullAddress] = useState("");
  const [apiCount, setApiCount] = useState(0);
  const [placesArray, setPlacesArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clicker, setClicker] = useState("");

  const requestParams = { provider_id, token, lat, long }

  const handleDebounce = useCallback(
    debounce((address, requestParams) => handleAutocompleteData(address, requestParams), 1000)
    , []);



  /**
   * setState address & call handleAutocompleteData();
   * @param {string} address
   */
  function handleTextInputChange(address) {
    if (address > fullAddress) {
      handleDebounce(address, requestParams);
    }
    setFullAddress(address);

    if (address.length === 0) {
      setPlacesArray([]);
    }

  }

  /**
   * validate string address;
   * @param {string} address
   */
  function handleAutocompleteData(address, requestParams) {
    setIsLoading(true);
    let count = apiCount + 1;
    setApiCount(count);
    GetPlaceAutocomplete(address, requestParams);
  }



	/**
	 *
	 * @param {string} address
	 * @param {number} api
	 */
  async function GetPlaceAutocomplete(address, requestParams) {

    try {
      const response = await api.getPlacesAutoComplete(
        requestParams.provider_id,
        requestParams.token,
        address,
        requestParams.lat,
        requestParams.long,
        apiCount
      );

      const result = response.data;

      if (parse.isSuccess(result, returnConstNavigate) == true) {
        setPlacesArray(result.data);
        setIsLoading(false);
        setClicker(result.clicker);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  }

	/**
	 * send choosed address data from father compoment;
	 * @param {string} address
	 * @param {string} mainText
	 * @param {string} secondaryText
	 * @param {string} placeID
	 * @param {number} latitude
	 * @param {number} longitude
	 */
  function handleSelectData(
    address,
    mainText,
    secondaryText,
    placeID,
    latitude,
    longitude
  ) {
    chooseAutoComplete(
      mainText,
      secondaryText,
      placeID,
      latitude,
      longitude,
      clicker
    );

    setFullAddress(address);
  }

  /**
   * clear text and focus input;
   */
  function clearText() {
    setFullAddress("");
    this.input.focus();
  }

  return (
    <>
      <TextInput
        ref={(input) => { this.input = input }}
        style={{ width: boxWidth }}
        multiline={false}
        placeholder={strings("fill_address.address")}
        underlineColorAndroid="transparent"
        onChangeText={address => {
          handleTextInputChange(address)
        }}
        value={fullAddress}
        autoFocus={true}
      />
      <ActivityIndicator animating={isLoading} />
      <Icon name="close" size={20} color="#777" onPress={() => clearText()} />

      {placesArray.length > 0 && fullAddress !== "" ?
        <View
          style={{
            backgroundColor: "white",
            position: "absolute",
            top: 95,
            zIndex: 999,
            width: '100%'
          }}>
          <FlatList
            data={placesArray}
            extraData={placesArray}
            ref={(ref) => { this.flatListRef = ref; }}
            keyExtractor={(x, i) => i.toString()}
            style={{
              backgroundColor: "white",
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  borderBottomWidth: 0.5,
                  padding: 10
                }}
                onPress={() => handleSelectData(
                  item.address,
                  item.main_text,
                  item.secondary_text,
                  item.place_id,
                  item.latitude,
                  item.longitude
                )}
              >
                <Text numberOfLines={1}>{item.main_text}</Text>
                <Text numberOfLines={1}>{item.secondary_text}</Text>
              </TouchableOpacity>
            )} />
        </View>

        : null}
    </>
  );
}

