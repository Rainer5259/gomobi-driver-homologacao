// Modules
import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';
import axios from 'axios';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ModalSelector from 'react-native-modal-selector';

// Assets
import Images from '../../Assets/Images/EmergencyContacts';

// Locales
import { strings } from '../../Locales/i18n';

// validPhoneNumber
import { validatePhoneNumber } from './validPhoneNumber';

// Styles
import styles from './styles';

import * as parse from '../../Util/Parse';

const EmergencyContacts = ({
  primaryColor = 'green',
  language = 'en',
  route,
  params,
  getOptionsToShareRequest,
  value = undefined
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [emergency_contacts, setEmergencyContacts] = useState([]);
  const [notifyText, setNotifyText] = useState(value);

  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const schema = Yup.object().shape({
    email: Yup.string()
      .email(strings('EmergencyContacts.email_error'))
      .required(strings('EmergencyContacts.required')),
    cellphone: Yup.string().min(15, strings('EmergencyContacts.phone_error')),
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  /**
   * api/v3/ledger/4/contacts
   */
  useEffect(() => {

    axios
      .get(`${route}/ledger/${params.ledger_id}/contacts/`, {
        params,
      })
      .then(response => {
        const result = response.data;
        if (result.success) {
          const contacts = result.data.map(contact => {
            const contactFormatted = {
              ...contact,
              is_accepted: contact.status !== 'invited' ? true : false,
            };
            delete contactFormatted.status;

            return contactFormatted;
          });
          setEmergencyContacts(contacts);
        }
      })
      .catch(error => {});
  }, [route, params]);

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      if (errors.email) {
        setEmailError(errors.email.message);
      } else {
        setEmailError('');
      }

      if (errors.cellphone) {
        setPhoneError(errors.cellphone.message);
      } else {
        setPhoneError('');
      }

      return;
    }
    setEmailError('');
  }, [errors]);

  const changeOptionsToShareRequest = useCallback(
    option => {

      if(getOptionsToShareRequest) getOptionsToShareRequest(option);

      setNotifyText(option.label);
    },
    [getOptionsToShareRequest],
  );

  /**
   * @description resend Email to Emergency Contact
   * @param {number} ledger_contact_id
   */
  const reSendLedgerContactEmail = useCallback(
    async ledger_contact_id => {
      try {
        const response = await axios.post(
          `${route}/ledger_contact/resend_email`,
          {
            ...params,
            ledger_contact_id,
          },
        );
        if (response.data.success == true) {
          Alert.alert('Email', strings('EmergencyContacts.resent_email'));
        }
      } catch (error) {
        Alert.alert(strings('EmergencyContacts.resent_email_error'));
      }
    },
    [params, route],
  );

  /**
   *
   * @description delete Emergency Contact
   * @param {number} ledger_contact_id
   */
  const deleteEmergencyContact = useCallback(
    async ledger_contact_id => {
      try {
        const response = await axios.delete(
          `${route}/ledger_contact/${ledger_contact_id}`,
          {
            params,
          },
        );

        const result = response.data;

        if (result.success) {
          setEmergencyContacts(state =>
            state.filter(contact => contact.id !== ledger_contact_id),
          );
        }
      } catch (error) {
        Alert.alert(strings('EmergencyContacts.resent_email_error'));
      }
    },
    [emergency_contacts, params, route],
  );

  /**
   * @description Ask to delete before do this.
   */
  const showAlertBeforeDelete = useCallback(
    ledger_contact_id => {
      Alert.alert(
        strings('EmergencyContacts.delete_popup_title'),
        strings('EmergencyContacts.delete_popup_msg'),
        [
          {
            text: strings('EmergencyContacts.delete_popup_cancel'),
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: strings('EmergencyContacts.delete_popup_ok'),
            onPress: () => deleteEmergencyContact(ledger_contact_id),
          },
        ],
        { cancelable: false },
      );
    },
    [deleteEmergencyContact],
  );

  /**
   * @description get form data
   * @typedef {Object} FormData
   * @property {string} email
   * @property {string} cellphone
   * @param {FormData} data
   */
  const onSubmit = data => {
    const isNumbervalid = language !== 'ao' ? validatePhoneNumber(data.cellphone) : true;

    if (isNumbervalid) {
      addEmergencyContact(data);
    }

    parse.showToast(strings('EmergencyContacts.phone_error'));
  };

  const addEmergencyContact = useCallback(
    async ({ email, cellphone: phone }) => {
      try {
        const response = await axios.post(`${route}/ledger_contact`, {
          ...params,
          email,
          phone,
        });
        const result = response.data;

        if (!result?.success) {
          if (result.errors) {
            parse.showToast(result.errors[0])
          }
        }

        if (result.success) {

          const contactFormatted = {
            ...result,
            is_accepted: result.status !== 'invited' ? true : false,
          }

          delete result.success;
          setEmergencyContacts(state => [...state, contactFormatted]);
        }
        setIsModalVisible(false);

      } catch (error) {
        setIsModalVisible(false);
      }
    },
    [params, route],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setEmailError('');
    setPhoneError('');
  }, []);

  return (
    <>
      <FlatList
        data={emergency_contacts}
        keyExtractor={(x, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.cardContact}>
            <View
              style={[styles.circleIndex, { backgroundColor: primaryColor }]}
            >
              <Text style={styles.txtIndex}>{item.email.substring(0, 2)}</Text>
            </View>
            <View style={{ width: 150 }}>
              <Text
                style={{ fontWeight: '700', fontSize: 15, flexWrap: 'wrap' }}
              >
                {item.email}
              </Text>
              <Text>{item.phone}</Text>
            </View>
            <View>
              {item.is_accepted ? (
                <Text style={{ color: 'green' }}>
                  {strings('EmergencyContacts.accepted')}
                </Text>
              ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'blue', fontSize: 12 }}>
                      {strings('EmergencyContacts.invited')}
                    </Text>
                  </View>
                )}

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 8,
                  alignItems: 'center',
                }}
              >
                {!item.is_accepted && (
                  <View style={{ marginRight: 15 }}>
                    <TouchableOpacity
                      onPress={() => {
                        reSendLedgerContactEmail(item.id);
                      }}
                    >
                      <Image
                        resizeMode="contain"
                        source={Images.icon_refresh}
                        style={{ height: 22, width: 22 }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      showAlertBeforeDelete(item.id);
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={Images.icon_remove}
                      style={{ height: 15, width: 15 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addCard}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.plusBtn}>
          <FontAwesome5 name="plus" size={21} color="#c5cccc" />
        </View>
        <View style={styles.viewAddContact}>
          <Text style={[styles.txtAddContact, { color: primaryColor }]}>
            {strings('EmergencyContacts.contact_add')}
          </Text>
        </View>
      </TouchableOpacity>

      {/* <Text>Gerencie seus Contatos de Emergência</Text> */}
      <Text style={styles.titleContact}>
        {`${strings('EmergencyContacts.when_notify_your_contacts')}?`}
      </Text>

      <View style={styles.viewModal}>
        <ModalSelector
          data={[
            {
              key: 0,
              section: true,
              label: `${strings('EmergencyContacts.when_notify_your_contacts')}?`,
            },
            { key: 1, label: strings('EmergencyContacts.always') },
            { key: 2, label: strings('EmergencyContacts.ask_before_sending') },
            { key: 3, label: strings('EmergencyContacts.never') },
          ]}
          initValue={strings('EmergencyContacts.always')}
          accessible
          scrollViewAccessibilityLabel="Scrollable options"
          cancelButtonAccessibilityLabel="Cancel Button"
          style={{ opacity: 1 }}
          animationType="fade"
          backdropPressToClose
          onChange={option => changeOptionsToShareRequest(option)}
        >
          <View style={styles.inputModal}>
            <Text style={styles.textInputStyle}>{notifyText}</Text>

            <FontAwesome5 name="caret-down" size={25} color="#c5cccc" />
          </View>
        </ModalSelector>
      </View>

      <Modal isVisible={isModalVisible} useNativeDriver>
        <View style={styles.modalContainer}>
          <View style={styles.cardModal}>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                render={({field:{ onChange, onBlur, value }}) => (
                  <TextInput
                    placeholder="E-mail"
                    placeholderTextColor="#2b2b2b"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={value => onChange(value)}
                    onBlur={onBlur}
                    style={[
                      styles.inputHook,
                      { borderColor: emailError ? '#c53030' : '#bbb' },
                    ]}
                  />
                )}
                name="email"
                rules={{ required: true }}
                defaultValue=""
              />
              {!!emailError && (
                <Text style={styles.textError}>{emailError}</Text>
              )}
            </View>
			{
				language !== 'ao' ?
					<View style={styles.inputContainer}>
						<Controller
							control={control}
							render={({field:{ onChange, onBlur, value }}) => (
							<TextInputMask
								placeholder="Telefone"
								placeholderTextColor="#2b2b2b"
								type="cel-phone"
								options={{
								maskType: 'BRL',
								withDDD: true,
								dddMask: '(99) ',
								}}
								value={value}
								onChangeText={value => onChange(value)}
								onBlur={onBlur}
								style={[
								styles.inputHook,
								{ borderColor: phoneError ? '#c53030' : '#bbb' },
								]}
							/>
							)}
							name="cellphone"
							rules={{ required: true }}
							defaultValue=""
						/>

						{!!phoneError && (
							<Text style={styles.textError}>{phoneError}</Text>
						)}
					</View>
				:
					<View style={styles.inputContainer}>
						<Controller
							control={control}
							render={({field:{ onChange, onBlur, value }}) => (
							<TextInputMask
								placeholder="Telefone"
								placeholderTextColor="#2b2b2b"
								type="cel-phone"
								options={{
								maskType: 'INTERNATIONAL',
								}}
								value={value}
								onChangeText={value => onChange(value)}
								onBlur={onBlur}
								style={[
								styles.inputHook,
								{ borderColor: phoneError ? '#c53030' : '#bbb' },
								]}
							/>
							)}
							name="cellphone"
							rules={{ required: true }}
							defaultValue=""
						/>

						{!!phoneError && (
							<Text style={styles.textError}>{phoneError}</Text>
						)}
					</View>
			}
            <TouchableOpacity
              style={[
                styles.addContactButton,
                { backgroundColor: primaryColor },
              ]}
              onPress={()=> handleSubmit(data => onSubmit(data))()}
            >
              <Text style={styles.textButtonAdd}>Adicionar Contato</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.text}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EmergencyContacts;
