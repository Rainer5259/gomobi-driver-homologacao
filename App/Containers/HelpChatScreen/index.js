// Modules
import React, { Component } from 'react';
import { View } from 'react-native';
import {
    GiftedChat,
    Send,
    Bubble,
    MessageText,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
//Components
import DefaultHeader from '../../Components/DefaultHeader';

// Locales
import { strings } from '../../Locales/i18n';

// Services
import UserApi from '../../Services/Api/ProviderApi';
import { handlerException } from "../../Services/Exception";

// Themes
import colors from '../../Themes/Colors';

// Util
import * as constants from '../../Util/Constants';

// Styles
import styles from './styles';

class HelpChatScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            request_id: this.props.navigation.state.params.request_id,
            conversation: null,
            messages: [],
            isLoading: false,
            ledger_id: null
        }

        this.api = new UserApi();
    }

    componentDidMount() {
        this.getMessages();
    }

    componentWillUnmount() {
        this.unsubscribeSocket();
    }

    /**
     * Get messages
     * @param {String} messages
     */
    async getMessages() {
        try {
            const response = await this.api.getMessageHelpChat(
                this.props.Profile._id,
                this.props.Profile._token,
                this.state.request_id
            );

            const { data } = response;
            const formattedArrayMessages = this.formatMessages(data.messages);

            this.setState({
                messages: formattedArrayMessages,
                ledger_id: data.user_ledger_id
            });
            this.subscribeSocket()
        } catch (error) {

        }
    }

    /**
     * set messages array with the new message
     * @param {String} messages
     */
    async onSend(messages = []) {
        const response = await this.api.sendMessageHelpChat(
            this.props.Profile._id,
            this.props.Profile._token,
            messages[0].text,
            this.state.request_id
        );

        if (!this.state.conversation) {
            this.setState({
                conversation: response.data.conversation_id
            });
            this.subscribeSocket();
        }

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    /**
     * Format messages array
     * @param {*} messages
     */
    formatMessages (messages) {
        const formattedArrayMessages = messages;

        if (formattedArrayMessages.length > 0) {
            this.setState({
                conversation: formattedArrayMessages[0].conversation_id
            })
            const finalArrayMessages = [];
            for (let i = 0; i < formattedArrayMessages.length; i++) {
                finalArrayMessages.unshift({
                    _id: formattedArrayMessages[i].id,
                    createdAt: formattedArrayMessages[i].created_at,
                    text: formattedArrayMessages[i].message,
                    user: { _id: formattedArrayMessages[i].user_id },
                });
            }

            return finalArrayMessages;
        }

        return [];
    }

    /**
     * @description  subscribe scoket
     */
    subscribeSocket() {
        if (constants.socket !== null && this.state.conversation !== null) {

            constants.socket
            .emit('subscribe', {
                channel: `conversation.${this.state.conversation}`,
            })
            .on('newMessage', (channel, data) => {
                const newMessage = {
                    _id: data.message.id,
                    createdAt: data.message.created_at,
                    text: data.message.message,
                    sent: true,
                    received: false,
                    user: { _id: data.message.user_id },
                };

                this.setState(state => {
                    if (
                        newMessage._id !==
                        state.messages[state.messages.length - 1]._id &&
                        data.message.user_id !== this.state.ledger_id
                    ) {
                        return {
                            messages: GiftedChat.append(state.messages, newMessage),
                        };
                    }
                });
            })
        }
    }

    /**
     * unsubscribe to socket
     */
    unsubscribeSocket() {
        try {
            if (constants.socket != null) {
            if (this.state.conversation) {
                constants.socket.removeAllListeners('newMessage');
                constants.socket.emit('unsubscribe', {
                channel: `conversation.${this.state.idConversation}`,
                });
            }
            }
        } catch (error) {
          handlerException('HelpChatScreen', error);
        }
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
     * render bubble
     * @param {any} props
     */
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{ left: styles.leftBubble, right: styles.rightBubble }}
            />
        );
    }

    /**
     * Render custom sender
     * @param {any} props
     */
    renderSend(props) {
        if (!props.text.trim()) return;

        return (
            <Send {...props}>
                <View style={styles.contImg}>
                <Icon name="ios-send" size={30} color={colors.primaryBlue} />
                </View>
            </Send>
        );
    }

  render() {
    return (
      <View style={styles.container}>
        <DefaultHeader
          loading={this.state.isLoading}
          loadingMsg={strings('load.Loading')}
          btnBackListener={() => this.props.navigation.goBack()}
        />

        <GiftedChat
          messages={this.state.messages}
          placeholder={strings('chatBot.digitHere')}
          locale="pt"
          onSend={messages => this.onSend(messages)}
          user={{ _id: this.state.ledger_id }}
          renderMessageText={this.renderMessageText}
          renderBubble={this.renderBubble}
          renderSend={props => this.renderSend(props)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
    Profile: state.providerProfile.providerProfile,
    ledger: state.providerProfile.ledger,
});

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpChatScreen);
