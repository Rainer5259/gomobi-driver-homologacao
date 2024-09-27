import React, { Component } from 'react';
import { BackHandler, StatusBar, StyleSheet, Text, TextInput, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { BootstrapColors } from '../../../../../Themes/WhiteLabelTheme/WhiteLabel';

import images from "../../../../../Themes/WhiteLabelTheme/Images"

import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";

import Toolbar from '../../../../../Components/Toolbar';
import useUser from '../SigScreen/hooks/useUser';

class SucessScreen extends Component {

  constructor(props) {
    super(props);
    this.useUser = useUser();

    this.state = {
      showModal: false
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        this.props.navigation.navigate('MainScreen');
        return true;
      }
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleShared() {
    this.useUser.handleToShared(this.props.sigData.urlToShared, this.props.sigData.providerName);
  }


  handleSharedQRcode(showModal) {
    this.setState({ showModal })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>

        <Toolbar
          back={true}
          handlePress={() => this.props.navigation.navigate('MainScreen')}
        />

        <View style={styles.container}>

          <StatusBar backgroundColor={'transparent'} barStyle="dark-content" />
          <View style={styles.containerImage}>
            <Image source={images.sigSucess} resizeMode='stretch' style={styles.image} />
          </View>
          <View style={styles.containerFooter}>
            <View>
              <Text style={styles.textShared}>
                Agora é só divulgar a sua
                página EU + 10 para todo mundo e potencializar seus resultados.
              </Text>
              <View>
                <Text style={styles.titleInput}>Meu link</Text>
                <TextInput
                  style={styles.input}
                  value={this.props.sigData.urtToShared}
                />
              </View>

              <TouchableOpacity
                style={styles.buttonIcon}
                onPress={this.handleShared.bind(this)}>
                <Entypo name='share' size={20} color={BootstrapColors.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonIcon}
                onPress={() => this.handleSharedQRcode(true)}>
                <AntDesign name='qrcode' size={20} color={BootstrapColors.primary} />
              </TouchableOpacity>

            </View>
          </View>
        </View>

        <this.useUser.ModalQrCode
          urtToShared={this.props.sigData.urtToShared}
          showModal={this.state.showModal}
          handleSharedQRcode={this.handleSharedQRcode.bind(this)}
        />

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  containerImage: {
    flex: 1,
    position: 'relative',
  },
  containerFooter: {
    flex: 0.4,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
    paddingBottom: 50,
    backgroundColor: BootstrapColors.primary
  },
  input: {
    height: 50,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.41,
    borderBottomWidth: 1,
    color: BootstrapColors.white,
    borderColor: BootstrapColors.white,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '300',
    fontStyle: 'italic',
    color: BootstrapColors.white,
    lineHeight: 20,
    letterSpacing: 2,
    color: '#242E42'
  },
  textShared: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 22,
    letterSpacing: 2,
    textAlign: 'center',
    color: BootstrapColors.white,
    width: '100%',
    paddingBottom: 20,
    bottom: 10
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12
  },
})

const mapStateToProps = (state) => {
  const { settings } = state.settings;
  const { profile } = state.profile;
  const { sigData } = state.sigData;
  return { settings, profile, sigData };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SucessScreen);
