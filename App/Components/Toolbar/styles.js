// Modules
import { StyleSheet, Platform, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { BootstrapColors } from '../../Themes/WhiteLabelTheme/WhiteLabel';

var { width } = Dimensions.get('window');

export const IconButton = styled.TouchableOpacity`
  padding-vertical: 5px;
  width: 60px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const styles = StyleSheet.create({
  mainToolbarView: {
    width: width,
    height: 90,
    position: "absolute",
    top: 0
  },
  pageToolbarView: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 20,
    maxHeight: 80,
     width: "100%",
    justifyContent: 'space-between',
    elevation: 1,
    paddingHorizontal: 10,
    marginVertical: 20
  },
  iconView: {
    flex: 0,
    flexDirection: 'row',
    minWidth: 50,
    maxWidth: 150,
    paddingTop: 12,
    height: 50,
  },
  iconButton: {
    alignItems: 'center',
    height: 40,
    width: '100%',
  },
  toolbarTitle: {
    color: BootstrapColors.colorTitleForm,
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: 'stretch',
    flex: 1,
    paddingTop: 10
  },
  iconPress: {
    position: "absolute",
    top: 10,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
  },
  areaImage: {
    position: "absolute",
    top: Platform.OS === 'android' ? 10 : 35,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
    borderRadius: 45,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowColor: "#000",
    elevation: 3,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    padding: 3,
    borderColor: "#fff",
    borderWidth: 4
  },
  img: {
    height: 60,
    width: 60,
  },

});
