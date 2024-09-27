// Modules
import React, { useState } from "react";

// Styles
import { Wrapper, Text, Spinner } from "./styles";

const ActionButton = ({ text, onPress, onPressSync, activeLoader }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onButtonPress = async () => {
    try {
      setIsLoading(true);
      if (onPressSync) return onPressSync();
      await onPress();
    } catch (e) {
      throw new Error(e);
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <Wrapper onPress={onButtonPress} disabled={isLoading}>
      {(isLoading || activeLoader) && <Spinner />}
      <Text>{text}</Text>
    </Wrapper>
  );
};

export default ActionButton;
