import { View, StyleSheet, Image, Text, Pressable } from "react-native";

const stop_icon = require("../../assets/icon/stop_icon.png");

const TagListItem = ({
  stopNo,
  stopName,
  onClick,
}: {
  stopNo: string;
  stopName: string;
  onClick: (stopName: string) => void;
}) => {
  return (
    <View style={styles.background}>
      <Pressable onPress={() => onClick(stopName)}>
        <View style={styles.row}>
          <Image style={styles.stopIcon} source={stop_icon}></Image>
          <View style={styles.column}>
            <Text style={styles.stopNo}>{stopNo}</Text>
            <Text style={styles.stopName}>{stopName}</Text>
          </View>
        </View>
      </Pressable>
      <View style={styles.separator}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    width: 200,
    height: 70,
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
  },
  stopIcon: {
    width: 40,
    height: 40,
    margin: 5,
    marginTop: 10,
    resizeMode: "contain",
  },
  column: {
    flexDirection: "column",
  },
  stopNo: {
    marginTop: 10,
    marginLeft: 10,
    fontWeight: "bold",
  },
  stopName: {
    marginTop: 5,
    marginLeft: 10,
  },
  separator: {
    height: 1,
    width: 250,
    backgroundColor: "#ccc",
    marginTop: 5,
  },
});

export default TagListItem;
