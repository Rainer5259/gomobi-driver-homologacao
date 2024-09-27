
// Modules
import React from 'react';
import { View, Modal, Text, ActivityIndicator } from 'react-native';

// Util
import * as constants from '../../Util/Constants';

//Styles
import {styles} from './styles';

const Loader = props => {
    const {
        loading,
        message
    } = props;

    return (
        <Modal transparent={true} animationType={'none'} visible={loading} onRequestClose={() => {}}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <Text style={styles.titleText}></Text>
                        <ActivityIndicator animating={loading} color={constants.LOADING_COLOR} size='large' />
                    <Text style={styles.titleText}> {message} </Text>
                </View>
            </View>
        </Modal>
    )
}

export default Loader;
