import { ActivityIndicator, StyleSheet, View, Text } from "react-native";

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" style={styles.activityIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    zIndex: 999,
    position: "absolute",
    flex: 1,
    justifyContent: "center",
  },
  activityIndicator: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  spinnerTextStyle: {
    color: "#fff",
  },
});

export default Loader;
