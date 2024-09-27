// Modules
import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import Toast from "react-native-root-toast";
import MultiSelect from 'react-native-multiple-select';
import {Picker} from '@react-native-picker/picker';
import { connect } from "react-redux";
import { Icon } from "react-native-elements";

//Components
import ImageUpload from "../../Components/Modal/ImageUpload";

// Services
import ProviderApiFormData from "../../Services/Api/ProviderApiFormData";

// Locales
import { strings } from "../../Locales/i18n";

// Store
import { getDocs, saveAddDocs, aditionalInfoDocuments } from "../../Store/actions/actionRegister";
import { providerAction } from "../../Store/actions/providerProfile";

// Themes
import { projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";


// Utils
import * as parse from "../../Util/Parse";

// Styles
import styles, { formStructConfigSelected } from "./styles"

var options = {
  title: strings("profileProvider.selectPhoto"),
  takePhotoButtonTitle: strings("profileProvider.takePhoto"),
  chooseFromLibraryButtonTitle: strings("profileProvider.fromGallery"),
  cancelButtonTitle: strings("general.cancel"),
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
  maxWidth: 1800,
  maxHeight: 1200,
  quality: 1,
  currentItem: "",
};

let t = require("tcomb-form-native-codificar");
let Form = t.form.Form;


const stylesheet = formStructConfigSelected(t.form.Form.stylesheet);

class ListAditionalInfoDocuments extends Component {
  constructor(props) {
    super(props);

    this._imageUpload = React.createRef();

    let dateInitialEver = null;

    this.state = {
      isLoading: false,
      picture: "",
      validate: this.props.date_validity ? this.props.date_validity : "",
      uploaded: this.props.uploaded ? this.props.uploaded : false,
      arrayAuxDocs: this.props.docs,
      minInitial: dateInitialEver,
      modalVisible: false,
    },
      (this.api = new ProviderApiFormData());
  }

  registerDocProvider(docId, has_validity) {
    this.setState({ isLoading: false });
    let validity = new Date();
    let formmatedValidity;
    if (this.state.validate) {
      formmatedValidity = this.state.validate;
    } else {
      formmatedValidity = moment(validity).format("DD/MM/YYYY");
    }
    let arrayAux = this.props.docs;
    if (has_validity === 1 || (has_validity === 0 && this.state.validate)) {
      this.setState({ isLoading: true });
      this.api
        .RegisterDocsProvider(
          this.props.addProviderId,
          docId,
          this.state.picture,
          formmatedValidity
        )
        .then((response) => {
          let responseJson = response.data;

          this.props.onProviderAction({
            _id: responseJson.provider.id,
            _token: responseJson.provider.token,
          });
          this.setState({ isLoading: false });
          if (responseJson.success) {
            parse.showToast(
              strings("register.sucessRegisterDocument"),
              Toast.durations.SHORT
            );
            for (let i = 0; i < arrayAux.length; i++) {
              if (arrayAux[i].id == docId) {
                arrayAux[i].uploaded = true;
              }
            }
            this.props.getDocs(arrayAux);
            this.setState({ uploaded: true });
            this.checkAllDocSave();
          } else {
            parse.showToast(
              responseJson.error_messages[0],
              Toast.durations.LONG
            );
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          parse.showToast(strings("error.try_again"), Toast.durations.LONG);
          console.error("Erro ao tentar cadastrar o documento: ", error);
        });
    } else {
      this.setState({ uploaded: true });
    }
  }

  /**
   * Check if all docs are uploaded for exibe Next button
   */
  checkAllDocSave() {
    let arrayDocs = this.props.docs;
    let allUploaded = true;
    for (let i = 0; i < arrayDocs.length; i++) {
      if (arrayDocs[i].uploaded === false && arrayDocs[i].required == 1) {
        allUploaded = false;
        break;
      }
    }

    if (allUploaded) {
      this.props.saveAddDocs(true);
    } else {
      this.props.saveAddDocs(false);
    }
  }

  /**
   * Validate open mode according of settings user_picture
   */
  changePhoto() {
    if (this.props.settings.provider_picture == 'camera') {
      this._imageUpload.current.launchCamera()
    } else if (this.props.settings.provider_picture == 'gallery') {
      this._imageUpload.current.launchImageLibrary()
    } else {
        this.photoBothEnable(true);
    }
  }

  setImageState(image) {
    this.setState({
      picture: image.picture,
      modalVisible: false,
    });

    this.registerDocProvider(undefined, true);

    this.props.form.certificate = image.picture;
    this.props.form.providerId = this.props.addProviderId;
  }

  photoBothEnable(visible) {
    this.setState({ modalVisible: visible });
  }

  /**
   * Focus to next input on press next button at keyboard
   * @param {String} input
   * @param {Boolean} hasMask
   */
   focusToNext(input, hasMask = false) {
    if (hasMask)
      this._formRef.getComponent(input).refs.input._inputElement.focus();
    else this._formRef.getComponent(input).refs.input.focus();
  }

  onChange(value) {
    this.setState({value})
    Object.entries(value).forEach(entry => {
      const [key, value] = entry;
      this.props.form[key] = value;
    });
  }

  getOptionsInput() {
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    let optionsInput = {
      fields: {
        renavam: {
		  stylesheet:stylesheet,
          minLength: 3,
          maxLength: 13,
          required: true,
          mask: "9999.999999-9",
          hasError: this.state.renavamMsgError,
          error: strings("AditionalDocumentosInfos.renavam"),
          label: strings("AditionalDocumentosInfos.renavam"),
          onSubmitEditing: () => this.focusToNext("cityPlate"),
          returnKeyType: "next",
        },
        cityPlate: {
		  stylesheet:stylesheet,
          minLength: 3,
          maxLength: 50,
          required: true,
          autoCapitalize: 'words',
          hasError: this.state.cityPlateMsgError,
          error: strings("AditionalDocumentosInfos.cityPlate"),
          label: strings("AditionalDocumentosInfos.cityPlate"),
          returnKeyType: "next",
          onSubmitEditing: () => this.focusToNext('statePlate', true),

        },
        statePlate: {
		  stylesheet:stylesheet,
          required: true,
          minLength: 2,
          autoCapitalize: 'words',
          error: strings("AditionalDocumentosInfos.statePlate"),
          hasError: this.state.errorStatePlate,
          label: strings("AditionalDocumentosInfos.statePlate"),
          mask: "AA",
          returnKeyType: "next",
          onSubmitEditing: () => this.focusToNext('manufaturingYear', true),

        },
        manufaturingYear: {
	      stylesheet:stylesheet,
          required: true,
          minLength: 4,
          maxLength: 4,
          mask: "9999",
          hasError: this.state.ManufaturingYearMsgError,
          error: strings("AditionalDocumentosInfos.manufaturingYear"),
          label: strings("AditionalDocumentosInfos.manufaturingYear"),
          returnKeyType: "next",
          onSubmitEditing: () => this.focusToNext('modelYear', true),

        },
        modelYear: {
	      stylesheet:stylesheet,
          required: true,
          minLength: 4,
          maxLength: 4,
          mask: "9999",
          hasError: this.state.modelYearMsgError,
          error: strings("AditionalDocumentosInfos.modelYear"),
          label: strings("AditionalDocumentosInfos.modelYear"),
          returnKeyType: "next",
          onSubmitEditing: () => this.focusToNext('chassi', true),

        },
        chassi: {
		  stylesheet: stylesheet,
          required: true,
          minLength: 3,
          maxLength: 20,
          mask: "9AA AAA999 AA 999999",
          keyboardType: 'default',
          autoCapitalize: 'words',
          hasError: this.state.chassiMsgError,
          error: strings("AditionalDocumentosInfos.chassi"),
          label: strings("AditionalDocumentosInfos.chassi"),
          returnKeyType: "next",

        },
      },
    };
    return optionsInput;
  }

  onChangeInput(value, index){
    var actualForm = this.props.form;
    actualForm[index] = value;
    this.setState(form => ({form: {...form,index: actualForm[index]}}))
  }

  getForm() {
    return t.struct({
      renavam: t.Number,
      cityPlate: t.String,
      statePlate: t.String,
      manufaturingYear: t.Number,
      modelYear: t.Number,
      chassi: t.String,
    });
  }

  onSelectedItemsChange = (categorySelected) => {
    this.setState({categorySelected});
    this.props.form.categorySelected = categorySelected
  };

  render() {
    const { categorySelected } = this.state;
    let textColor = this.state.uploaded
      ? projectColors.green
      : projectColors.gray;
    let textWeight = this.state.uploaded ? "bold" : "normal";
    let borderColor = this.state.uploaded
      ? projectColors.green
      : projectColors.gray;
    let backgroundColorIcon = this.state.uploaded
      ? projectColors.green
      : projectColors.white;
    let uploadIcon = this.state.uploaded ? "check" : "add";
    let iconColor = this.state.uploaded
      ? projectColors.white
      : projectColors.gray;

    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.uploadText,
            { color: 'black', fontWeight: textWeight },
          ]}
        >
          {strings("AditionalDocumentosInfos.title")}{"\n"}
        </Text>

        <Text style={styles.txtValidate}>
          {strings("AditionalDocumentosInfos.ear")}
        </Text>

        <Picker
			selectedValue={this.props.form.ear}
			mode='dropdown'
			onValueChange={(itemValue, itemIndex) =>
				{
					this.onChangeInput(itemValue, 'ear')
				}
			}>
				<Picker.Item label="Sim" value="1" />
				<Picker.Item label="Não" value="0" />
		</Picker>

        <MultiSelect
          items={this.props.form.category}
          uniqueKey="id"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={categorySelected}
          selectText="Categoria da Habilitação*"
          searchInputPlaceholderText="Buscar..."
          hideDropdown
          showDropDowns={true}
          readOnlyHeadings={true}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Selecionar"
        />
        <Form
          ref={(ref) => (this._formRef = ref)}
          type={this.getForm()}
          options={this.getOptionsInput()}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
        />
        <Text style={styles.txtValidate}>
          {strings("AditionalDocumentosInfos.ownVehicle")}
        </Text>

		<Picker
			selectedValue={this.props.form.ownVehicle}
			mode='dropdown'
			onValueChange={(itemValue, itemIndex) =>
				this.onChangeInput(itemValue, 'ownVehicle')
			}>
				<Picker.Item label="Sim" value="1" />
				<Picker.Item label="Não" value="0" />
		</Picker>

        <Text style={styles.txtValidate}>
          {strings("AditionalDocumentosInfos.conduapp")}
        </Text>

		<Picker
			selectedValue={this.props.form.conduapp}
			mode='dropdown'
			onValueChange={(itemValue, itemIndex) =>
				this.onChangeInput(itemValue, 'conduapp')
			}>
				<Picker.Item label="Não" value="0" />
				<Picker.Item label="Sim" value="1" />
		</Picker>

        {this.props.form.conduapp == 1 ? (
          <TouchableOpacity
            style={[styles.uploadButton, { borderColor: borderColor }]}
            onPress={() => this.changePhoto()}
          >
            <Text
              style={[
                styles.uploadText,
                { color: textColor, fontWeight: textWeight },
              ]}
            >
              {strings("AditionalDocumentosInfos.certificateConduapp")}
            </Text>
            <View
              style={[
                styles.containerIconUpload,
                { backgroundColor: backgroundColorIcon },
              ]}
            >
              {this.state.isLoading ? (
                <ActivityIndicator color={projectColors.green} size="small" />
              ) : (
                <Icon name={uploadIcon} color={iconColor} size={27} />
              )}
            </View>
          </TouchableOpacity>
        ) : null}

        <ImageUpload
          ref={this._imageUpload}
          showModal={this.state.modalVisible}
          setShowModal={(value) => this.photoBothEnable(value)}
          getImage={(value) => this.setImageState(value)}
          title={strings('register_step5.choose_document_photo_upload_option')}
        ></ImageUpload>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  uploadDocuments: state.registerReducer.uploadDocuments,
  addProviderId: state.registerReducer.addProviderId,
  docs: state.registerReducer.docs,
  settings: state.settingsReducer.settings,
  form: state.registerReducer.form
});

const mapDispatchToProps = (dispatch) => ({
  getDocs: (values) => dispatch(getDocs(values)),
  saveAddDocs: (value) => dispatch(saveAddDocs(value)),
  onProviderAction: (provider) => dispatch(providerAction(provider)),
  onAditionalDocs: (value) => dispatch(aditionalInfoDocuments(value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListAditionalInfoDocuments);
