import React, { Component } from 'react';

import { Text, TextInput, View, TouchableOpacity, Image, Linking, BackHandler, SafeAreaView, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import VideoSig from '../../../../../Components/VideoSig';
import images from "../../../../../Themes/WhiteLabelTheme/Images"
import Entypo from "react-native-vector-icons/Entypo";
import { BootstrapColors, WBASE_URL } from '../../../../../Themes/WhiteLabelTheme/WhiteLabel';
import { APIS_GO_MOBI } from '../../../../../Util/Constants';
import { connect } from 'react-redux';
import Toolbar from '../../../../../Components/Toolbar';
import useUser from '../SigScreen/hooks/useUser';

//Styles
import styles from "./styles";

import Button from '../../../../../Components/RoundedButton';
import { strings } from '../../../../../Locales/i18n';

class SigLandingPage extends Component {

  constructor(props) {
    super(props);
    this.useUser = useUser();
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        this.props.navigation.navigate('MainScreen')
        return true;
      }
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleShared() {
    const URL = `${WBASE_URL}/provider/signup?invite_code=${this.props.sigData.referralCode}&origem=mobile`;
    this.useUser.handleToShared(URL, this.props.sigData.providerName);
  }

  openURL = () => {
    const url = APIS_GO_MOBI.external.paymentUrl;
    Linking.openURL(url)
      .then(() => console.log(`URL aberta com sucesso: ${url}`))
      .catch((err) => console.error(`Erro ao abrir a URL: ${err}`));
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>

        <StatusBar backgroundColor={BootstrapColors.primary} barStyle="light-content" />

        <Toolbar
          back={true}
          handlePress={() => this.props.navigation.navigate('MainScreen')}
        />
        <ScrollView style={styles.container}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-around',
          }}
        >

          <View style={styles.containerImage}>

            <Image source={images.sigShared} resizeMode='cover' style={styles.image} />

          </View>
          <View style={styles.containerFooter}>
            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.titleInput}>{strings('indication.my_code')}</Text>
                <TextInput
                  editable={false}
                  placeholder={strings('indication.erro_code_generation')}
                  style={styles.input}
                  value={this.props.sigData.referralCode}
                />
                <TouchableOpacity
                  style={styles.buttonIcon}
                  onPress={this.handleShared.bind(this)}>
                  <Entypo name='share' size={20} color={BootstrapColors.primary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.textShared}>
                {strings("indication.more_about_euMais10")}
              </Text>
              <VideoSig style={{ flex: 1 }}></VideoSig>
            </View>

            <Button
              onPress={this.openURL.bind(this)}
              text={strings("indication.get_your_euMais10_page")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  const { sigData } = state;
  return { sigData };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SigLandingPage);
