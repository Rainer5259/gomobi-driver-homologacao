// Modules
import { StyleSheet } from 'react-native'

// Themes
import { ApplicationStyles } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  parentContainer: {
		flex: 1,
	},
	toolbar: {
		height: 56,
		padding: 8,
		backgroundColor: '#fbfbfb',
		shadowColor: '#000',
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 0,
		elevation: 3,
		alignItems: 'center',

		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 0
	},
	screen:{
		backgroundColor: '#ffffff'
	},
	areaAvatar: {
		width: 100,
		height: 60,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0,
		shadowRadius: 0,
		elevation: 3,
		overflow: 'hidden',
		position: 'absolute',
		right: 5,
		top: -7,
		backgroundColor: '#ffffff',
		zIndex: 1,
		paddingTop: 20,
		paddingLeft: 10,
		paddingRight: 10,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
  webview:{




	padding: 20,
	paddingTop: 60
  }
})
