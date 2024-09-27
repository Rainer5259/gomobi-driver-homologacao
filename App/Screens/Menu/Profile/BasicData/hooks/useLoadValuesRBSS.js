import AsyncStorage from "@react-native-community/async-storage";

// Locales
import moment from "moment";
import useValidator from "../../../../../Hooks/useValidator";

/**
* @description Function responsavel por carregar informações do motorista da primeira tela (Tela que tem nome, cpf, senha e etc..),
* E usada em dois locais.
* Ao cadastrar um novo motorista.
* E ao entrar atraves do perfil logado.
* @returns Objetivo da Function é salvar e carregar informações salvas no storage ou informações do motorista selecionado.
*
* As informacoes salvas no storage sao para que caso aconteca algum problema e por ventura o app feche, ao voltar na tela as informações são pre carregadas
* evitando assim ter que informar novamente.
*/
export default function useLoadValuesRBSS() {

  const validator = useValidator();

  /**
    * @description Caso tenha informacoes salvas no storage não executa o codigo de quando é feito navegacao atraves de perfil logado.
    * O storage só vai ter valor quando acontecer algum problema, visto que ao ir
    * para proxima tela é deletado as informacoes do storage por serem enviadas para o banco ao ir para a proxima tela.
    * Proxima tela apos esta e 'RegisterAddressStepScreen'
    */
  async function getProviderInformation(props, state) {
    const loadedValuesScreenCrash = await loadValues(props);

    if (!props.editScreen && !infoSaved(props) && loadedValuesScreenCrash) {
      return loadedValuesScreenCrash;
    }

    const phone = validator.phoneMask(getProvider(props).phone);
    const birthday = moment(getProvider(props).birthday || moment(),'DD/MM/YYYY').format('L')

    return {
      social_unique_id:"",
      value: {
        firstName: getProvider(props).firstName,
        lastName: getProvider(props).lastName,
        document: getProvider(props).document,
        cpf: getProvider(props)?.cpf,
        cnpj: getProvider(props)?.cnpj,
        phone,
        email: getProvider(props).email,
        indicationCode: getProvider(props).indicationCode,
        gender: getProvider(props).gender,
        typePerson: getProvider(props).typePerson || 'f',
        ddd: getProvider(props).ddd,
        birthday,
        password: getProvider(props).password || "",
        confirmPassword: getProvider(props).confirmPassword || "",
      },
    };
  }

  //basicProvider info editrecord

  function getProvider(props) {
    return props.editScreen ? props.basicProvider : props.basicRegister;
  }

  /**
   *
   * @param {HtmlHTMLAttributes & Variaveis do banco} props
   * @returns Verifica se o registro ja esteja salvo no banco para evitar verificar no storage
   */
  function infoSaved(props) {
    return (!!props.basicRegister.firstName &&
      !!props.basicRegister.lastName &&
      !!props.basicRegister.email);
  }

  /**
   * @returns Busca os valores dos campos salvos no storage para caso
   * o app apresentar algum problema e fechar, usar as informações ja preenchidas
   */
  async function loadValues(props) {
    if (props.editScreen) return null;
    const dadosString = await AsyncStorage.getItem('@RegisterBasicStepScreen');
    if (dadosString) {
      return JSON.parse(dadosString);
    }
    return null;
  }

  /**
   * @description salva os valores dos campos no storage para caso
   * o app apresentar algum problema e fechar, usar as informações ja preenchidas
   * @param {State react} state
   */
  function saveValues(state) {
    const dados = {
      avatarSource: state.value.avatarSource,
      value: {
        firstName: state.value.firstName,
        lastName: state.value.lastName,
        document: state.value.document,
        cpf: state.value.cpf,
        cnpj: state.value.cnpj,
        document2: state.value.document2,
        cpf: state.value.cpf,
        cnpj: state.value.cnpj,
        birthday: state.value.birthday,
        ddd: state.value.ddd,
        typePerson: state.value.typePerson,
        gender: state.value.gender,
        phone: state.value.phone,
        email: state.value.email,
        indicationCode: state.value.indicationCode,
      }
    }

    AsyncStorage.setItem('@RegisterBasicStepScreen', JSON.stringify(dados));
  }

  return { saveValues, loadValues, getProviderInformation }

}
