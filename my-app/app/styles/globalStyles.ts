import { StyleSheet, Dimensions } from "react-native";
import colors from "./colors";

const { width, height } = Dimensions.get("window");

export const globalStyles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: width * 0.04,
  },

  container: {
    flex: 1,
    padding: width * 0.05,
    // backgroundColor: colors.background,
  },


  snackbarSuccess: {
    backgroundColor: colors.snackbarSuccess,
    color: colors.black,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "center",
    width: "90%",
  },
  snackbarError: {
    backgroundColor: colors.snackbarError,
    paddingVertical: height * 0.015,
    borderRadius: 8,
    alignSelf: "center",
    width: "90%",
  },


  card: {
    width: "100%",
   padding: width * 0.04,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: "center",
    marginTop:20,
  },

  boardCard: {
    width: "95%",
    maxWidth: width * 0.95,
    alignSelf: "center",
    padding: width * 0.04,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexShrink: 1,
    marginBottom: 10,
  },

  buttonReverse: {
    padding: 12,
    backgroundColor: colors.white,
    color: colors.black,
    borderRadius: 10,
    borderColor: colors.button,
    borderWidth: 2,
  },
  labelButtonReverse: {
    fontSize: width * 0.05,
    backgroundColor: colors.white,
    color: colors.button,
    borderRadius: 10,
  },

  button: {
    padding: 12,
    backgroundColor: colors.button,
    color: colors.white,
    borderRadius: 10,
  },
  labelButton: {
    fontSize: width * 0.05,
    backgroundColor: colors.button,
    color: colors.white,
    borderRadius: 10,
  },

  buttonModify: {
    backgroundColor: colors.buttonModify,
    color: colors.white,
    borderRadius: 10,
  },
  labelModify: {
    backgroundColor: colors.buttonModify,
    color: colors.white,
    borderRadius: 10,
  },

  buttonDelete: {
    padding: 12,
    backgroundColor: colors.buttonDelete,
    color: colors.black,
    borderRadius: 10,
  },
  labelDelete: {
    fontSize: width * 0.05,
    backgroundColor: colors.buttonDelete,
    color: colors.white,
    borderRadius: 10,
  },

  buttonDetails: {
    backgroundColor: colors.button,
    color: colors.white,
    borderRadius: 10,
  },
  buttonText: {
    color: "black",
  },

  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    fontFamily: 'Poppins_700Bold',
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    color: colors.black,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
    fontFamily: "Helvetica",
    marginBottom: 10,
  },


  input: {
    marginBottom: height * 0.02,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: height * 0.015,
    color: colors.darkGray,

  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: width * 0.05,
    marginHorizontal: width * 0.1,
    borderRadius: 12,
  },
  fab: {
    position: "absolute",
    right: width * 0.04,
    bottom: height * 0.04,
    backgroundColor: colors.white,
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    justifyContent: "center",
    alignItems: "center",
  },
  fabIcon: {
    color: colors.white,
    fontSize: width * 0.06,
  },
  navbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: width * 0.04,
    backgroundColor: colors.navbarBackground,
    marginBottom: 10,
    borderRadius: 10,
    paddingTop: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    marginRight: width * 0.03,
  },
  userName: {
    color: colors.white,
    fontSize: width * 0.055,
    fontWeight: "bold",
  },
  userEmail: {
    color: colors.userEmail,
    fontSize: width * 0.034,
  },
  menuIcon: {
    marginLeft: width * 0.02,
  },



  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },

  logoSubtitle: {
    fontSize: width * 0.05,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Helvetica Neue',
  },


  profileSection: {
    marginBottom: 15,
    width: '100%',
  },

  textBold: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#3E4A59',
  },

  textNormal: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 5,
  },
  cardActions: {
    flexDirection: 'row',

    width: '100%',
    marginTop: 20,
  },

  iconButtonStyle: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: 'transparent', 
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 10, 
  },

});

export default {
  globalStyles,
};
