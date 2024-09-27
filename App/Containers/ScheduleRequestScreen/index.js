// Modules
import React, { Component } from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  TextInput,
  Alert,
  Image,

  BackHandler,

  TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-root-toast";
import Toolbar from '../../Components/Toolbar'
import prompt from "react-native-prompt-android";
import { connect } from "react-redux";
import { RNSlidingButton, SlideDirection } from "rn-sliding-button";

// Components
import Loader from "../../Components/Loader";

// Locales
import { strings } from "../../Locales/i18n";

//Models
import Provider from "../../Models/Provider";
import Marker from "../../Models/Marker";

//Services
import ProviderApi from "../../Services/Api/ProviderApi";

// Themes
import { Images } from "../../Themes";
import {
  WUSER_ROLE
} from "../../Themes/WhiteLabelTheme/WhiteLabel";




// Util
import * as constants from "../../Util/Constants";
import * as parse from "../../Util/Parse";

// Styles
import styles from "./styles";

const NORMAL_COLOR = "#0FACF3";
const SUCCESS_COLOR = "#39ca74";

class ScheduleRequestScreen extends Component {
  constructor(props) {
    super(props);

    this.apiProvider = new ProviderApi();

    this.state = {
      menu: false,
      onClicked: false,
      swiped: false,
      leftSwiped: false,
      rightSwiped: false,
      schedule: [],
      user: [],
      markerUser: [],
      region: null,
      date: "",
      time: "",
      picture: Images.avatar_register,
      source_latitude: 0,
      source_longitude: 0,
      reason_cancelation: "",
      isLoading: false,
      seconds: 30,
      is_cancelled: false
    };
    this.handlerButtonOnClick = this.handlerButtonOnClick.bind(this);
    this.willBlur = this.props.navigation.addListener("willBlur", () => { });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  handlerButtonOnClick() {
    this.setState({
      onClicked: !this.state.onClicked
    });
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack();
      return true;
    });
    this.restoreProviderModel();
    if (this.props.navigation.state.params) {
      var dateUnformatted = this.props.navigation.state.params.schedule.start_time.split(
        " "
      );
      var date = dateUnformatted[0].split("-");
      var year = date[0];
      var month = date[1];
      var day = date[2];

      date = day + "/" + month + "/" + year;
      var time = dateUnformatted[1].slice(0, 5);

      let schedule = this.props.navigation.state.params.schedule;
      let is_confirmed_by_provider = 1;
      let msg = strings("ScheduleRequestScreen.waiting_confirmation");
      let is_cancelled = false;

      if (schedule.is_cancelled_by_user == 1) {
        msg = strings("ScheduleRequestScreen.cancelled_by_user");
        is_cancelled = true;
      } else if (schedule.is_cancelled_by_provider == 1) {
        msg = strings("ScheduleRequestScreen.cancelled_by_you");
        is_cancelled = true;
      } else if (schedule.is_confirmed_by_provider == 1) {
        msg = strings("ScheduleRequestScreen.schedule_confirmed");
      } else {
        is_confirmed_by_provider = 0;
      }

      this.setState({
        schedule: this.props.navigation.state.params.schedule,
        user: this.props.navigation.state.params.schedule.user,
        source_latitude: this.props.navigation.state.params.schedule
          .source_latitude,
        source_longitude: this.props.navigation.state.params.schedule
          .source_longitude,
        date: date,
        time: time,
        is_confirmed_by_provider: is_confirmed_by_provider,
        msg: msg,
        is_cancelled: is_cancelled
      });

      let region = {
        latitude: this.props.navigation.state.params.schedule.source_latitude,
        longitude: this.props.navigation.state.params.schedule.source_longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      };
      markerUser = this.createUserMarker(
        100,
        strings("ScheduleRequestScreen.user"),
        this.props.navigation.state.params.schedule.source_latitude,
        this.props.navigation.state.params.schedule.source_longitude
      );
      this.setState({ markerUser: markerUser, region: region });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
        if(this.backHandler){
      this.backHandler.remove();
    }
    this.willBlur.remove();
  }

  /**
   * Create Custom marker for User Location.
   */
  createUserMarker(id, title, latitude, longitude) {
    let markerUser = [];
    markerUser.push(
      new Marker(
        parseInt(id),
        title,
        parseFloat(latitude),
        parseFloat(longitude),
        ""
      )
    );
    return markerUser;
  }

  /**
   * Decrease the second of 30 by 0
   */
  tick() {
    if (this.state.seconds > 0) {
      this.setState(prevState => ({
        seconds: prevState.seconds - 1
      }));
    } else {
      return false;
    }
  }

  /**
   * return const navigate = this.props.navigation
   */
  returnConstNavigate() {
    const { navigate } = this.props.navigation;
    return navigate;
  }

  confirmScheduled() {
    this.setState({ isLoading: true });
    if (this.provider != null && this.provider.getId() != null) {
      this.apiProvider
        .ConfirmScheduled(
          this.provider.getId(),
          this.provider.getToken(),
          this.state.schedule.schedule_request_id
        )
        .then(response => {
          var result = response.data;
          if (parse.isSuccess(result, this.returnConstNavigate())) {
            this.setState({ isLoading: false });
            this.navigateToScreen("MyRequestsScreen");
          }
        })
        .catch(error => {
          this.setState({ isLoggingIn: false });
          parse.showToast(strings("error.try_again"), Toast.durations.LONG);
        });
    }
  }

  rejectSchedule(reason) {
    this.setState({ isLoading: true });
    if (reason == null || reason == undefined || reason == "") {
      parse.showToast(
        strings("error.insert_reason_cancellation"),
        Toast.durations.SHORT
      );
      this.setState({ isLoading: false });
    } else if (this.provider != null && this.provider.getId() != null) {
      this.apiProvider
        .CancelScheduled(
          this.provider.getId(),
          this.provider.getToken(),
          this.state.schedule.schedule_request_id,
          reason
        )
        .then(response => {
          var result = response.data;
          if (parse.isSuccess(result, this.returnConstNavigate())) {
            this.setState({ isLoading: false });
            this.navigateToScreen("MainScreen");
          } else {
            this.setState({ isLoading: false });
          }
        })
        .catch(error => {
          this.setState({ isLoading: false });
          parse.showToast(strings("error.try_again"), Toast.durations.LONG);
        });
    }
  }

  /**
   * Restore user Model information.
   */
  restoreProviderModel() {
    Provider.require(Provider);
    Provider.restore(constants.PROVIDER_STORAGE).then(provider => {
      if (provider !== null) {
        this.provider = provider;
        this.setState({
          picture: { uri: provider.getPicture() }
        });
      }
    });
  }

  state = {
    isModalVisible: false,
    isModalCancel: false
  };

  _toggleModal = () => {
    this.interval = setInterval(() => this.tick(), 1000);
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  _toggleModalCancel = () => {
    this.setState({ isModalCancel: !this.state.isModalCancel });
  };

  _toggleModalCancelReject = () => {
    this.setState({ isModalCancel: !this.state.isModalCancel });
    this.rejectSchedule();
  };

  onLeftSlide() {
    var self = this;
    this.setState({ swiped: true, leftSwiped: true }, () => {
      setTimeout(
        () => self.setState({ swiped: false, leftSwiped: false }),
        2500
      );
    });
  }

  onRightSlide() {
    this.confirmScheduled();
    var self = this;
    this.setState({ swiped: true, rightSwiped: true }, () => {
      setTimeout(
        () => self.setState({ swiped: false, rightSwiped: false }),
        2500
      );
    });
  }

  onBothSlide() {
    var self = this;
    this.setState({ swiped: true, bothSwiped: true }, () => {
      setTimeout(
        () => self.setState({ swiped: false, bothSwiped: false }),
        2500
      );
    });
  }

  /**
   * Navigate to another Screen.
   */
  navigateToScreen(screen, providerId, image) {
    const { navigate } = this.props.navigation;


    if (screen == "ServiceInProgressScreen") {
      navigate(screen, { request: this.request });
    } else {
      navigate(screen);
    }
  }

  /**
   * Show Alert to Cancel the Request
   */
  cancelRequestAlert() {
    Alert.alert(
      strings("ServiceUserBoardScreen.cancel_request_title"),
      null,
      [
        {
          text: strings("general.no"),
          style: "cancel"
        },
        {
          text: strings("general.yes"),
          onPress: () => this.showAlertToGetReason()
        }
      ],
      { cancelable: false }
    );
  }

  /**
   * showAlertToGetReason
   */
  showAlertToGetReason() {
    prompt(
      strings("ServiceUserBoardScreen.cancel_reason_title"),
      strings("ServiceUserBoardScreen.cancel_reason_message"),
      [
        {
          text: strings("general.cancel"),
          style: "cancel"
        },
        {
          text: strings("general.OK"),
          onPress: reason => this.rejectSchedule(reason)
        }
      ],
      {
        type: "default",
        cancelable: false,
        defaultValue: "",
        placeholder: ""
      }
    );
  }

  /**
   * Set Half Star on Review
   *
   * @param {number} rating
   */
  starsDecimal(rating) {
    const fields = [];

    if (Number.parseFloat(rating) > 0) {
      if (
        Number.parseFloat(rating) - Math.trunc(Number.parseFloat(rating)) !=
        0
      ) {
        fields.push(
          <Image
            key={99}
            source={Images.icon_star_half}
            style={styles.icon_star_all}
          />
        );
      }
    }
    return fields;
  }

  /**
   * Set Full Star on Review
   *
   * @param {number} rating
   */
  starsProvider(rating) {
    const fields = [];
    if (Number.parseFloat(rating) > 0) {
      for (let i = 0; i < Math.trunc(Number.parseFloat(rating)); i++) {
        fields.push(
          <Image
            key={i}
            source={Images.icon_star_all}
            style={styles.icon_star_all}
          />
        );
      }
    }
    return fields;
  }

  render() {
    var message = this.state.swiped ? "Slide Successful!" : "Slide Any Button";
    var messageColor = this.state.swiped ? SUCCESS_COLOR : NORMAL_COLOR;
    var leftButtonColor = this.state.leftSwiped ? SUCCESS_COLOR : NORMAL_COLOR;
    var rightButtonColor = this.state.rightSwiped
      ? SUCCESS_COLOR
      : NORMAL_COLOR;
    var bothButtonColor = this.state.bothSwiped ? SUCCESS_COLOR : NORMAL_COLOR;

    return (
      <View style={styles.parentContainer}>
        <View style={styles.areaAvatar}>
          <Image source={this.state.picture} style={styles.avatar} />
        </View>

        <Toolbar
          back={true}
          handlePress={() => this.props.navigation.goBack()}
        />


        <Loader
          sytle={styles.centered}
          loading={this.state.isLoading}
          message={strings("load.Loading")}
        />

        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior="position">
            <View style={styles.pacienteContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: this.state.user.picture }}
                  style={styles.avatarPaciente}
                />
              </View>

              <View style={styles.paciente}>
                <Text style={styles.pacienteTitle}>
                  {strings("ServiceUserBoardScreen.user_role", { userRole: WUSER_ROLE })}
                </Text>
                <Text style={styles.pacienteName}>
                  {this.state.user.first_name} {this.state.user.last_name}
                </Text>
                <View style={styles.ratingContainer}>
                  {this.starsProvider(this.state.schedule.user_rating)}
                  {this.starsDecimal(this.state.schedule.user_rating)}
                  <Text style={styles.pacienteRating}>
                    {" " +
                      parseFloat(this.state.schedule.user_rating).toFixed(1)}
                  </Text>
                </View>
                <Text style={styles.pacienteTitle}>
                  {strings("ScheduleRequestScreen.status") + this.state.msg}
                </Text>
              </View>
            </View>

            <Text style={styles.serviceInformation}>
              {strings("requests.scheduled_informations")}
            </Text>
            <View style={styles.serviceInformationContainer}>
              <View style={styles.serviceItem}>
                <Text style={styles.itemTitle}>
                  {strings("ScheduleRequestScreen.date")}
                </Text>
                <Text style={styles.itemTitle}>{this.state.date}</Text>
              </View>

              <View style={styles.serviceItem}>
                <Text style={styles.itemTitle}>
                  {strings("ScheduleRequestScreen.schedule")}
                </Text>
                <Text style={styles.itemTitle}>{this.state.time}</Text>
              </View>

              <View style={styles.serviceItem}>
                <Text style={styles.itemTitle}>
                  {this.state.schedule.typeName}
                </Text>
                <Text style={styles.itemTitle}>
                  {this.state.schedule.categoryName}
                </Text>
              </View>
            </View>
            <Text style={styles.serviceInformation}>
              {strings("requests.service_place")}
            </Text>
            <View style={styles.serviceLocationContainer}>
              <Text style={styles.serviceLocation}>
                {this.state.schedule.source}
              </Text>
              {this.state.is_cancelled == false ? (
                <View>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => this.cancelRequestAlert()}
                  >
                    <Text style={styles.txtReject}>
                      {strings("general.reject")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <View style={{ flex: 1 }}>
              <Modal
                isVisible={this.state.isModalVisible}
                backdropColor={"black"}
                style={styles.modalMap}
                onSwipe={() => this.setState({ isModalVisible: false })}
                swipeDirection="up"
                onRequestClose={() => this.setState({ isModalVisible: false })}
                onBackdropPress={() => this.setState({ isModalVisible: false })}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.containerTitle}>
                    <Text style={styles.modalTitle}>
                      {strings("requests.scheduling_for_a_service")}
                    </Text>
                  </View>
                  <View style={styles.containerDesc}>
                    <Text style={styles.modalDesc}>
                      {" "}
                      {strings("requests.accept_scheduling_message")}{" "}
                    </Text>
                  </View>
                  <View style={styles.containerCount}>
                    <Text style={styles.modalCount}>{this.state.seconds}</Text>
                    <Text style={styles.modalCountText}>
                      {" "}
                      {strings("general.seconds")}{" "}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity onPress={this._toggleModal}>
                      <Text>Hide me!</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>

            <View style={{ flex: 1 }}>
              <Modal
                isVisible={this.state.isModalCancel}
                backdropColor={"black"}
                style={styles.modalServiceReject}
                onRequestClose={() => this.setState({ isModalCancel: false })}
                onBackdropPress={() => this.setState({ isModalCancel: false })}
                onSwipe={() => this.setState({ isModalCancel: false })}
                swipeDirection="up"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.containerTitle}>
                    <Text style={styles.modalTitle}>
                      {strings("requests.scheduling_is_being_rejected")}
                    </Text>
                  </View>
                  <View style={styles.containerDesc}>
                    <Text style={styles.modalDesc}>
                      {strings(
                        "ScheduleRequestScreen.reason_of_schedule_cancellation"
                      )}
                    </Text>
                  </View>
                  <View style={styles.modalInput}>
                    <TextInput
                      multiline={true}
                      numberOfLines={4}
                      onChangeText={reason_cancelation =>
                        this.setState({ reason_cancelation })
                      }
                      value={this.state.reason_cancelation}
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      style={styles.modalButton}
                      disabled={!this.state.reason_cancelation.length > 0}
                      onPress={this._toggleModalCancelReject}
                    >
                      <Text style={styles.txtReject}>
                        {strings("ScheduleRequestScreen.reject")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <View>
          {this.state.is_confirmed_by_provider != 1 ? (

            <View style={styles.containerSlidingButton}>
              <RNSlidingButton
                style={styles.slideButton}
                height={60}
                onSlidingSuccess={this.onRightSlide.bind(this)}
                slideDirection={SlideDirection.RIGHT}
              >
                <View style={styles.containerContentSlidingButton}>
                  <Text numberOfLines={1} style={styles.titleText}>
                    {strings("requests.accept_scheduling")}{" "}
                    <Image
                      source={Images.icon_arrow_right_white}
                      style={styles.icon_arrow_right_white}
                    />
                  </Text>
                </View>
              </RNSlidingButton>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleRequestScreen);
