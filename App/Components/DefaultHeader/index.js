import React from "react";
import Toolbar from "../Toolbar";
import Loader from "../Loader";
import TitleBoxInfo from "../TitleBoxInfo";
import { Platform, View } from "react-native";

function DefaultHeader({
  title = undefined,
  subtitle = undefined,
  loading = false,
  loadingMsg,
  btnBack = true,
  btnBackListener,
  btnNext = false,
  btnNextListener,
  isMain,
  leftIcons = [],
  rightIcons = [],
  profileImg
}) {
  return (
    <View style={{ marginTop: Platform.OS === 'android' ? 0 : 25 }}>
      <Loader loading={loading} message={loadingMsg} />
      <Toolbar
        back={btnBack}
        handlePress={btnBackListener}
        isMain={isMain}
        nextStep={btnNext}
        nextPress={btnNextListener}
        img={profileImg}
        title={title}
        subtitle={subtitle}
        leftIcons={leftIcons}
        rightIcons={rightIcons}
      />
      {!!subtitle &&
        <View marginTop={20}>
          <TitleBoxInfo text={subtitle} key={"subtitle"} />
        </View>}
    </View>
  );
}
export default DefaultHeader;
