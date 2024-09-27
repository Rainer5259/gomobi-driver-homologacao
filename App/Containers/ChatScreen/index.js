//Modules
import React, { Component } from "react";
import { View, TouchableOpacity, BackHandler, Vibration } from "react-native";
import Sound from "react-native-sound";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import {
  GiftedChat,
  Send,
  Bubble,
  MessageText,
  Time,
  Composer,
  Day,
} from "react-native-gifted-chat";

// Components
import DefaultHeader from "../../Components/DefaultHeader";

// Locales
import { strings } from "../../Locales/i18n";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";
import { handlerException } from "../../Services/Exception";

// Store
import { setIdConversation } from "../../Store/actions/request";
import { setContMensagem } from "../../Store/actions/ActionChat";

// Themes
import colors from "../../Themes/Colors";

// Util
import * as parse from "../../Util/Parse";
import * as constants from "../../Util/Constants";

//Styles
import styles from "./styles";
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      requestId: this.props.navigation.state.params.requestId,
      isLoading: "",
      receiveID: this.props.navigation.state.params.receiveID,
      lastIdMessage: "",
      sound: "",
    };
    this.apiProvider = new ProviderApi();

    this.willBlur = this.props.navigation.addListener("willBlur", () => {
      this.unsubscribeSocket();
    });
    this.willFocus = this.props.navigation.addListener("willFocus", () => {
      this.getConversation();
    });
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack();
      return true;
    });
    const filenameOrFile = this.props.audioChatProvider ? this.props.audioChatProvider : "beep.wav";

    const sound = new Sound(filenameOrFile, Sound.MAIN_BUNDLE, (error) => {
      if(error) {
        handlerException('ChatScreen', error);
        return;
      }
    });

    this.setState({
      sound,
    });
    this.props.setContMensagem(0);

    const timer = setTimeout(() => {
      this.subscribeSocketNewConversation(this.props.request.request_id);
    }, 1002);

    return () => clearTimeout(timer);
  }

  /**
   * Play the sound request
   */
  playSoundRequest() {
    Vibration.vibrate();
    if(this.state.sound) {
      this.state.sound.play(() => {});
    }
  }

  subscribeSocketNewConversation(id_request) {
    try {
      if (this.props.conversationId == 0) {
        constants.socket
          .emit("subscribe", { channel: "request." + id_request })
          .on("newConversation", (channel, data) => {
            this.props.setIdConversation(data.conversation_id);
            this.playSoundRequest();

            this.getConversation();

            this.props.setContMensagem(0);
          });
      }
    } catch (error) {
      this.props.setContMensagem(0);
    }
  }

  subscribeSocket() {
    constants.socket
      .emit("subscribe", {
        channel: "conversation." + this.props.conversationId,
      })
      .on("newMessage", (channel, data) => {
        let newMessage = {
          _id: data.message.id,
          createdAt: data.message.created_at,
          text: data.message.message,
          user: { _id: data.message.user_id },
        };

        if (
          newMessage._id !==
            this.state.messages[this.state.messages.length - 1]._id &&
          data.message.user_id !== this.props.ledger
        ) {
          this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, newMessage),
          }));
        }

        this.setState({ lastIdMessage: data.message.id });
        if (
          data.message.is_seen == 0 &&
          data.message.user_id !== this.props.ledger
        ) {
          this.playSoundRequest();
          this.seeMessage();
        }
      });
  }

  async getConversation() {
    this.setState({ isLoading: true });

    if (this.props.conversationId) {
      this.apiProvider
        .getMessageChat(
          this.props.Profile._id,
          this.props.Profile._token,
          this.props.conversationId
        )
        .then((response) => {
          let responseJson = response.data;

          this.unsubscribeSocketNewConversation();

          this.subscribeSocket();
          if (responseJson.success) {
            let formattedArrayMessages = responseJson.messages;
            this.setState({
              userLedgeId: responseJson.user_ledger_id,
              requestId: responseJson.request_id,
            });
            if (formattedArrayMessages.length > 0) {
              this.setState({
                lastIdMessage:
                  formattedArrayMessages[formattedArrayMessages.length - 1].id,
              });
              let finalArrayMessages = [];
              for (let i = 0; i < formattedArrayMessages.length; i++) {
                finalArrayMessages.unshift({
                  _id: formattedArrayMessages[i].id,
                  createdAt: formattedArrayMessages[i].created_at,
                  text: formattedArrayMessages[i].message,
                  user: { _id: formattedArrayMessages[i].user_id },
                });
              }
              this.setState({ messages: finalArrayMessages });
            }
            this.setState({ isLoading: false });

            if (
              formattedArrayMessages[formattedArrayMessages.length - 1]
                .is_seen == 0
            ) {
              this.seeMessage();
            }
          } else {
            this.setState({ isLoading: false });
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          parse.showToast(strings("error.try_again"), Toast.durations.LONG);
        });
    } else {
      this.setState({ isLoading: false });
    }
  }

  async seeMessage() {
    if (this.state.lastIdMessage) {
      try {
        const { data } = await this.apiProvider.seeMessage(
          this.props.Profile._id,
          this.props.Profile._token,
          this.state.lastIdMessage
        );
        if (!data.success) {
          this.setState({ isLoading: false });
          if (data.error) {
            parse.showToast(data.error, Toast.durations.LONG);
          } else if (data.erro_messages[0]) {
            parse.showToast(data.erro_messages[0], Toast.durations.LONG);
          }
        }
      } catch (error) {
        parse.showToast(strings("error.try_again"), Toast.durations.LONG);
      }
    }
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  unsubscribeSocketNewConversation() {
    constants.socket.removeAllListeners("newConversation");
  }

  unsubscribeSocket() {
    if (constants.socket != null) {
      if (this.props.conversationId) {
        constants.socket.removeAllListeners("newConversation");
        constants.socket.removeAllListeners("newMessage");
        constants.socket.removeAllListeners("readMessage");
        constants.socket.removeAllListeners("newConversation");
        constants.socket.emit("unsubscribe", {
          channel: "conversation." + this.props.conversationId,
        });
      }
    }
  }

  changeChatMode = () => {
    this.setState({ isMessageValue: !this.state.isMessageValue });
  };

  /**
   * set messages array with the new message
   * @param {any} messages
   */
  async onSend(messages = []) {
    try {
      let type = "text";
      let formatted = messages[0].text;

      const { data } = await this.apiProvider.sendMessage(
        this.props.Profile._id,
        this.props.Profile._token,
        this.state.requestId,
        formatted,
        this.state.receiveID,
        type
      );

      if (data.success) {
        if (data.conversation_id) {
          if (
            this.props.conversationId == null ||
            this.props.conversationId == 0
          ) {
            this.props.setIdConversation(data.conversation_id);
            this.unsubscribeSocketNewConversation();
            this.subscribeSocket();
          }
        }
        this.setState((previousState) => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }));
      } else {
        if (data.error) {
          parse.showToast(data.errors, Toast.durations.LONG);
        } else if (data.erro_messages[0]) {
          parse.showToast(data.erro_messages[0], Toast.durations.LONG);
        }
      }
    } catch (error) {
      parse.showToast(strings("error.try_again"), Toast.durations.LONG);
    }
  }

  /**
   * Render custom footer
   * @param {any} props
   */
  renderSend = (props) => {
    if (props.text.trim()) {
      // text box filled
      return (
        <Send {...props}>
          <View style={styles.contImg}>
            <Icon name="ios-send" size={30} color={colors.primaryColor} />
          </View>
        </Send>
      );
    }
  };

  /**
   * Render day
   */
  renderDay(props) {
    return (
      <Day containerStyle={{ marginTop: 30, marginBottom: 0 }} {...props} />
    );
  }

  /**
   * render bubble
   * @param {any} props
   */
  renderBubble(props) {
    /*         props.currentMessage["sent"] = true
                props.currentMessage["received"] = true */

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: styles.leftBubble,
          right: styles.rightBubble,
        }}
      />
    );
  }

  /**
   * render custom text message
   *  @param {any} props
   */
  renderMessageText(props) {
    return (
      <MessageText
        {...props}
        textStyle={{ right: styles.messageTextRight, left: styles.messageText }}
      />
    );
  }

  /**
   * render custom time about message
   */
  renderTime(props) {
    return (
      <Time
        {...props}
        textStyle={{ left: styles.time, right: styles.timeRight }}
      />
    );
  }

  /**
   * Render custom buttom value
   */
  renderComposer = (props) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Composer {...props} />
        <TouchableOpacity
          onPress={this.changeChatMode}
          style={{ position: "absolute", right: 5, bottom: 0 }}
        >
          {/*  <Icon name='md-cash' type='ionicon' color='green' /> */}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <DefaultHeader
          loading={this.state.isLoading}
          loadingMsg={strings("load.Loading")}
          btnBackListener={() => this.props.navigation.goBack()}
        />
        <GiftedChat
          messages={this.state.messages}
          placeholder={
            this.state.isMessageValue
              ? strings("chatBot.insertValue")
              : strings("chatBot.digitHere")
          }
          locale="pt"
          dateFormat="L"
          onSend={(messages) => this.onSend(messages)}
          user={{ _id: this.props.ledger }}
          renderSend={this.renderSend}
          renderDay={this.renderDay}
          renderBubble={this.renderBubble}
          renderMessageText={this.renderMessageText}
          renderTime={this.renderTime}
          textInputProps={{
            keyboardType: this.state.isMessageValue ? "numeric" : "default",
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  Profile: state.providerProfile.providerProfile,
  ledger: state.providerProfile.ledger,
  request: state.request.requestInprogress,
  conversationId: state.request.conversationId,
  audio: state.settingsReducer.audio,
  audioChatProvider: state.settingsReducer.audioChatProvider,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setIdConversation: (id) => dispatch(setIdConversation(id)),
    setContMensagem: (value) => dispatch(setContMensagem(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
