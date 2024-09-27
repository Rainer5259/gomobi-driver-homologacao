// Modules
import React, { Component } from "react";
import {
  BackHandler,
  ScrollView,
  Text,
  View,
  TextInput,
  StatusBar
} from "react-native";

import Toast from "react-native-root-toast";
import Feather from 'react-native-vector-icons/Feather';
import BackgroundGeolocation from "react-native-background-geolocation";
import { connect } from "react-redux";
import { AirbnbRating, Avatar } from 'react-native-elements';
import { SafeAreaView } from "react-native-safe-area-context";


// Component
import Loader from "../../Components/Loader";
import Button from "./../../Components/RoundedButton";
// Locales
import { strings } from "../../Locales/i18n";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";
import { handlerException } from '../../Services/Exception';

// Themes
import {
  BootstrapColors,
  projectColors,
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Util
import * as parse from "../../Util/Parse";
import * as constants from "../../Util/Constants";

// Styles
import styles from "./styles";

class ServiceFinishedScreen extends Component {
  constructor(props) {


    super(props);
    this.provider;
    this.clicked = false;
    this.api = new ProviderApi();
    this.loading_message = strings("load.Loading");
    this.state = {
      comment: "",
      requestID: 0,
      isLoading: false,
      rating: 5,
      selectedMessages: [],
      avaliateMessage: [
        {
          id: 0,
          name: strings("serviceFinished.great_talk")
        },
        {
          id: 1,
          name: strings("serviceFinished.nice")
        }

      ]
    };
    this.rating = 0;

  }

  /**
   * Pt-BR
   * Recupera todas as informações relevantes da tela anterior, como provider e request_id
   *
   * EN
   * Retrieves all relevant information from the previous screen, such as provider and request_id
   *
   */
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      /*   this.props.navigation.goBack(); */
      return true;
    });
    if (this.props.navigation.state.params) {
      this.provider = this.props.navigation.state.params.provider;
      let request_id = this.props.navigation.state.params.request_id;
      this.setState({

        requestID: request_id,
        isLoading: false,
      });

    }
  }

  /**
   * return const navigate = this.props.navigation
   */
  returnConstNavigate() {
    const { navigate } = this.props.navigation;
    return navigate;
  }
  /**
   * select comments
   * @param {Number} id
   */
  handleSelectComment(id) {
    const alreadySelected = this.state.selectedMessages.findIndex(item => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = this.state.selectedMessages.filter(item => item !== id);
      this.setState({
        selectedMessages: filteredItems
      })

    } else {
      this.setState({
        selectedMessages: [...this.state.selectedMessages, id]
      })

    }
  }
  /**
   * Pt-BR
   * Requisita a api setando os valores de id, token, request_id, rating, comment para serem adicionados no banco de dados.
   *
   * EN
   * Requires api by setting the id, token, request_id, rating, comment values to be added to the database.
   *
   * @param {int} id
   * @param {string} token
   * @param {int} request_id
   * @param {int} rating
   * @param {string} comment
   */
  finishRating() {

    constants.serviceRequestScreen = false;
    constants.hasService = false;
    if (this.state.rating > 0) {
      this.setState({ isLoading: true });
      if (this.props.providerProfile != null && this.props.providerProfile._id != null) {
        const avaliate = [];

        this.state.selectedMessages.map(id => {
          const filterItem = this.state.avaliateMessage.filter(message => message.id == id);

          avaliate.push(filterItem[0].name);
        });

        if (avaliate.length >= 2) {
          avaliate.join();
        }
        const comment = avaliate.join();

        this.api.RatingRequest(
          this.props.providerProfile._id,
          this.props.providerProfile._token,
          this.state.requestID,
          this.state.rating,
          this.state.comment + " , " + comment
        ).then(response => {
          var result = response.data;
          const { navigate } = this.props.navigation;

          if (parse.isSuccess(result, this.returnConstNavigate())) {
            parse.showToast("Avaliação Concluida", Toast.durations.SHORT);
          }
          this.setState({ isLoading: false, avaliar: false });
          this.checkStorageLocations();
          navigate("MainScreen");
        })
          .catch(error => {
            this.setState({ isLoading: false });
            navigate("MainScreen");
            parse.showToast(strings("error.try_again"), Toast.durations.LONG);
          });
      }
    } else {
      parse.showToast(strings("error.error_rate_user"), Toast.durations.LONG);
    }
  }

  /**
   * Check and destroy locations
   *
   * @return {void}
   */
  checkStorageLocations() {
    try {
      let count = BackgroundGeolocation.getCount();
      if (!isNaN(count) && count > 0) {
        BackgroundGeolocation.destroyLocations();
      }
    } catch (error) {
      handlerException('ServiceFinishedScreen.checkStorageLocations', error);
    }
  }

  onRightSlide() {
    this.setState({
      avaliar: true
    })
  }

  ratingCompleted(rating) {
    this.setState({ rating });
  }

  renderButtonsSatisfation() {
    return (
      <View style={styles.areaMessageAvaliate}>
        {this.state.avaliateMessage.map(message => (
          <Button
            key={message.id}
            onPress={() => this.handleSelectComment(message.id)}
            disabled={this.state.isLoading}
            text={message.name}
            customStyle={{ button: { borderRadius: 25, marginBottom: 10 } }}
          >
            {this.state.selectedMessages.includes(message.id) && (
              <View style={styles.iconCheck}>
                <Feather name="check" size={28} color={projectColors.white} />
              </View>
            )}
          </Button>
        ))}
      </View>
    )
  }

  renderValueEstimated = () => {
    /*
       Falar sobre parametro com kevin
               this.props.settings.show_estimate_price_to_called_provider && (
                  <View style={styles.areaValue}>
                    <Text style={styles.textName}>{strings("serviceFinished.total_value")}</Text>
                    <View style={styles.areaPrice}>
                      <Text style={styles.txtPrice}>{this.props.bill.provider_value_formatted}</Text>
                    </View>
                  </View>
                )
              
               */
  }

  render() {
    return (
      <>
        <Loader loading={this.state.isLoading} message={this.loading_message} />
        <StatusBar backgroundColor={BootstrapColors.primary} barStyle="white-content" />
        <ScrollView style={styles.parentContainer}>
          <SafeAreaView style={{ flex: 1}}>
            <View style={styles.body}>
             
              <View style={styles.avatar}>
                <Avatar
                  size={100}
                  rounded
                  source={{ uri: this.props.user.picture }}
                />
              </View>

              <View style={styles.formContainerWhite}>

                <Text style={styles.nameUserTxt}>{this.props.user.full_name}</Text>

                <Text style={styles.questionRaceTxt}>Como foi sua corrida?</Text>
                <Text style={styles.feedbackTxt}>Seu feedback ajudará a melhorar a experiência no Sig</Text>

                <View style={{ paddingVertical: 20 }}>
                  <AirbnbRating
                    count={5}
                    defaultRating={5}
                    showRating={false}
                    size={44}
                    reviews={[strings("rating.terrible"), strings("rating.bad"), strings("rating.ok"), strings("rating.good"), strings("rating.great")]}
                    onFinishRating={this.ratingCompleted.bind(this)}
                  />
                </View>
                {this.renderValueEstimated()}
                {this.renderButtonsSatisfation()}

                <View style={{ paddingVertical: 20 }}>

                  <TextInput
                    multiline={true}
                    numberOfLines={1}
                    style={styles.textAreaComentary}
                    onChangeText={(comment) => this.setState({ comment })}
                    placeholder="comentário"
                    value={this.state.comment}
                  />
                </View>

                <Button
                  onPress={() => this.finishRating()}
                  disabled={this.state.isLoading}
                  text={strings('serviceFinished.submit')}
                  customStyle={{ button: { backgroundColor: BootstrapColors.buttonWhine, marginVertical: 10 } }}
                />
              </View>

            </View>
          </SafeAreaView>
        </ScrollView>
      </>
    );
  }
}

const mapStateToProps = state => {
  const { settings } = state.settingsReducer
  const { providerProfile } = state.providerProfile;
  const { request, user, bill } = state.request;

  return { request, user, bill, providerProfile, settings };
};


export default connect(
  mapStateToProps,
  null
)(ServiceFinishedScreen);
