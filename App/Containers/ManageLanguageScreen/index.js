// Modules
import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';

// Components
import DefaultHeader from '../../Components/DefaultHeader';

// Locales
import { strings } from "../../Locales/i18n";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";

// Themes
import {
    projectColors,
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Util
import * as constants from '../../Util/Constants';

// Styles
import styles from './styles';

class ManageLanguageScreen extends Component {
    constructor(props) {
        super(props)
        this.api = new ProviderApi();
        this.state = {
            mud: null,
            isLoading: true,
            language: [],
            language_select: [],
        }
    }

    componentDidMount() {
        this.api.enabledLanguages(
            this.props.providerProfile._id,
            this.props.providerProfile._token
        ).then(result => {
            this.setState({
                language: result.data.languages
            })
        })

        this.api.providerLanguagens(
            this.props.providerProfile._id,
            this.props.providerProfile._token
        ).then(result => {
            var provider_languages = result.data.provider_languages.map(item => { return item.language_id })

            this.setState({
                language_select: provider_languages,
                isLoading: false
            })
        })
            .catch(erro => {
                this.setState({
                    isLoading: false
                })
            })

    }

    /**
     *
     * @param {Number} id
     */
    handleSelect(id) {
        this.setState({
            isLoading: true
        })
        const alreadySelected = this.state.language_select.findIndex(item => item === id);


        if (this.state.mud == id) {
            this.setState({
                mud: null,

            })

        } else {
            this.setState({
                mud: id
            })
        }

        if (alreadySelected >= 0) {
            const filteredItems = this.state.language_select.filter(item => item !== id);
            this.setState({
                language_select: filteredItems,
                isLoading: false
            })

        } else {
            this.setState({
                language_select: [...this.state.language_select, id],
                isLoading: false
            })

        }

    }

    goBack() {
        this.setState({
            isLoading: true
        })
        if (this.state.mud != null) {
            this.api.setproviderLanguagens(
                this.props.providerProfile._id,
                this.props.providerProfile._token,
                this.state.language_select
            ).then(result => {
                this.setState({
                    isLoading: false
                })
                this.props.navigation.goBack()
            })
        } else {
            this.setState({
                isLoading: false
            })
            this.props.navigation.goBack()
        }
    }

    render() {
        return (
            <>
                <DefaultHeader
                  loading={this.state.isLoading}
                  loadingMsg={strings("load.Loading")}
                  btnBackListener={() => this.goBack()}
                  title={strings('ManageLanguageScreen.title')}
                />
                <View style={styles.parentContainer}>

                    <FlatList
                        data={this.state.language}
                        extraData={this.state.language}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.card}
                                activeOpacity={0.6}
                                onPress={() => this.handleSelect(item.id)}
                            >
                                <Image style={styles.flag} source={{ uri: constants.BASE_URL + item.flag }} />
                                <Text style={[styles.textMessage, { color: "#222" }]}>{item.name}</Text>
                                {this.state.language_select.includes(item.id) && (
                                    <View style={styles.iconCheck}>
                                        <Feather name="check" size={18} color={projectColors.primaryGreen} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}

                    />

                </View>
            </>
        );
    }
}

const mapStateToProps = state => {
    const { settings } = state.settingsReducer
    const { providerProfile } = state.providerProfile;

    return { settings, providerProfile };
};


const mapDispatchToProps = dispatch => {
    return {

    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManageLanguageScreen);
