// Modules
import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

// Styles
import {styles} from './styles'

const propTypes = {
  amount: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
};

const defaultProps = {
  fontSize: 13,
};

class SurgeMarker extends React.Component {
  render() {
    const { fontSize, amount } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Text style={[styles.amount, { fontSize }]}>{amount}x</Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  }
}

SurgeMarker.propTypes = propTypes;
SurgeMarker.defaultProps = defaultProps;

export default SurgeMarker;
