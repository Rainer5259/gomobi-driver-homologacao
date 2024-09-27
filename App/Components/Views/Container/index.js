import { View, ScrollView } from "react-native";
import { ApplicationStyles } from "../../../Themes";
import Button from "../../RoundedButton";
import DefaultHeader from "../../DefaultHeader";

const Container = (
  {
    children,
    actionForm,
    disabledButtonAction,
    labelAction,
    labelLoader,
    isLoading = false,
    headerProps
  }
) => {
  return (

    <View style={ApplicationStyles.screen.container}>
      <DefaultHeader
        loading={isLoading}
        loadingMsg={labelLoader}
        btnBack={headerProps.isBackButtonVisible}
        btnBackListener={headerProps.handleBackPress}
        btnNext={headerProps.isNextButtonVisible}
        btnNextListener={headerProps.handleNextPress}
        title={headerProps.title}
        subtitle={headerProps.description}
      />

      <ScrollView
        style={ApplicationStyles.screen.parentContainer}
        keyboardShouldPersistTaps="handled">

        <View style={ApplicationStyles.screen.sectionInputs}>
          {children}

          <Button
            onPress={actionForm}
            text={labelAction}
            disabled={disabledButtonAction}
          />
        </View>
      </ScrollView>
    </View>
  )

}

export default Container;
