import React, { useCallback } from 'react'
import { strings } from '../../Locales/i18n';
import {  ButtomCancel, ButtomOk, CloseRanger, Container, ContainerButtons, ContainerInner, ContainerModal, RNStatusBar, TextCancel, TextOk, Title } from './styles';

interface IProps {
  showModal: Boolean;
  setShowModal: React.Dispatch<Boolean>;
  title: String;
  noCloseModal?: Boolean;
  onFinished?: React.Dispatch<void | Promise<void>>;
  buttonOk: {
    title: String;
    onPress: React.Dispatch<void | Promise<void>>;
  };
  buttonCancel?: {
    title: String;
    onPress: React.Dispatch<void | Promise<void>>;
  }
}

const Modal: React.FC<IProps> = ({
  showModal = false,
  setShowModal,
  onFinished,
  title,
  buttonOk,
  buttonCancel,
  noCloseModal = false
}) => {

  const HandleCloseModal = useCallback(() => {
    if (noCloseModal) return
    if (setShowModal) setShowModal(false);
  }, [setShowModal]);

  const HandleButtonChoice = useCallback(async (onPress?: React.Dispatch<void | Promise<void>>) => {
    if(onPress) await onPress()

    if(onFinished) await onFinished()

    HandleCloseModal()
  }, [setShowModal]);

  return (
    <ContainerModal
      visible={!!showModal}
      animationType="fade"
      transparent
      onRequestClose={HandleCloseModal}
    >
      <RNStatusBar backgroundColor="#00000080" />
      <Container>
        <CloseRanger onPress={HandleCloseModal}></CloseRanger>
        <ContainerInner>
          <Title>{title}</Title>
          <ContainerButtons>
            <ButtomOk onPress={() => HandleButtonChoice(() => buttonOk.onPress())}>
              <TextOk>{buttonOk.title}</TextOk>
            </ButtomOk>

            <ButtomCancel onPress={() => HandleButtonChoice(() => buttonCancel?.onPress())}>
              <TextCancel>{buttonCancel?.title || strings('general.cancel')}</TextCancel>
            </ButtomCancel>
          </ContainerButtons>
        </ContainerInner>
      </Container>
    </ContainerModal>
  );
}

Modal.defaultProps = {
  showModal: false
}

export default Modal
