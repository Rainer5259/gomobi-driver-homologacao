// Modules
import { StyleSheet, PixelRatio } from 'react-native'

export default StyleSheet.create({
  boxAvatar: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 20,
    paddingHorizontal: 0,
    borderBottomColor: "#ddd",
    borderBottomWidth: 3 / PixelRatio.get(),
    marginHorizontal: 24,
    zIndex: 9
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20
  },
  areaAvatar: {
    width: 66,
    height: 66,
    borderRadius: 45,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 3,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    zIndex: 1,
    padding: 3
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 45
  },
  name: {
    width: 200,
    color: "#313131",
    fontWeight: "bold",
  },
  editText: {
    fontSize: 10,
    color: "#2E2E2E",
    width: 200,
    marginTop: 7
  },
  contentMenu: {
    height: 64,
  },
  txtMenu: {
    flex:1,
    color:'#4a4a4a',
    fontSize: 14,
    fontWeight: '700',
    textAlignVertical:'center',
    marginLeft: 10,
  },
  iconMenu: {
    marginRight: 10,
    marginLeft: 24,
  },
})
