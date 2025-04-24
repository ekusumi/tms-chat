import { StyleSheet, View, Pressable, Text } from "react-native";

const AssetBlock = ({ label, text }: { label: string; text: string }) => {
  return (
    <View>
      <Text style={styles.txtLabel}>{label}</Text>
      <View style={styles.viewText}>
        <Text style={styles.txtText}>{text}</Text>
      </View>
    </View>
  );
};

export default AssetBlock;

const styles = StyleSheet.create({
  txtLabel: {
    height: 15,
    fontSize: 12,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    textAlign: "center",
  },
  viewText: {
    width: 80,
    height: 25,
    marginLeft: 5,
    marginBottom: 5,
    borderRadius: 5,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "#ed8735",
    justifyContent: "center",
  },
  txtText: {
    color: "white",
    textAlign: "center",
    fontSize: 9,
    height: 25,
    paddingTop: 7,
  },
});
