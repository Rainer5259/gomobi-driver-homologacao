// Modules
import {Modal, Platform, StatusBar} from 'react-native';
import styled, {css} from 'styled-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Themes
import { firstBackground, PrimaryButton, projectColors, SecondaryButton, textButton, textButtonLight } from '../../Themes/WhiteLabelTheme/WhiteLabel';

export const RNStatusBar = styled(StatusBar)``;

export const ContainerModal = styled(Modal)``;

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const CloseRanger = styled.TouchableOpacity`
  flex: 1;
`;

export const ContainerInner = styled.View`
  background-color: ${firstBackground};
  padding: 10px 25px;
  margin-top: ${Platform.OS === 'ios' ? '20px' : '0'};
`;

export const ContainerButtons = styled.View`
  flex-direction: row-reverse;
  justify-content: space-between;
`;

export const Title = styled.Text`
  color: ${PrimaryButton};
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 10px;
`;

export const TextOk = styled.Text`
  color: ${textButton};
  font-size: 25px;
  text-align: center;
`;
export const TextCancel = styled.Text`
  color: ${textButtonLight};
  font-size: 25px;
  text-align: center;
`;

export const ButtomOk = styled.TouchableOpacity`
  width:48%;
  padding: 4px;
  margin: 16px 0;
  align-items: center;
  border-radius: 10px;
  background-color: ${PrimaryButton};
  elevation: 3;
`;

export const ButtomCancel = styled.TouchableOpacity`
  width: 48%;
  padding: 4px;
  margin: 16px 0;
  align-items: center;
  border-radius: 10px;
  background-color: ${projectColors.lightGray};
  elevation: 3;
`;
