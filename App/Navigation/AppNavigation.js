import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from "react-navigation";
import ServiceUserBoardScreen from '../Containers/ServiceUserBoardScreen'
import ServiceRequestScreen from '../Containers/ServiceRequestScreen'

import TermsScreen from '../Containers/TermsScreen'
import AddBalanceScreen from '../Containers/AddBalanceScreen'


import MyRequestsScreen from '../Containers/MyRequestsScreen'
import MyRequestDetail from '../Containers/MyRequestDetail'
import InvoiceScreen from '../Containers/InvoiceScreen'
import InvoiceScreenMoney from '../Containers/InvoiceScreenMoney'
import ReceiveMoneyScreen from '../Containers/ReceiveMoneyScreen'
import ServiceFinishedScreen from '../Containers/ServiceFinishedScreen'
import PasswordScreen from '../Containers/PasswordScreen'
import MainScreen from '../Containers/MainScreen'
import LoginScreen from '../Containers/LoginScreen'
import SplashScreen from '../Containers/SplashScreen'

import PhoneValidationScreen from '../Containers/PhoneValidationScreen'
import LoginMainScreen from '../Containers/LoginMainScreen'
import DeleteAccountScreen from '../Containers/DeleteAccountScreen'
import ChatScreen from '../Containers/ChatScreen'
import HelpChatScreen from "../Containers/HelpChatScreen"
import ConfigScreen from '../Containers/ConfigScreen'
import AddCardScreen from '../Containers/AddCardScreen'
import ManageLanguageScreen from '../Containers/ManageLanguageScreen'
import ManagePaymentScreen from '../Containers/ManagePaymentScreen'
import ReportMainScreen from '../Containers/ReportMainScreen'
import PixQrCodeScreen from '../Containers/PixQrCodeScreen'
import TransactionsScreen from '../Containers/TransactionsScreen'
import HelpScreen from '../Containers/HelpScreen'
import EmergencyContactScreen from '../Containers/EmergencyContactScreen'
import DestinationScreen from '../Containers/DestinationScreen'


import RegisterAddressStepScreen from '../Containers/RegisterAddressStepScreen'
import RegisterServicesStepScreen from '../Containers/RegisterServicesStepScreen'

import RegisterDocumentsStepScreen from '../Containers/RegisterDocumentsStepScreen'
import RegisterBankStepScreen from '../Containers/RegisterBankStepScreen'
import SearchAllBanksScreen from '../Containers/SearchAllBanksScreen'
import RegisterFinishedScreen from '../Containers/RegisterFinishedScreen'

import RegisterScreenWeb from '../Containers/screens/register/RegisterScreenWeb';

import SharedScreen from '../Containers/screens/sig/screens/SharedScreen';
import SigLandingPage from '../Containers/screens/sig/screens/SigLandingPage';
import SigScreen from '../Containers/screens/sig/screens/SigScreen';


/**
 * @description Screen Profile
 */

//Vehicle
import RegisterVehicleStepScreen from '../Screens/Menu/Profile/VehicleData/RegisterVehicleStepScreen';
import EditVehicleStepScreen from '../Screens/Menu/Profile/VehicleData/EditVehicleStepScreen';
//

//Basic Info
import RegisterBasicStepScreen from '../Screens/Menu/Profile/BasicData/RegisterBasicStepScreen';
import EditBasicStepScreen from '../Screens/Menu/Profile/BasicData/EditBasicStepScreen';

import EditProfileMainScreen from '../Containers/EditProfileMainScreen'

import EditAddressStepScreen from '../Containers/EditAddressStepScreen'
import EditServicesStepScreen from '../Containers/EditServicesStepScreen'

import EditBankStepScreen from '../Containers/EditBankStepScreen'
import EditDocumentStepScreen from '../Containers/EditDocumentStepScreen'
import ChangePasswordScreen from '../Containers/ChangePasswordScreen'

import ScheduleRequestScreen from '../Containers/ScheduleRequestScreen'
import ScheduleDetailScreen from '../Containers/ScheduleDetailScreen'
import SendMessageHelpScreen from '../Containers/SendMessageHelpScreen'
import CleaningFeeScreen from '../Containers/CleaningFeeScreen'
import VersionScreen from '../Containers/VersionScreen'
import ProminentDisclosure from '../Containers/ProminentDisclosure';

import CreateKnobRequestScreen from '../Containers/CreateKnobRequestScreen';
import SetAddressScreen from '../Containers/SetAddressScreen';
import SetAddressOnMapScreen from '../Containers/SetAdressOnMapScreen';
import WaitingRideModalScreen from '../Containers/WaitingRideModalScreen';

import PriceScreen from '../Containers/PriceScreen';

import styles from './Styles/NavigationStyles'

import ChildrenScreen from './ComponentsNavigation'



var parentScreens = {
	ChatScreen: { screen: ChatScreen },
	HelpChatScreen: { screen: HelpChatScreen },
	EmergencyContactScreen: { screen: EmergencyContactScreen },
	DestinationScreen: { screen: DestinationScreen },
  SigScreen: { screen: SigScreen },
  SharedScreen: { screen: SharedScreen },
  SigLandingPage: { screen: SigLandingPage },
	ServiceUserBoardScreen: {
		screen: ServiceUserBoardScreen ,
		navigationOptions: {
        	gesturesEnabled: false,
    	}
	},
	ServiceRequestScreen: { screen: ServiceRequestScreen },

	TermsScreen: { screen: TermsScreen },
	ConfigScreenLocal: { screen: ConfigScreen },
	AddCardScreen: { screen: AddCardScreen },
	ManageLanguageScreen: { screen: ManageLanguageScreen },
	ManagePaymentScreen: { screen: ManagePaymentScreen },
	AddBalanceScreenLib: { screen: AddBalanceScreen },

	ProminentDisclosure: { screen: ProminentDisclosure },

	MyRequestsScreen: { screen: MyRequestsScreen },
	MyRequestDetail: { screen: MyRequestDetail },
	InvoiceScreen: { screen: InvoiceScreen },
	InvoiceScreenMoney: { screen: InvoiceScreenMoney },
	ReceiveMoneyScreen: { screen: ReceiveMoneyScreen },
	ServiceFinishedScreen: { screen: ServiceFinishedScreen },
	PasswordScreen: { screen: PasswordScreen },
	RegisterBasicStepScreen: { screen: RegisterBasicStepScreen },
	RegisterScreenWeb: { screen: RegisterScreenWeb },
	RegisterAddressStepScreen: { screen: RegisterAddressStepScreen },
	RegisterServicesStepScreen: { screen: RegisterServicesStepScreen },
	RegisterVehicleStepScreen: { screen: RegisterVehicleStepScreen },
	RegisterBankStepScreen: { screen: RegisterBankStepScreen },
	RegisterDocumentsStepScreen: { screen: RegisterDocumentsStepScreen },
	SearchAllBanksScreen: { screen: SearchAllBanksScreen },
	EditProfileMainScreen: { screen: EditProfileMainScreen },
	EditBasicStepScreen: { screen: EditBasicStepScreen },
	EditAddressStepScreen: { screen: EditAddressStepScreen },
	EditServicesStepScreen: { screen: EditServicesStepScreen },
	EditVehicleStepScreen: { screen: EditVehicleStepScreen },
	EditBankStepScreen: { screen: EditBankStepScreen },
	EditDocumentStepScreen: { screen: EditDocumentStepScreen },
	ChangePasswordScreen: { screen: ChangePasswordScreen },
	RegisterFinishedScreen: { screen: RegisterFinishedScreen },
	MainScreen: { screen: MainScreen },
	LoginScreen: { screen: LoginScreen },
	SplashScreen: { screen: SplashScreen },

	ScheduleRequestScreen: { screen: ScheduleRequestScreen },
	ScheduleDetailScreen: { screen: ScheduleDetailScreen },
	LoginMainScreen: { screen: LoginMainScreen },
	DeleteAccountScreen: { screen: DeleteAccountScreen },
	PhoneValidationScreen: { screen: PhoneValidationScreen },
	ReportMainScreen: { screen: ReportMainScreen },
	PixQrCodeScreen: { screen: PixQrCodeScreen },
	TransactionsScreen: { screen: TransactionsScreen },
	HelpScreen: { screen: HelpScreen },
	SendMessageHelpScreen: { screen: SendMessageHelpScreen },
	CleaningFeeScreen: { screen: CleaningFeeScreen },
	VersionScreen: { screen: VersionScreen },

	CreateKnobRequestScreen: { screen: CreateKnobRequestScreen },
	SetAddressScreen: { screen: SetAddressScreen },
	SetAddressOnMapScreen: { screen: SetAddressOnMapScreen},
	WaitingRideModalScreen: { screen: WaitingRideModalScreen },
	PriceScreen: { screen: PriceScreen }
}



const allScreens = {
	...parentScreens,
	...ChildrenScreen,
};


const PrimaryNav = createStackNavigator(allScreens, {

	headerMode: 'none',
	initialRouteName: 'SplashScreen',
	defaultNavigationOptions: {
		headerStyle: styles.header
	}
})

const App = createAppContainer(PrimaryNav);

export default App;

