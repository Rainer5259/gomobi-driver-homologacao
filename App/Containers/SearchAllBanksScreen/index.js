// Modules
import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import { connect } from "react-redux";

// Components
import DefaultHeader from '../../Components/DefaultHeader';

//Locales
import { strings } from "../../Locales/i18n";

// Styles
import styles from "./styles";

class SearchAllBanksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, text: '' };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack();
      return true;
    });

    var banks = this.props.settings.banks;
    this.setState(
      {
        isLoading: false,
        dataSource: banks
      },
      function () {
        this.arrayholder = banks;
      }
    );

  }
  /**
   * Component will be Unmounted, so close Listener and Watcher
   */
  componentWillUnmount() {
        if(this.backHandler){
      this.backHandler.remove();
    }
  }

  /**
  * Filter the banks list with the text passed from param
  * @param {text} String
  */
  SearchFilterFunction(text) {
    const newData = this.arrayholder.filter(function (item) {
      const itemData = item.name && item.code ? item.code + " - " + item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({

      dataSource: newData,
      text: text,
    });
  }
  /**
  * Go back to last screen and sends the data of the chosen bank
  * @param {bankID} Number
  * @param {bankName} String
  */
  onClick(bankID, bankName) {
    const { navigate } = this.props.navigation;
    let screen = this.props.navigation.state.params.lastScreen;
    navigate(screen, { bankID: bankID, bankName: bankName });

  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <DefaultHeader
          btnBack={true}
          btnBackListener={() => this.props.navigation.goBack()}
          title={strings('register_steps.availableBanks')}
        />
        <View style={styles.viewStyle}>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={text => this.SearchFilterFunction(text)}
            value={this.state.text}
            underlineColorAndroid="transparent"
            placeholder={strings("general.searchBank")}
          />
          <FlatList showsVerticalScrollIndicator={false}
            data={this.state.dataSource}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.onClick(item.id, item.code + " - " + item.name)}>
                <Text style={styles.textStyle}>{item.code + " - " + item.name}</Text>
              </TouchableOpacity>
            )}
            enableEmptySections={true}
            style={{ marginTop: 10 }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settingsReducer.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchAllBanksScreen);


