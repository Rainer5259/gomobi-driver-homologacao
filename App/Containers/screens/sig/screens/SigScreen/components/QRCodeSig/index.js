import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeSig = ({ link }) => {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <QRCode
        value={link}
        size={200}
      />
    </View>
  );
};

export default QRCodeSig;