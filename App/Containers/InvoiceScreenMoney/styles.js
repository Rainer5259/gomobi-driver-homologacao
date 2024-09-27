// Modules
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
        padding: 20
    },
    image: {
        height: '45%',
        width: '90%',
        resizeMode: 'stretch',
        marginVertical: 20,
    },
    info: {
        backgroundColor: '#FFF',
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
        width: '100%',
        borderRadius: 5,
    },
    name: {
        fontSize: 18
    },
    valueRice: {
        marginTop: 10,
        fontSize: 23,
        fontWeight: 'bold'
    },
    what: {
        fontWeight: '500',
        marginTop: 15,
        textAlign: 'center'
    },
    footer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonRecib: {
        height: 50,
        width: '35%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
    },
    valueRecib: {
      textAlign: 'center',
      color: '#000',
      fontWeight: '200',
    },
    buttonOutro: {
      height: 50,
      width: '55%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      borderRadius: 5,
    },
    valueOutro: {
      textAlign: 'center',
      color: '#FFF',
      fontWeight: '200',
    }
});
