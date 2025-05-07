import { View, Text, StyleSheet, Image } from "react-native";
import ImageButton from "../controls/ImageButton";
import { router } from "expo-router";

const stop_icon = require("../../assets/icon/stop_icon.png");
const po_data = require("../../assets/icon/po_data.png");
const no_po_data = require("../../assets/icon/no_po_data.png");
const quick_send_button = require("../../assets/button/quick_send_button.png");

export interface RouteManifestListItem {
  index: number;
  storeName: string;
  storeAddress: string;
  planArrival: string;
  siteId: string;
}

const RouteManifestListItemView = ({
  item,
}: {
  item: RouteManifestListItem;
}) => {
  let odd = item.index % 2;

  const onClick_btnStop = () => {
    router.push(`/store-profile/${item.siteId}`);
  };

  const onClick_btnQuickSend = () => {
    router.push("/channel/Franks Sales");
  };

  const onClick_btnPO = () => {
    router.push("/po-data/[id]");
  };

  return (
    <View style={odd ? styles.container_highlighted : styles.container}>
      <Text style={styles.number}>{item.index}</Text>
      <ImageButton
        styles={stop_icon_styles}
        image={stop_icon}
        onClick={onClick_btnStop}
      />
      <View style={styles.store}>
        <Text style={styles.store_name}>{item.storeName}</Text>
        <Text style={styles.store_address}>{item.storeAddress}</Text>
      </View>
      <ImageButton
        styles={po_data_button_styles}
        image={po_data}
        onClick={onClick_btnPO}
      />
      <View style={styles.highlight}>
        <Text style={styles.plan_arrival}>{item.planArrival}</Text>
      </View>
      <View style={quick_send_button_styles.container}>
        <ImageButton
          styles={quick_send_button_styles}
          image={quick_send_button}
          onClick={onClick_btnQuickSend}
        />
      </View>
    </View>
  );
};

export default RouteManifestListItemView;

const styles = StyleSheet.create({
  container: {
    height: 60,
    margin: 5,
    paddingTop: 5,
    flexDirection: "row",
  },
  container_highlighted: {
    height: 60,
    margin: 5,
    paddingTop: 5,
    flexDirection: "row",
    backgroundColor: "rgba(225, 225, 225, 0.5)",
  },
  number: {
    height: 16,
    width: 16,
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    backgroundColor: "#555",
    overflow: "hidden",
    borderRadius: 8,
    padding: 1,
  },
  store: {
    marginLeft: 10,
    width: 170,
  },
  store_name: {
    fontWeight: "bold",
  },
  store_address: {
    fontSize: 12,
    flexWrap: "wrap",
  },
  po: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    margin: 5,
    marginTop: 10,
  },
  highlight: {
    backgroundColor: "rgba(225, 225, 225, 0.5)",
    height: 70,
    marginLeft: 10,
  },
  plan_arrival: {
    width: 60,
    marginLeft: 15,
    marginTop: 10,
  },
});

const stop_icon_styles = StyleSheet.create({
  image: {
    height: 35,
    width: 35,
    padding: 5,
  },
});

const quick_send_button_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 25,
    width: 25,
  },
});

const po_data_button_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 30,
    width: 30,
  },
});
