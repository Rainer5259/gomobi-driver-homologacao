import React, { Component } from 'react';
import { BackHandler, StatusBar, StyleSheet, Text, TextInput, View, Image, SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { BootstrapColors, projectColors } from '../../../../../Themes/WhiteLabelTheme/WhiteLabel';

import images from "../../../../../Themes/WhiteLabelTheme/Images"
import { strings } from '../../../../../Locales/i18n';
import { permissionsAction } from '../../../../../Actions/permissions.action';

// Utils
import ImageHelper from '../../../../../Util/ImageHelper';

// Services
import useUser from '../SigScreen/hooks/useUser';

// Custom components
import IconTextButton from '../../../../../Components/IconTextButton';
import DefaultHeader from '../../../../../Components/DefaultHeader';

class SharedScreen extends Component {

  constructor(props) {
    super(props);
    this.useUser = useUser();
    this.imageHelper = new ImageHelper();

    this.state = {
      showModal: false,
      isLoading: true
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
    this.setState({isLoading: false});
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleShared() {
    this.useUser.handleToShared(this.props.sigData.urlToShared, this.props.sigData.providerName);
  }

  handleSharedQRcode(value) {
    this.setState({ showModal: value })
  }

  handleDownloadBanner() {
    this.setState({isLoading: true})
    permissionsAction
      .requestWriteExternalStorage()
      .then((permissionGranted) => {
        if (permissionGranted) {
          this.imageHelper
            .downloadImage(this.props.sigData.indicationBanner, strings("indication.banner_title"))
            .then((response) => {
              parse.showToast(strings('indication.banner_is_available'));
              console.log('[SharedScreen] Banner is in Downloads folder: ', response);
            }).finally(() => this.setState({isLoading: false}));
        }
      }).catch(error => {
        handlerException("Downloading Banner", error);
        this.setState({isLoading: false});
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.pageBackground}>
        <View style={styles.containerImage}>
          <StatusBar backgroundColor={BootstrapColors.primary} barStyle="light-content" />
          <DefaultHeader
            btnBack
            btnBackListener={() => this.props.navigation.navigate('MainScreen') }
            loading={this.state.isLoading}
          />
          <Image source={images.sigShared} resizeMode='cover' style={styles.image} />
          <Text style={styles.textShared}>
            {strings('indication.share_with_friend')}
          </Text>
        </View>

        <ScrollView style={styles.containerFooter}>
          <View style={{
              flex: 0,
              flexDirection: 'column',
          }}>
            <View>
              <Text style={styles.titleInput}>{strings('indication.my_code')}</Text>
              <TextInput
                editable={false}
                placeholder={strings('indication.empty_code')}
                style={styles.input}
                value={this.props.sigData.referralCode}
              />
            </View>
          </View>

          {this.props.sigData?.urlToShared && <>
            <IconTextButton
              icon='share-social-outline'
              size={26}
              text={strings('indication.send_message')}
              onPress={this.handleShared.bind(this)} />
            <IconTextButton
              icon='qr-code-outline'
              size={25}
              text={strings('indication.show_qr_code')}
              onPress={() => this.handleSharedQRcode(true)} />
          </>}
          {this.props.sigData?.indicationBanner &&
            <IconTextButton
              icon='newspaper-outline'
              size={25}
              text={strings('indication.download_banner')}
              onPress={this.handleDownloadBanner.bind(this)} />}
        </ScrollView>

        <this.useUser.ModalQrCode
          urtToShared={this.props.sigData.urtToShared}
          handleSharedQRcode={this.handleSharedQRcode.bind(this)}
          visible={this.state.showModal}
        />

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  pageBackground: {
    flex: 1,
    position: 'relative',
    backgroundColor: BootstrapColors.white
  },
  containerImage: {
    flex: 0,
    position: 'relative',
    height: '50%'
  },
  containerFooter: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop:40
  },
  input: {
    textTransform: 'uppercase',
    height: 50,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    color: '#242E42',
    borderColor: '#242E42',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 20,
    letterSpacing: 2,
    color: '#242E42'
  },
  textShared: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: 2,
    textAlign: 'center',
    color: BootstrapColors.white,
    position: 'absolute',
    width: '100%',
    bottom: 20
  },
  image: {
    width: '100%',
    height: '100%',
    zIndex: -1,
    position: 'absolute'
  },
})

const mapStateToProps = (state) => {
  const { sigData } = state;
  return { sigData };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SharedScreen);
