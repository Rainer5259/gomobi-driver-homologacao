// Modules
import React from 'react';

// Styles
import { Badge, Text } from './styles';

function Badger({ position, contador }) {
    if (contador > 0) {
        return (
            <Badge style={[styles.badge, position, { backgroundColor: '#e73536' }]}>
                <Text style={styles.text}>{contador}</Text>
            </Badge>
        )
    }
    return null
}

export default Badger;
