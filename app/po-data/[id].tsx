import { View, Text, StyleSheet, Image, Modal, Alert } from "react-native";
import ImageButton from "../../components/controls/ImageButton";
import { router } from "expo-router";

const back_button = require("../../assets/button/back_button.png");
const quick_send_button = require("../../assets/button/quick_send_button.png");

const store_icon = require("../../assets/icon/store_icon.png");
const sales_representative_icon = require("../../assets/icon/sales_representative_icon.png");
const delivery_instructions_icon = require("../../assets/icon/delivery_instructions_icon.png");
const special_instructions_icon = require("../../assets/icon/special_instructions_icon.png");

const stop_icon = require("../../assets/icon/stop_icon.png");
const key_stop_icon = require("../../assets/icon/key_stop_icon.png");
const sensitive_icon = require("../../assets/icon/sensitive_icon.png");

const onClick_btnBack = () => {
  router.navigate("../");
};

const PoDataPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ImageButton
          image={back_button}
          styles={btn_back_styles}
          onClick={onClick_btnBack}
        />
        <Text style={styles.number}>1</Text>
        <Text style={styles.store_name}>HB 30007 JC VONS</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  modal: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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

export default PoDataPage;
