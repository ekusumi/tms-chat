import { TextInput, View, StyleSheet, Text } from "react-native";

const TextField = ({
  placeholder,
  updateText,
}: {
  placeholder: string;
  updateText: any;
}) => {
  const getTextValue = (text: string) => {
    updateText(text);
  };

  const isPassword = placeholder == "Password" ? true : false;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{placeholder}</Text>
      <TextInput
        style={styles.text_input}
        secureTextEntry={isPassword}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        onChangeText={(newText) => getTextValue(newText)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: 250,
    height: 40,
    margin: 5,
    borderRadius: 10,
    flexDirection: "row",
  },
  text: {
    height: 40,
    width: 100,
    fontSize: 16,
    color: "#888",
    padding: 10,
  },
  text_input: {
    height: 40,
    width: 150,
    fontSize: 16,
    padding: 5,
  },
});

export default TextField;
