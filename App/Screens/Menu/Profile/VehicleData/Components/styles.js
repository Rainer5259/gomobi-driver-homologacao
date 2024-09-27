// Modules
import { StyleSheet } from "react-native";
import _ from "lodash"

// Themes
import { ApplicationStyles } from '../../../../../Themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  sectionInputs: {
    marginTop: 10,
    paddingHorizontal: 30,
    paddingBottom: 80
  },
  parentContainer: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
});

