import { StyleSheet, View, Pressable, Text } from "react-native";

const MessageSeparator = ({ text }: { text: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default MessageSeparator;

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    height: 15,
    width: 100,
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#bbb",
    borderRadius: 5,
    overflow: "hidden",
    textAlign: "center",
    padding: 1,
  },
});
