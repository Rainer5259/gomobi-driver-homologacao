// Modules
import React, { Component } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

// Containers
import styles from './styles';

// Locales
import { strings } from '../../../Locales/i18n';

// Services
import ProviderApi from '../../../Services/Api/ProviderApi';
import { handlerException } from '../../../Services/Exception';


// Themes
import { PrimaryButton } from '../../../Themes/WhiteLabelTheme/WhiteLabel';

export default class ModalReferrals extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sampleReferralCode: [],
      sampleTitleReferralCode: "",
    };
  }

   /**
   * Get sample referrals.
   */
    getSampleReferrals() {
      this.providerApi
        .SampleReferrals()
        .then(response => {
          var responseJson = response.data;
          if(responseJson.success) {
            this.setState({
              sampleReferralCode: responseJson.referrals,
              sampleTitleReferralCode: responseJson.titleReferrals,
            });
          }
        })
        .catch(error => {
          handlerException('Referrals.getSampleReferrals', error);
        });
  }

  componentDidMount() {
    this.providerApi = new ProviderApi();
    this.getSampleReferrals();
  }


  render() {
    const {
      modalReferral,
    } = this.props;

    return (
      <Modal
            animationType="fade"
            transparent={true}
            visible={modalReferral}
            onRequestClose={() => this.props.setModalReferral(false)}
            useNativeDriver
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <View style={styles.containerModalReferral}>
                 <Text style={styles.titleModalReferral}>
                  {strings('register.referralCodeModal')}
                </Text>
                <Text style={styles.textCodeReferralWarning}>
                  {this.state.sampleReferralCode && this.state.sampleReferralCode.length > 0 ? this.state.sampleTitleReferralCode : strings('register.referralCodeWarning')}
                </Text>
                {this.state.sampleReferralCode && this.state.sampleReferralCode.length > 0 ?
                  this.state.sampleReferralCode.map((item, index) => {
                    return (
                      <View key={index} style={styles.referralCode}>
                        <Text>{`${index + 1} - ${item.text}`}</Text>
                        <TouchableOpacity style={{marginBottom: 3}} onPress={() => this.props.copyReferralCode(item.id)}>
                          <Icon name="clone" size={20} color={PrimaryButton} />
                        </TouchableOpacity>
                      </View>
                    )
                  }
                ): null}
                <View style={{ marginBottom: 20 }}>
                  <TouchableOpacity
                    style={styles.closeButtonReferralModal}
                    onPress={() => this.props.setModalReferral(false)}>
                    <Text style={styles.closeButtonText} >
                      {strings('register.close')}
                    </Text>
                    </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
    );
  }
}
