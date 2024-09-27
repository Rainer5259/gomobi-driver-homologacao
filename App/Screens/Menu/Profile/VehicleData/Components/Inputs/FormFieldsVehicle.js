// Themes
import { Component } from 'react';

import { formStructConfig } from '../../../../../../Themes/WhiteLabelTheme/WhiteLabel';
import { strings } from '../../../../../../Locales/i18n';
import formStructConfigSelected from '../../../../../../Themes/Global/Global';

let t = require('tcomb-form-native-codificar');

export const Form = t.form.Form;

const stylesheet = formStructConfig(t.form.Form.stylesheet);
const stylesheetSelected = formStructConfigSelected(t.form.Form.stylesheet);

export default class FormFieldsVehicle extends Component {

  constructor(props) {
    super(props)
    this.state = {
      options: {},
      value: {
        carNumber: '',
        carModel: '',
        carBrand: '',
        carColor: '',
        carManufaturingYear: '',
        carModelYear: '',
      },
      errorCarNumber: null,
      isLoading: false,
      isFocusedCarNumber: false,
    }
  }

  getOptionsInput() {

    return {
      fields: {
        carNumber: {
          stylesheet: this.state.isFocusedCarNumber ? stylesheetSelected : stylesheet,
          required: true,
          mask: 'AAA-9*99',
          autoCapitalize: 'words',
          hasError: this.state.errorCarNumber,
          error: strings('register_vehicle_step.empty_car_number'),
          label: strings('register_vehicle_step.car_number'),
          returnKeyType: 'done',
          onFocus: () => this.focusField(),
          onBlur: () => this.checkValueField()
        },
        carBrand: {
          stylesheet,
          required: true,
          editable: false,
          minLength: 0,
          maxLength: 50,
          label: strings('register_vehicle_step.car_brand'),
        },
        carModel: {
          stylesheet,
          required: true,
          editable: false,
          minLength: 0,
          maxLength: 50,
          label: strings('register_vehicle_step.car_model'),
        },
        carColor: {
          stylesheet,
          required: true,
          editable: false,
          minLength: 0,
          maxLength: 20,
          label: strings('register_vehicle_step.color'),
        },
        carManufaturingYear: {
          stylesheet,
          required: true,
          editable: false,
          minLength: 4,
          maxLength: 4,
          mask: '9999',
          label: strings('register_vehicle_step.manufaturingYear'),
        },
        carModelYear: {
          stylesheet,
          required: true,
          editable: false,
          minLength: 4,
          maxLength: 4,
          mask: '9999',
          label: strings('register_vehicle_step.modelYear'),
        },
      }
    };
  }

  onChange(value) {
    if (value.carNumber?.length == 8) {
      this.vehicleApi.searhNumberVehicle(value.carNumber.replace('-', '')).then(vehicleData => {
        this.setState({
          value: {
            ...value,
            carModel: vehicleData.modelo,
            carBrand: vehicleData.marca,
            carColor: vehicleData.color,
            carManufaturingYear: vehicleData.yearManufacture,
            carModelYear: vehicleData.yearModel,
          }
        });
      });
    }
  }

  checkValueField() {
    this.setState({ isFocusedCarNumber: false });

    const error = !this.state.value.carNumber.length == 8;
    this.setState({ errorCarNumber: error });

    return error;
  }

  focusField() {
    this.setState({ errorCarNumber: false, isFocusedCarNumber: true })
  }

  getForm() {
    return t.struct({
      carNumber: t.String,
      carBrand: t.String,
      carModel: t.String,
      carColor: t.String,
      carManufaturingYear: t.String,
      carModelYear: t.String,
    });
  }

}
