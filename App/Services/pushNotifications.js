
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from "react-native";
import { strings } from "../Locales/i18n";
import image from '../Themes/WhiteLabelTheme/Images'
import * as constants from "../Util/Constants";
import NavigationService from './NavigationService';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import Sound from "react-native-sound";
import ProviderApi from "./Api/ProviderApi";
import { handlerException } from "./Exception";
/**
 * Prepare Push Notification Configuration
 */

export default class NotificationService {
  static sound = null;

  static requestPermissions() {
    PushNotification.requestPermissions(['alert', 'sound']);
  }

  static cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  static setApplicationIconBadgeNumber(value) {
    PushNotification.setApplicationIconBadgeNumber(value);
  }

  static notificationFinishIOS(notification) {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  }

  /**
   * @description create default channel.
   */
   static async createChannel() {
    await this.configureAudioPushNotification();

    PushNotification.createChannel(
      {
        channelId: 'fcm_default_channel',
        channelName: 'fcm',
        soundName: 'default',
        playSound: false,
        importance: 4,
        vibrate: true,
      },
      (created) => {
      },
    );
  }

  static async configureAudioPushNotification(play = false) {
    const providerApi = new ProviderApi();
    await providerApi
      .GetSettingsServer()
      .then(response => {
        let audioPushNotification = 'beep.wav';
        if(response.data.audio_push_notification)
          audioPushNotification = response.data.audio_push_notification;

        const filenameOrFile = audioPushNotification;
        const basePath = !audioPushNotification.includes('beep.wav') ? null : Sound.MAIN_BUNDLE;
        this.sound = new Sound(filenameOrFile, basePath, (error) => {
            if(error) {
              handlerException('pushNotifications.configureAudioPushNotification', error);
              return;
            }
        });
      })
      .catch(error => {
        handlerException('pushNotifications.configureAudioPushNotification', error);
        this.sound = new Sound("beep.wav", Sound.MAIN_BUNDLE, (error) => {
            if(error) {
              handlerException('pushNotifications.configureAudioPushNotification', error);
                return;
            }
        });
      });

      if (this.sound && play) {
        this.sound.setVolume(1);
        this.sound.play();
      }
  }

  /**
   * @description get FCM token and save on storage.
   */
   static handleOnRegister(token) {
    if(Platform.OS != constants.ANDROID){
      messaging()
        .getToken()
        .then((token) => {
          constants.device_token = token;
        });
    } else {
      constants.device_token = token.token;
    }
  }

  /**
   * Verify if a var is a Json
   */
  static isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  static getPushNotificationTitle (notification) {
    return (!NotificationService.isJson(notification.team)) ?
      notification.team :
      WPROJECT_NAME;
  }

  static getPushNotificationImage (notification) {
    return !NotificationService.isJson(notification.largeIconUrl) ? notification.largeIconUrl : '';
  }

  /**
   * Check if is help chat notification
   * @param {object} notification
   */
  static isHelp(notification) {
    const push = notification;

    if (push.userInteraction && push.is_help) {
      NavigationService.navigate('HelpChatScreen', {
        request_id: push.request_id
      })
    }
  }
  /**
   * @description create local notification.
   */

   static async handleOnNotification(notification) {
    const isAndroid = notification.channelId && Platform.OS == constants.ANDROID;
    const isIphone =
      notification.data['gcm.message_id'] && !notification.data.userInteraction;

    NotificationService.setApplicationIconBadgeNumber(0);

    const title = NotificationService.getPushNotificationTitle(notification);
    const image = NotificationService.getPushNotificationImage(notification);

    NotificationService.cancelAllNotifications();
    Sound.setCategory("Playback");
    try {
      if (this.sound) {
          this.sound.setVolume(1);
          this.sound.play();
      } else {
        await this.configureAudioPushNotification(true);
      }
    } catch (error) {
      handlerException("PushNotification > handleOnNotification > Sound don't exists", error);
    }


    if (isAndroid || isIphone) {
      PushNotification.localNotification({

        title,
        largeIcon: 'ic_notification',
        bigPictureUrl: image,
        smallIcon: 'ic_notification',
        message: notification.message,
        playSound: false,
        soundName: 'default',
        onlyAlertOnce: true,
        repeatType: null,
      });
    }

    NotificationService.notificationFinishIOS(notification);
    NotificationService.isHelp(notification);
  }

  static configure() {
	NotificationService.requestPermissions();
    NotificationService.createChannel();

    PushNotification.configure({

      onRegister: (token) => NotificationService.handleOnRegister(token),


      onNotification: (notification) => NotificationService.handleOnNotification(notification),

      onRegistrationError: function (err) {
        console.error(err.message, err);
      },


      senderID: constants.GCM_SENDER_ID,


      permissions: {
        alert: true,
        badge: true,
        sound: true
      },



      popInitialNotification: true,






      requestPermissions: true
    });
  }
}


/**
 * Function to display push when the race arrives, with the name of the user who requested
 * @param {String} name
 */
export const RideNotification = (name, enable_vehicle_information_button) => {
  PushNotification.localNotification({
    autoCancel: true,
    largeIcon: image.notification_icon,
    bigText: strings("pushNotification.bigText", {
      name: name
    }),
    subText: strings("pushNotification.subText"),
    title: enable_vehicle_information_button ? strings("pushNotification.title2") : strings("pushNotification.title"),
    message: strings("pushNotification.message"),
  })
}

/**
 * Function to display push when the race arrives, with the name of the user who requested
 * @param {String} name
 */
 export const DefaultMessage = async (title = strings("pushNotification.title2"), message = strings("pushNotification.message")) => {
  try {
    await playSound();
  } catch (e) {
        handlerException('pushNotifications.handleOnNotification', e);
  }

  PushNotification.localNotification({
    channelId: 'fcm_default_channel',
    channelName: 'fcm',
    playSound: false,
    importance: "max",
    vibrate: true,
    autoCancel: false,
    onlyAlertOnce: true,
    repeatType: null,
    title: title,
    message: message,
  })
}

const playSound = async () => {
  const providerApi = new ProviderApi();

   Sound.setCategory('Playback');
  await providerApi
    .GetSettingsServer()
    .then(response => {
      let audioPushNotification = 'beep.wav';
      if(response.data.audio_push_notification)
        audioPushNotification = response.data.audio_push_notification;

      const filenameOrFile = audioPushNotification;
      const basePath = !audioPushNotification.includes('beep.wav') ? null : Sound.MAIN_BUNDLE;
      let sound = new Sound(filenameOrFile, basePath, (error) => {
          if(error) {
            handlerException('pushNotifications.playSound', error);
            return;
          } else {
            sound.setVolume(1)
              .play((success) => {
                if (!success) {
                }
              });
          }
      });
    })
    .catch(error => {
      handlerException('pushNotifications.handleOnNotification', error);
      let sound = new Sound("beep.wav", Sound.MAIN_BUNDLE, (error) => {
          if(error) {
            handlerException('pushNotifications.handleOnNotification', error);
            return;
          } else {
            sound.setVolume(1)
              .play((success) => {
                if (!success){
                }
              });
          }
      });
    });
}

/**
 * Function to display push when the swite routes
 * @param {String} name
 */
export const SwiteRouteNotification = (name) => {
  PushNotification.localNotification({
    autoCancel: true,
    largeIcon: image.notification_icon,
    bigText: strings("pushNotification.switeRouteBigText", {
      name: name
    }),
    subText: strings("pushNotification.switeRouteSubText"),
    title: strings("pushNotification.switeRouteTitle"),
    message: strings("pushNotification.message"),
  })
}
