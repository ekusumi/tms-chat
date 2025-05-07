import { router } from "expo-router";
import React from "react";
import { View, StyleSheet, Pressable, Text, Image } from "react-native";
import useCreateChannel from "../../hooks/useCreateChannel";
import { saveChannel } from "../../types/Chat/Channel";
import LocalStorage from "../../utils/LocalStorage";
import { getChannelForUserId } from "../../hooks/useGetChannels";

const img_dispatcher = require("../../assets/icon/dispatcher_icon.png");
const img_salesrep = require("../../assets/icon/salesRep_icon.png");
const img_driver = require("../../assets/icon/driver_icon.png");

const ContactListItem = ({
  userId,
  initial,
  displayName,
  role,
}: {
  userId: string;
  initial: string;
  displayName: string;
  role: string;
}) => {
  const onClick_contactListItem = async (userId: string) => {
    let channelId = getChannelForUserId(userId);
    router.dismiss();
    router.push(`/channel/${channelId}`);
  };

  return (
    <View style={listStyles.viewBackground}>
      <Pressable onPress={() => onClick_contactListItem(userId)}>
        <View style={listStyles.viewContent}>
          <Text style={listStyles.txtUser}>{initial}</Text>
          <Image source={getRoleIcon(role)} style={listStyles.roleIcon}></Image>
          <View style={listStyles.viewDetails}>
            <Text style={listStyles.txtName}>{displayName}</Text>
            <Text style={listStyles.txtRole}>{role}</Text>
          </View>
        </View>
        <View style={listStyles.viewSeparator} />
      </Pressable>
    </View>
  );
};

const getRoleIcon = (role: string) => {
  if (role == "Sales Representative") {
    return img_salesrep;
  } else if (role == "Dispatcher") {
    return img_dispatcher;
  } else {
    return img_driver;
  }
};

export default ContactListItem;

const listStyles = StyleSheet.create({
  viewBackground: {
    height: 80,
    width: "100%",
  },
  viewContent: {
    flexDirection: "row",
    padding: 10,
  },
  txtUser: {
    height: 60,
    width: 60,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#555",
    textAlign: "center",
    padding: 5,
    paddingTop: 15,
    borderColor: "#555",
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewDetails: {
    flexDirection: "column",
    marginLeft: 20,
    width: "80%",
    marginTop: 10,
  },
  txtName: {
    width: "80%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  txtRole: {
    width: "80%",
    fontSize: 14,
    fontWeight: "light",
    color: "#555",
    alignItems: "center",
  },
  viewSeparator: {
    height: 1,
    backgroundColor: "#ccc",
    marginLeft: 20,
  },
  roleIcon: {
    width: "35%",
    height: 30,
    paddingBottom: 5,
    resizeMode: "contain",
    position: "absolute",
    alignSelf: "flex-end",
    zIndex: 999,
  },
});
