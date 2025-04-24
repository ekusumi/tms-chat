import { View, Text, StyleSheet, Image, Modal } from "react-native";
import ImageButton from "../components/controls/ImageButton";
import { router } from "expo-router";
import { SdrStop } from "../types/Pimm/SdrReport";
import { useEffect, useState } from "react";
import LocalStorage from "../utils/LocalStorage";

const back_button = require("../assets/button/back_button.png");
const quick_send_button = require("../assets/button/quick_send_button.png");

const store_icon = require("../assets/icon/store_icon.png");
const sales_representative_icon = require("../assets/icon/sales_representative_icon.png");
const delivery_instructions_icon = require("../assets/icon/delivery_instructions_icon.png");
const special_instructions_icon = require("../assets/icon/special_instructions_icon.png");

const stop_icon = require("../assets/icon/stop_icon.png");
const key_stop_icon = require("../assets/icon/key_stop_icon.png");
const sensitive_icon = require("../assets/icon/sensitive_icon.png");

const StoreProfilePage = ({ siteId }: { siteId: string }) => {
  const [sdrStop, setSdrStop] = useState<SdrStop>();

  useEffect(() => {
    const getStopData = () => {
      let json = LocalStorage.getData(siteId);
      let sdrStop = JSON.parse(json!) as SdrStop;
      setSdrStop(sdrStop);
    };

    getStopData();
  }, []);

  const onClick_btnBack = () => {
    console.log("Back button clicked!");
    router.navigate("../");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ImageButton
          image={back_button}
          styles={btn_back_styles}
          onClick={onClick_btnBack}
        />
        <Text style={styles.store_name}>{sdrStop?.SiteName}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.section_header}>
          <Image style={styles.section_icon} source={store_icon} />
          <Text style={styles.section_title}>Store Info</Text>
        </View>
        <Image style={styles.section_overlay} source={stop_icon} />
        <View style={styles.section_details}>
          <View style={styles.section_detail_line}>
            <Text style={styles.section_detail_line_label}>Address</Text>
            <Text style={styles.section_detail_line_info}>
              {sdrStop?.Address}
            </Text>
          </View>
          <View style={styles.section_detail_line}>
            <Text style={styles.section_detail_line_label}>
              Manager/Contact
            </Text>
            <Text style={styles.section_detail_line_info}>
              {sdrStop?.Contact.Name}
            </Text>
          </View>
          <View style={styles.section_detail_line}>
            <Text style={styles.section_detail_line_label}>Phone</Text>
            <Text style={styles.section_detail_line_info}>
              {sdrStop?.Contact.PhoneNumber}
            </Text>
          </View>
          <View style={styles.section_detail_line}>
            <Text style={styles.section_detail_line_label}>Email</Text>
            <Text style={styles.section_detail_line_info}>
              {sdrStop?.Contact.Email}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.section_header}>
          <Image
            style={styles.section_icon}
            source={sales_representative_icon}
          />
          <Text style={styles.section_title}>Sales Representative</Text>
        </View>
        <Image style={styles.section_overlay} source={quick_send_button} />
        <View style={styles.section_details}>
          <View style={styles.section_detail_line}>
            <Text style={styles.section_detail_line_label}>Name</Text>
            <Text style={styles.section_detail_line_info}>
              {sdrStop?.SalesRepName}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.section_header}>
          <Image
            style={styles.section_icon}
            source={delivery_instructions_icon}
          />
          <Text style={styles.section_title}>Delivery Instructions</Text>
        </View>
        <Image style={styles.section_overlay} source={key_stop_icon} />
        <View style={styles.section_details}>
          <View style={styles.section_detail_list}>
            <Text>{sdrStop?.DeliveryInstructions}</Text>
          </View>
          <Text style={styles.section_detail_subheader}>Key Drop Info</Text>
          <View style={styles.section_detail_line}>
            <Text style={styles.section_detail_line_label}>Key Number</Text>
            <Text style={styles.section_detail_line_info}>
              {sdrStop?.KeyNumber}
            </Text>
          </View>
          <View style={styles.section_detail_line}>
            <Text style={styles.section_detail_line_label}>
              Alarm Code (Arm)
            </Text>
            <Text style={styles.section_detail_line_info}>
              {sdrStop?.ArmCode}
            </Text>
          </View>
          <View style={styles.section_detail_line}>
            <Text style={styles.section_detail_line_label}>
              Alarm Code (Disarm)
            </Text>
            <Text style={styles.section_detail_line_info}>
              {sdrStop?.DisarmCode}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.section_header}>
          <Image
            style={styles.section_icon}
            source={special_instructions_icon}
          />
          <Text style={styles.section_title}>Special Instructions</Text>
        </View>
        <Image style={styles.section_overlay} source={sensitive_icon} />
        <View style={styles.section_details}>
          <View style={styles.section_detail_list}>
            <Text>{sdrStop?.SpecialInstructions}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
  },
  number: {
    height: 20,
    width: 20,
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    backgroundColor: "#555",
    overflow: "hidden",
    borderRadius: 10,
    margin: 5,
  },
  store_name: {
    fontSize: 22,
    marginTop: 2,
  },
  section: {
    margin: 10,
  },
  section_header: {
    flexDirection: "row",
  },
  section_icon: {
    height: 25,
    width: 25,
    margin: 5,
    resizeMode: "contain",
  },
  section_overlay: {
    height: 35,
    width: 35,
    marginTop: 15,
    resizeMode: "contain",
    position: "absolute",
    alignSelf: "flex-end",
    zIndex: 999,
  },
  section_title: {
    width: "80%",
    fontSize: 18,
    color: "#f15b27",
    margin: 5,
  },
  section_details: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#555",
    borderWidth: 1,
    paddingTop: 10,
  },
  section_detail_list: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 25,
  },
  section_detail_subheader: {
    width: "80%",
    color: "#f15b27",
    margin: 5,
    fontSize: 16,
  },
  section_detail_line: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  section_detail_line_label: {
    width: "45%",
    fontWeight: "bold",
  },
  section_detail_line_info: {
    width: "55%",
    textAlign: "right",
  },
});

const btn_back_styles = StyleSheet.create({
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
    resizeMode: "contain",
  },
});

export default StoreProfilePage;
