import SigApi from "../../service/SigAPi";
import { Share } from "react-native";
import { Modal } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import QRCodeSig from './../../components/QRCodeSig';
import { strings } from "../../../../../../../Locales/i18n";

export default function useUser() {
  let api = new SigApi();


  const ModalQrCode = ({ handleSharedQRcode, urlToShared, visible }) => {
    return (
      <Modal
        style={{ backgroundColor: '#FBFBFB' }}
        useNativeDriver
        backdropColor="#FBFBFB"
        backdropOpacity={1}
        on
        visible={visible}
        >
        <AntDesign name="close" size={25} color="#000" onPress={ ()=> handleSharedQRcode(false)} />
        <QRCodeSig link={urlToShared} />
      </Modal>
    )
  }

  const handleToShared = (urlToShared, providerName) => {
    Share.share({
      message: strings("indication.text_invitation", {providerName: providerName, urlToShared: urlToShared}),
      title: "Sig",
    }, {});
  }

  /**
   * @description Verifica os dados do usuario, retornar se ele esta autorizado a usar a landpage
   * @param {Number} tokeUser
   * @param {Number} id
   * @returns
   */
  const euMais10 = async (id, tokeUser) => {
    const response = await api.getIndication(id, tokeUser);

    if (!response.data.success) throw new Error(response.data.error || response.data.errors);

    const user = await api.getUserAuthorized(response.data.referral_code);
    user.referralCode = response.data.referral_code;

    const banner = await api.getIndicationBanner(id, tokeUser, user.referralCode);
    user.indicationBanner = banner.data?.url;

    return user;
  }

  return { euMais10, handleToShared, ModalQrCode }
}
