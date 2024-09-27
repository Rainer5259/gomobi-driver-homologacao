// Modules
import {Modal, Platform, StatusBar} from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Themes
import { firstBackground, PrimaryButton, SecondaryButton } from '../../../Themes/WhiteLabelTheme/WhiteLabel';

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

export const Title = styled.Text`
  color: ${PrimaryButton};
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 10px;
`;

export const Text = styled.Text`
  color: ${SecondaryButton};
  font-size: 25px;
  margin-left: 20px;
`;

export const Buttom = styled.TouchableOpacity`
  height: 35px;
  margin: 8px 0;
  flex-direction: row;
  align-items: center;
`;

export const Icon = styled(FontAwesome)`
  margin-right: 5px;
`;
