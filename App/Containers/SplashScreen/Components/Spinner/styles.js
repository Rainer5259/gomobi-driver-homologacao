import styled from "styled-components/native";
import { ActivityIndicator } from "react-native";

export const SpinnerL = styled(ActivityIndicator).attrs({ color: "#fff" })`
  height: 40px;
  width: 40px;
`;