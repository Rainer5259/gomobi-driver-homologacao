// Modules
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    parentContainer: {
        flex: 1,
        backgroundColor: "#FBFBFB",
        padding: 0,
    },
    planDetails: {
        fontSize: 16,
        marginBottom: 5
    },
    containerDetails: {
        flex: 1,
        backgroundColor: "#FBFBFB",
        padding: 0,
        paddingHorizontal: 25,
        justifyContent: 'space-between'
    },
    statusOpen: {
        backgroundColor: '#ff4040',
        width: 70,
        textAlign: 'center',
        padding: 5,
        borderRadius: 5,
        color: '#fff',
        fontWeight: 'bold'
    },
    statusPaid: {
        backgroundColor: 'green',
        width: 70,
        textAlign: 'center',
        padding: 5,
        borderRadius: 5,
        color: '#fff',
        fontWeight: 'bold'
    },
    fontBold: {
        fontWeight: 'bold'
    },
    detailsBox: {
        backgroundColor: '#FFF',
        padding: 25,
        borderRadius: 5
    },
    textDetailsBox: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingVertical: 10
    },
    billetView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10
    },
    optionsView: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-around'
    },
    noSubscription: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
