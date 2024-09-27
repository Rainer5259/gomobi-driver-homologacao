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
export default function useVehicleLoadValues() {

  /**
   * @description Remocao das informacoes da tela anterior, caso seja chamado este metodo quer dizer que a informacao foi salva no banco
   */
  async function deleteInfoByStorage() {
    await AsyncStorage.removeItem('@RegisterAddressStepScreen');
  }

  async function getProviderVehicleInformation(props, editScreen) {

    const loadedValuesScreenCrash = await loadValues();

    /**
     * @description Carrega info do storage quando ocorrido algum problema na hora do cadastro, ao abrir o app
     * e voltar na tela do passo-a-passo é recupera as info já preenchidas
     */
    if (!editScreen && !infoSaved(props) && loadedValuesScreenCrash) {
      return loadedValuesScreenCrash;
    } else if (editScreen) {
      /**
       * @description Carrega info salva no banco ao abre a tela pelo Profile > Vehicle Data
       */
      return {
        value: {
          carNumber: props.vehicleProvider.carNumber,
          carModel: props.vehicleProvider.carModel,
          carBrand: props.vehicleProvider.carBrand,
          carColor: props.vehicleProvider.carColor,
          carManufaturingYear: props.vehicleProvider.carManufaturingYear,
          carModelYear: props.vehicleProvider.carModelYear,
        }
      }
    }
    /**
     * @description Carrega info salva quando volta entre as telas no cadastro inicial passo-a-passo
     */
    return {
      value: {
        carNumber: props.vehicleRegister.carNumber,
        carModel: props.vehicleRegister.carModel,
        carBrand: props.vehicleRegister.carBrand,
        carColor: props.vehicleRegister.carColor,
        carManufaturingYear: props.vehicleRegister.carManufaturingYear,
        carModelYear: props.vehicleRegister.carModelYear,
      }
    }
  }

  /**
 *
 * @param {HtmlHTMLAttributes & Variaveis do banco} props
*  @returns Verifica se o registro ja esteja salvo no banco para evitar verificar no storage
 */
  function infoSaved(props) {
    return !!props.vehicleRegister &&
      !!props.vehicleRegister.carNumber &&
      !!props.vehicleRegister.carModel &&
      !!props.vehicleRegister.carBrand &&
      !!props.vehicleRegister.carColor;
  }

  /**
   * @returns Busca os valores dos campos salvos no storage para caso
   * o app apresentar algum problema e fechar, usar as informações ja preenchidas
   */
  async function loadValues() {
    const dadosString = await AsyncStorage.getItem('@RegisterVehicleStepScreen');
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
        carNumber: state.value.carNumber,
        carModel: state.value.carModel,
        carBrand: state.value.carBrand == ' - ' ? undefined : state.value.carBrand,
        carColor: state.value.carColor,
      }
    };

    await AsyncStorage.setItem('@RegisterVehicleStepScreen', JSON.stringify(dados));
  }

  return { saveValues, loadValues, getProviderVehicleInformation, deleteInfoByStorage }

}
