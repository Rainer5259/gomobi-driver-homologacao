import AsyncStorage from "@react-native-community/async-storage";


/**
* @description Function responsavel por carregar informações do motorista, ela é usada em dois locais.
* Ao cadastrar um novo motorista. 
* E ao entrar atraves do perfil logado.
* @returns Objetivo da Function é salvar e carregar informações salvas no storage ou informações do motorista selecionado.
*
* As informacoes salvas no storage sao para que caso aconteca algum problema e por ventura o app feche, ao voltar na tela as informações são pre carregadas
* evitando assim ter que informar novamente. 
*/
export default function useLoadValuesRASS() {

  /**
   * @description Remocao das informacoes da tela anterior, caso seja chamado este metodo quer dizer que a informacao foi salva no banco
   */
  async function deleteInfoByStorage() {
    await AsyncStorage.removeItem('@RegisterBasicStepScreen');
  }

  /**
    * @description Caso tenha informacoes salvas no storage não executa o codigo de quando é feito navegacao atraves de perfil logado.
    * O storage só vai ter valor quando acontecer algum problema, visto que ao ir 
    * para proxima tela é deletado as informacoes do storage por serem enviadas para o banco ao ir para a proxima tela.
    * Proxima tela apos esta e ''
    */
  async function getAdddressInfo(props) {

    const loadedValuesScreenCrash = await loadValues();

    if (!infoSaved(props) && loadedValuesScreenCrash) {
      return loadedValuesScreenCrash;
    }

    return {
      value: {
        address: props.addressRegister.address,
        complement: props.addressRegister.complement,
        zipCode: props.addressRegister.zipCode
      },
      valueNumber: {
        number: props.addressRegister.number
      },
      valueNeighborhood: {
        neighborhood: props.addressRegister.neighborhood
      },
      valueCity: {
        city: props.addressRegister.city
      },
      valueState: {
        state: props.addressRegister.state
      },
      cepValidationWeb: true
    }
  }
  /**
   * 
   * @param {HtmlHTMLAttributes & Variaveis do banco} props 
   * @returns Verifica se o registro ja esteja salvo no banco para evitar verificar no storage
   */
  function infoSaved(props) {
    return props.addressRegister.zipCode &&
      props.addressRegister.address &&
      props.addressRegister.number &&
      props.addressRegister.neighborhood &&
      props.addressRegister.city &&
      props.addressRegister.state;
  }

  /**
   * @returns Busca os valores dos campos salvos no storage para caso 
   * o app apresentar algum problema e fechar, usar as informações ja preenchidas
   */
  async function loadValues() {
    const dadosString = await AsyncStorage.getItem('@RegisterAddressStepScreen');
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
  async function saveValues(state) {
    const dados = {
      value: {
        zipCode: state.value.zipCode,
        address: state.value.address,
        complement: state.value.complement,
      },
      valueNumber: {
        number: state.valueNumber.number,
      },
      valueNeighborhood: {
        neighborhood: state.valueNeighborhood.neighborhood,
      },
      valueCity: {
        city: state.valueCity.city,
      },
      valueState: {
        state: state.valueState.state
      },
      cepValidationWeb: true
    }

    await AsyncStorage.setItem('@RegisterAddressStepScreen', JSON.stringify(dados));
  }

  return { saveValues, loadValues, getAdddressInfo, deleteInfoByStorage }

} 