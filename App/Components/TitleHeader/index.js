// Modules
import React from 'react';
import { View, Text } from 'react-native';

// Styles
import {styles} from './styles'

export default function TitleHeader({ text, align }) {
    return (
        <View style={[styles.principal, { alignItems: align }]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

