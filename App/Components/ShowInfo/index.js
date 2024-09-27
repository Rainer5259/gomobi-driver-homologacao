// Modules
import React from "react";
import { View, Image, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Styles
import styles from "./styles";

// Components
import Button from "../RoundedButton";

/**
 * A component to a container of few information before an action
 *
 * @param {String} title Information Title
 * @param {String} subtitle Information content
 * @param {String} icon icon with title
 * @param {NodeRequire} image Image
 * @param {Method} action Action going to be do
 * @param {String} btntext button text
 * @param {StyleSheet} customStyle custom style to present component
 */
function ShowInfoBeforeAction({ title, subtitle, icon, image=null, action, btntext, customStyle=null}) {

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.header}>
        <Icon name={icon} size={36}></Icon>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Image
            style={styles.image}
            source={image}
          />
        </View>
        <Button
          onPress={action}
          text={btntext}
        />
      </View>
    </View>
  )
}

export default ShowInfoBeforeAction;
