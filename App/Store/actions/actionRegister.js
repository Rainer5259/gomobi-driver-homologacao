export const changeProviderId = value => {
    return {
        type: 'CHANGE_PROVIDER_ID',
        payload: value
    }
}


export const changeRegisterBasicSocial = (socialId, socialFirstName, socialLastName, socialEmail, type, deviceToken, loginBy) => {
    return {
        type: 'CHANGE_REGISTER_BASIC_SOCIAL',
        payload: { socialId, socialFirstName, socialLastName, socialEmail, type, deviceToken, loginBy }
    }
}


export const resetRegisterBasicSocial = () => {
    return {
        type: 'RESET_REGISTER_BASIC_SOCIAL'
    }
}


export const changeRegisterBasic = (firstName,
  lastName,
  birthday,
  ddd,
  gender,
  typePerson,
  document,
  phone,
  email,
  indicationCode,
  picture) => {
  return {
    type: 'CHANGE_REGISTER_BASIC',
    payload: {
      firstName,
      lastName,
      birthday,
      ddd,
      gender,
      typePerson,
      document,
      phone,
      email,
      indicationCode,
      picture
    }
  }
}


export const changeRegisterBasicPhone = phone => {
    return {
        type: 'CHANGE_REGISTER_BASIC_PHONE',
        payload: phone
    }
}


export const resetRegisterBasic = () => {
    return {
        type: 'RESET_REGISTER_BASIC'
    }
}


export const changeRegisterAddress = (zipCode, address, number, complement, neighborhood, city, state) => {
    return {
        type: 'CHANGE_REGISTER_ADDRESS',
        payload: { zipCode, address, number, complement, neighborhood, city, state }
    }
}


export const resetRegisterAddress = () => {
    return {
        type: 'RESET_REGISTER_ADDRESS'
    }
}


export const changeRegisterServices = values => {
    return {
        type: 'CHANGE_REGISTER_SERVICES',
        payload: values
    }
}


export const resetRegisterServices = () => {
    return {
        type: 'RESET_REGISTER_SERVICES'
    }
}


export const changeRegisterVehicle = (
  carNumber,
  carModel,
  carBrand,
  carColor,
  carManufaturingYear,
  carModelYear) => {
  return {
    type: 'CHANGE_REGISTER_VEHICLE',
    payload: {
      carNumber,
      carModel,
      carBrand,
      carColor,
      carManufaturingYear,
      carModelYear
    }
  }
}


export const resetRegisterVehicle = () => {
    return {
        type: 'RESET_REGISTER_VEHICLE'
    }
}


export const changeRegisterBankAccount = (accountTitular, birthday, typeTitular, document, typeAccount, bank, agency, agencyDigit, account, accountDigit) => {
    return {
        type: 'CHANGE_REGISTER_BANK_ACCOUNT',
        payload: { accountTitular, birthday, typeTitular, document, typeAccount, bank, agency, agencyDigit, account, accountDigit }
    }
}


export const resetRegisterBankAccount = () => {
    return {
        type: 'RESET_REGISTER_BANK_ACCOUNT'
    }
}


export const getDocs = values => {
    return {
      type: 'GET_DOCS',
      payload: values
    }
}


export const changeAddProviderDocs = values => {
    return {
      type: 'CHANGE_ADD_PROVIDER_DOCS',
      payload: values
    }
}


export const saveAddDocs = value => {
    return {
      type: 'SAVE_ADD_DOCS',
      payload: value
    }
}

export const aditionalInfoDocuments = value => {
  return {
    type: 'ADITIONAL_INFO_DOCS',
    payload: value
  }
}


export const resetRegister = () => {
    return {
        type: 'RESET_REGISTER'
    }
}

export const changeVisibleSecurityCode = value => {
    return {
      type: 'CHANGE_VISIBLE_SECURITY_CODE',
      payload: value
    }
}
