import { StyleSheet, View, Pressable, Text } from "react-native";

const TextButton = ({ text, onClick }: { text: string; onClick: any }) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.background} onPress={onClick}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </View>
  );
};

export default TextButton;

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 50,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#f15b27",
    marginTop: 20,
  },
  background: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
});
