// Modules
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import Close from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';

// HorizontalServices
import HorizontalServices from '../HorizontalServices/index';

// Locales
import { strings } from '../../Locales/i18n';

// Store
import { SET_CATEGORYID, SET_TYPEID } from '../../Store/actions/actionTypes';

// Styles
import { styles } from './styles';

function CompleteOrder({
  service,
  getClickedVehicle,
}) {

  const modalizeRef = useRef(null);
  const contentRef = useRef(null);

  const [isClicked, setCliked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [itemSelected, setItemSelected] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (service != undefined && service.length > 0 && service[0].is_clicked) {
      setItemSelected(service[0]);

      getClickedVehicle({
        index: 0,
        service_item: service[0],
        services: service,
      });
    } else {
      dispatch({
        type: SET_TYPEID,
        payload: null,
      });

      dispatch({
        type: SET_CATEGORYID,
        payload: null,
      });
    }
  }, [service]);

  /**
   *
   * @param {Number} index
   */
  const changeServicelist = useCallback(
    async index => {
      const services = service;

      for (var i = 0; i < services.length; i++) {
        if (services[i].is_clicked) {
          services[i].is_clicked = false;
          break;
        }
      }
      services[index].is_clicked = true;
      getClickedVehicle({
        index,
        service_item: services[index],
        services,
      });

      service = services;
      var oltService = service[0]
      service[0] = services[index]
      services[index] = oltService


    },
    [getClickedVehicle],
  );

  const toggleItemService = useCallback(
    (index, item) => {
      setCliked(!isClicked);
      setItemSelected(item);
      changeServicelist(index);
      modalizeRef.current?.close ('alwaysOpen');
      contentRef.current?.getScrollResponder().scrollTo({
        y:0,
        animated: true
      })
    },
    [changeServicelist, isClicked],
  );

  /**
   * change modal visibility
   */
  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {service ? (
        <>
          {
			<HorizontalServices
				services={service}
				onPressSelectService={(index, item) => toggleItemService(index, item)}
				onPressServiceDetails={(item) => toggleModal(item)}
			/>
          }
        </>
      ) : null
      }

      <Modal
        isVisible={isVisible}
        style={{ backgroundColor: '#FBFBFB' }}
        useNativeDriver
        backdropColor="#FBFBFB"
        backdropOpacity={1}
      >
        <SafeAreaView style={{ flex: 1, marginHorizontal: 25 }}>
          <Close name="close" size={25} color="#000" onPress={toggleModal} />
          <Text style={styles.titleDetails}>{strings("CompleteOrder.detaisPrice")}</Text>
          <Text style={styles.paragrafo}>
            {strings("CompleteOrder.fix")}
          </Text>
          {itemSelected && (
            <>
              <View style={styles.estimateList}>
                <Text>{strings("CompleteOrder.base")}</Text>
                <Text>{itemSelected.base_price}</Text>
              </View>
              <View style={styles.estimateList}>
                <Text>{strings("CompleteOrder.mini")}</Text>
                <Text>{itemSelected.min_price}</Text>
              </View>
              <View style={styles.estimateList}>
                <Text>{strings("CompleteOrder.timeM")}</Text>
                <Text>{itemSelected.price_per_unit_time}</Text>
              </View>
              <View style={styles.estimateList}>
                <Text>{strings("CompleteOrder.km")}</Text>
                <Text>{itemSelected.price_per_unit_distance}</Text>
              </View>
              {
                itemSelected.surge_price &&
                <View style={styles.estimateList}>
                  <Text>
                    {strings('requests.surge_price')}
                  </Text>
                  <Text>{itemSelected.surge_price}</Text>
                </View>
              }
              {
                itemSelected.toll_value &&
                <View style={styles.estimateList}>
                  <Text>
                    {strings('requests.toll_price')}
                  </Text>
                  <Text>{itemSelected.toll_value}</Text>
                </View>
              }
              {
                itemSelected.discount &&
                <View style={styles.estimateList}>
                  <Text>
                    {strings('requests.discount_price')}
                  </Text>
                  <Text>{itemSelected.discount}</Text>
                </View>
              }
            </>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );

}
export default CompleteOrder;
