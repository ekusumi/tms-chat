import { Image, ImageBackground, StyleSheet, View, Text } from "react-native";
import LoginForm from "../components/forms/LoginForm";
import useRegisterNotifications from "../hooks/useRegisterNotifications";

const login_background = require("../assets/background/login_background.png");
const ipimm_icon = require("../assets/icon/ipimm_icon.png");
const tms_icon = require("../assets/icon/tms_icon.png");

const LoginPage = () => {
  useRegisterNotifications();
  return (
    <View style={styles.container}>
      <ImageBackground
        source={login_background}
        resizeMode="cover"
        style={styles.login_background}
      >
        <Image source={ipimm_icon} style={styles.ipimm_icon} />
        <Image source={tms_icon} style={styles.tms_icon} />
        <Text style={styles.text}>TMS CHAT</Text>
        <View style={styles.login_view_container}>
          <LoginForm />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  login_background: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  ipimm_icon: {
    width: 140,
    height: 24,
    margin: 10,
  },
  tms_icon: {
    width: 100,
    height: 100,
    margin: 10,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "light",
  },
  login_view_container: {
    marginTop: 20,
    marginBottom: 200,
  },
  activityIndicator: {
    marginTop: 100,
    marginBottom: 350,
  },
});

export default LoginPage;
