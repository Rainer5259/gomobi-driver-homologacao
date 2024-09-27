/**
 * UserUtils class
 */
import React from 'react';
import NetInfo from "@react-native-community/netinfo";

class User {

  constructor() {

  }

  isConnected() {
    return NetInfo.isConnected.fetch();
  }

  checkInfoConnection() {
    return NetInfo.getConnectionInfo();
  }

}


export default User;
