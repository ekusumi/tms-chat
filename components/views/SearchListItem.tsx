import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

const SearchListItem = ({
  messageCategory,
  messagePreview,
  channelId,
}: {
  messageCategory: string;
  messagePreview: string;
  channelId: string;
}) => {
  const onClick_searchListItem = (channelId: string) => {
    router.push(`/channel/${channelId}`);
  };

  return (
    <View style={listStyles.viewBackground}>
      <Pressable onPress={() => onClick_searchListItem(channelId)}>
        <View style={listStyles.viewContent}>
          {getCategoryView(messageCategory)}
          <Text style={listStyles.txtMessage}>{messagePreview}</Text>
        </View>
        <View style={listStyles.viewSeparator} />
      </Pressable>
    </View>
  );
};

const getCategoryView = (category: string) => {
  if (category == "Message") {
    return <Text style={listStyles.txtCategoryMessage}>{category}</Text>;
  } else if (category == "Tag") {
    return <Text style={listStyles.txtCategoryTag}>{category}</Text>;
  } else {
    return <Text style={listStyles.txtCategorySender}>{category}</Text>;
  }
};

export default SearchListItem;

const listStyles = StyleSheet.create({
  viewBackground: {
    height: 80,
    width: "100%",
    color: "white",
  },
  viewContent: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    color: "white",
  },
  txtCategoryMessage: {
    width: "30%",
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  txtCategoryTag: {
    width: "30%",
    fontSize: 16,
    fontWeight: "bold",
    color: "#3398D4",
  },
  txtCategorySender: {
    width: "30%",
    fontSize: 16,
    fontWeight: "bold",
    color: "#009900",
  },
  txtMessage: {
    width: "70%",
    fontSize: 16,
    fontWeight: "light",
    color: "#555",
    textAlign: "left",
  },
  viewSeparator: {
    height: 1,
    backgroundColor: "#555",
    marginLeft: 20,
  },
});
