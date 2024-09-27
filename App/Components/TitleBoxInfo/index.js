import React from 'react';
import { StyleSheet, Text } from 'react-native';


export default function TitleBoxInfo({ text }) {
    return (
        <>
            <Text style={[styles.boxInfo]}>{text}</Text>
        </>
    );
}

const styles = StyleSheet.create({
    boxInfo: {
        fontSize: 17,
        color: "#627084",
        fontWeight: "normal",
        //textAlign: "justify",
        paddingHorizontal: 30
    },
})

