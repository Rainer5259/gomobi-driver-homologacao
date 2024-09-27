// Modules
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  textInputStyle: {
    color: '#000',
    fontSize: 16,
  },

  viewModal: {
    marginBottom: 30,
    marginTop: 15,
  },

  titleContact: {
    fontSize: 14,
    marginTop: 45,
    alignSelf: 'flex-start',
  },

  addCard: {
    marginTop: 25,
    height: 75,
    width: '100%',
    elevation: 3,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },

  plusBtn: {
    width: 43,
    height: 43,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    marginRight: 16,
  },

  viewAddContact: {
    alignItems: 'stretch',
    flex: 1,
  },
  txtAddContact: {
    fontWeight: 'bold',
  },

  cardContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 4,
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 15,
    margin: 2,
    height: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  circleIndex: {
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 16,
  },

  txtIndex: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 20,
  },

  inputModal: {
    height: 50,
    backgroundColor: '#fff',
    margin: 2,
    borderColor: 4,
    elevation: 3,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardModal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },

  inputHook: {
    borderWidth: 1,
    borderColor: '#bbb',
    paddingLeft: 10,
    height: 40,
    borderRadius: 5,
  },

  backButton: {
    alignItems: 'center',
    padding: 5,
    marginTop: 20,
    alignSelf: 'center',
  },

  text: {
    fontSize: 16,
  },

  textButtonAdd: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },

  addContactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 5,
  },

  inputContainer: {
    marginBottom: 20,
  },

  textError: {
    color: '#c53030',
  },
});
