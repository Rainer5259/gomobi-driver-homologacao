import { Alert, Platform } from "react-native";
import { MaskService } from "react-native-masked-text";
import { ANDROID, IOS, PROVIDER_STORAGE } from "../../Util/Constants";
import Provider from "../../Models/Provider";
import { strings } from "../../Locales/i18n";
import moment from "moment";

const useValidator = () => {

  const msgErrorBirthDate18 = strings('register.under_eighteen');
  const msgErrorDate = strings('register.empty_birth_date');

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidDate = (date) => {
    let mask = date._f;
    if (!mask) {
      mask = listMaskDate().find(newMask => {
        if (moment(date, newMask).isValid()) {
          mask = newMask;
          return;
        }
      }
      );
    }
    return moment(date, mask).isValid();
  }

  const listMaskDate = () => {
    return ['DD/MM/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY/MM/DD', 'MM/DD/YYYY', 'DD/MM/YY', 'DD-MM-YY', 'MM-DD-YY', 'YY-MM-DD', 'YY-MM-DD', 'YY/MM/DD', 'YY/MM/DD', 'DD/MM', 'MM/DD', 'DD-MM', 'MM-DD', 'YYYY-MM', 'MM-YYYY', 'YYYY/MM', 'MM/YYYY', 'YYYY', 'YY'];
  }

  const convertStringToMoment = (date) => {
    let mask = listMaskDate().filter(mask => moment(date, mask).isValid())[0];
    return moment(date, mask);
  }

  const convertMomentToDate = (dateMoment) => {
    let mask = dateMoment._f;

    if (!mask) mask = listMaskDate.filter(mask => isValidDate(moment(dateMoment, mask)))[0];

    const date = moment(dateMoment, mask).toDate();// Independente do formato, o moment converte para o formato padrão que vem do banco
    return moment(moment(date, 'DD/MM/YYYY')).toDate();// sempre vou retornar o padrao brasileiro
  }

  const checkBirthDay = (date) => {
    const birthDate = moment(date, 'DD/MM/YYYY');
    const today = moment();
    const age = today.diff(birthDate, 'years');

    let msg = '';

    if (!birthDate) {
      msg = msgErrorDate;
    } else if (age < 18) {
      msg = msgErrorBirthDate18;
    }
    return msg
  }


  const phoneMask = (phoneNumber) => {
    return phoneNumber?.replace(/(\d{2})(\d{5})(\d{4})/, "$1 $2 $3");
  }


  const isValidCPForCNPF = (type, value) => {
    return MaskService.isValid(type, value);
  }

  const removeSpecialCaracter = (value) => {
    return value.replace(/\D/g, "");
  }

  const showAlert = (status) => {
    let msg;

    if (status == 0) {
      msg = strings("register.empty_picture");
    } else if (status == 1) {
      msg = strings("register.invalid_document");
    } else if (status == 2) {
      msg = "Atenção, a Localização em seu aparelho não está ativa!";
    }

    if (Platform.OS == ANDROID) {
      Alert.alert(
        strings("register.invalid"),
        msg,
        [{ text: strings("register.close") }],
        { cancelable: true }
      );
    } else if (Platform.OS == IOS) {
      Alert.alert(
        strings("register.invalid"),
        msg,
        [{ text: strings("register.close") }],
        { cancelable: true }
      );
    }
  }

  const updateToken = (changedToken) => {

    this.props.changeToken(changedToken)
    let arrayProviderAux = this.props.providerProfile
    arrayProviderAux._token = changedToken
    this.props.onProviderAction(arrayProviderAux)
    Provider.require(Provider)
    Provider.restore(PROVIDER_STORAGE).then(provider => {
      if (provider !== null) {
        this.provider = provider
        this.provider.setToken(changedToken)
        this.provider.store(PROVIDER_STORAGE)
      }
    })

  }


  return { isValidEmail, isValidCPForCNPF, showAlert, removeSpecialCaracter, phoneMask, checkBirthDay, isValidDate, convertMomentToDate, convertStringToMoment };
}

export default useValidator;