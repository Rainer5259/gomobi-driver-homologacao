// Modules
import styled from "styled-components/native";
import { ActivityIndicator } from "react-native";

// Themes
import { PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel";

export const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  margin: 15px;
  height: 40px;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  padding-horizontal: 10px;
  background-color: ${PrimaryButton};
`;

export const Text = styled.Text`
  color: #ffffff;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
`;

export const Spinner = styled(ActivityIndicator).attrs({ color: "#fff" })`
  margin-left: -28px;
  margin-right: 8px;
`;
