import { View, StyleSheet, Image } from "react-native";
import ImageButton from "../components/controls/ImageButton";
import image_button from "../styles/image_button";
import { router } from "expo-router";
import Log from "../utils/Log";
import React from "react";
import { WebView } from "react-native-webview";

const btn_back = require("../assets/button/back_button.png");

const ImagePage = ({ fileId }: { fileId: string }) => {
  const onClick_btnBack = () => {
    Log.info("Back button clicked!");
    router.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <View style={styles.viewNavigation}>
          <ImageButton
            image={btn_back}
            styles={image_button}
            onClick={onClick_btnBack}
          />
        </View>
      </View>
      <WebView
        style={styles.container}
        source={{
          uri: `https://apix.eu.amity.co/api/v3/files/${fileId}/download?size=medium`,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
  },
  viewHeader: {
    backgroundColor: "#eee",
    width: "100%",
    height: 120,
  },
  viewNavigation: {
    height: 50,
    marginTop: 50,
    flexDirection: "row",
  },
  image: {
    flex: 1,
    width: "auto",
    height: "auto",
    resizeMode: "contain",
    borderRadius: 10,
  },
});

export default ImagePage;
