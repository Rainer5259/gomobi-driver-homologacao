import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler, SafeAreaView } from 'react-native';

import Loader from '../../../../../Components/Loader';
import { handlerException } from '../../../../../Services/Exception';

import useUser from './hooks/useUser';
import { setSigData } from '../../../../../Store/actions/sig';

//Styles
import styles from "./styles";

import { APIS_GO_MOBI } from '../../../../../Util/Constants';

class SigScreen extends Component {

  constructor(props) {
    super(props);
    this.useUser = useUser();
    this.state = {
      showModal: false,
      loading: false
    }
    this.userId = this.props.profile._id;
    this.userToken = this.props.profile._token;
  }

  getUrlToShared(inviteCode) {
    return `${APIS_GO_MOBI.external.sigScreen}?referralCode=${inviteCode}`;
  }

  componentDidMount() {
    this.loadData();
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

  verifyAutorization(data) {
    const dsScreen = !data?.isApproved ? 'SigLandingPage' : 'SharedScreen';
    this.props.navigation.navigate(dsScreen);
  }

  async loadData() {
    try {
      this.setState({ loading: true });

      const data = await this.useUser.euMais10(this.userId, this.userToken);
      data.urlToShared = this.getUrlToShared(data.referralCode);
      data.providerName = this.props.profile?._first_name.trim() + ' ' + this.props.profile?._last_name;
      this.props.setSigData(data);
      this.verifyAutorization(data);

    } catch (error) {
      handlerException('Shared screen', error);
      this.props.navigation.navigate('SigLandingPage');
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Loader
          loading={this.state.loading}
          message={'Carregando...'}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  const Profile = state.providerProfile.providerProfile;
  return { profile: Profile };
};

const mapDispatchToProps = dispatch => {
  return {
    setSigData: dataUser => dispatch(setSigData(dataUser)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SigScreen);
