import { StyleSheet, View, Text, FlatList } from "react-native";
import { router } from "expo-router";

import ImageButton from "../components/controls/ImageButton";
import AssetBlock from "../components/views/AssetBlock";
import RouteManifestListItemView, {
  RouteManifestListItem,
} from "../components/views/RouteManifestListItemView";
import { useEffect, useState } from "react";
import useGetSdrReportForDeliveryId from "../hooks/useGetSdrReportForDeliveryId";
import SdrReport from "../types/Pimm/SdrReport";

const btn_back = require("../assets/button/back_button.png");

const RouteManifestPage = ({ deliveryId }: { deliveryId: string }) => {
  const [sdrReport, setSdrReport] = useState<SdrReport>();
  const [stops, setStops] = useState<RouteManifestListItem[]>();

  const onClick_btnBack = () => {
    console.log("Back button clicked!");
    router.navigate("../");
  };

  useEffect(() => {
    const getSdrReportForDeliveryId = async () => {
      let sdrReport = await useGetSdrReportForDeliveryId(deliveryId);
      setSdrReport(sdrReport);

      let stops: RouteManifestListItem[] = Array<RouteManifestListItem>();
      sdrReport.Hierarchy.GIS.Stops.map((sdrStop) => {
        let stop: RouteManifestListItem = {
          index: sdrStop.DeliveryOrder,
          storeName: sdrStop.SiteName,
          storeAddress: sdrStop.Address,
          planArrival: sdrStop.ExpectedArrivalTime,
          siteId: sdrStop.SiteId,
        };
        stops.push(stop);
      });
      setStops(stops);
    };

    getSdrReportForDeliveryId();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <View style={styles.viewNavigation}>
          <ImageButton
            image={btn_back}
            styles={imageButtonStyles}
            onClick={onClick_btnBack}
          />
          <Text style={styles.txtName}>Route Manifest</Text>
        </View>
        <View style={styles.viewRouteDetails}>
          <AssetBlock
            label="TRAILER"
            text={sdrReport?.Hierarchy.TrailerName!}
          />
          <AssetBlock label="TRACTOR" text={sdrReport?.Hierarchy.Tractor!} />
          <AssetBlock label="ROUTE" text={sdrReport?.Hierarchy.RouteName!} />
          <AssetBlock
            label="DRIVER"
            text={sdrReport?.Hierarchy.Driver.FullName!}
          />
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.header_text}>Stop</Text>
        <Text style={styles.header_text_store}>Store</Text>
        <Text style={styles.header_text_po}>PO</Text>
        <Text style={styles.header_text}>Plan Arrival</Text>
      </View>
      <View style={styles.list}>
        <FlatList
          data={stops}
          renderItem={({ item }) => <RouteManifestListItemView item={item} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewHeader: {
    backgroundColor: "#eee",
    width: "100%",
    height: 160,
  },
  viewNavigation: {
    height: 50,
    marginTop: 50,
    flexDirection: "row",
  },
  txtName: {
    height: "100%",
    width: 300,
    fontSize: 22,
    marginLeft: 20,
    marginTop: 20,
    color: "#555",
    textAlign: "center",
  },
  viewRouteDetails: {
    flexDirection: "row-reverse",
    alignSelf: "center",
  },
  viewMessage: {
    flex: 1,
  },
  viewFooter: {
    height: 100,
    backgroundColor: "#eee",
    flexDirection: "row",
  },
  scrollMessage: {
    flex: 1,
  },
  textInput: {
    margin: 15,
    height: 50,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "baseline",
  },
  header_text: {
    fontSize: 15,
    marginLeft: 10,
    width: 50,
  },
  header_text_store: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 5,
    width: 150,
  },
  header_text_po: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 5,
    width: 30,
  },
  list: {
    flex: 1,
  },
});

const imageButtonStyles = StyleSheet.create({
  background: {
    width: 25,
    height: 40,
  },
  button: {
    width: 25,
    height: 50,
  },
  image: {
    width: 20,
    height: 30,
    margin: 5,
    marginLeft: 10,
    marginTop: 20,
    resizeMode: "contain",
  },
});

export default RouteManifestPage;
