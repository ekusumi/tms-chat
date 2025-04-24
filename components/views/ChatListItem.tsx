import { router } from "expo-router";
import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { getRole, getUser } from "../../types/Pimm/User";

const img_dispatcher = require("../../assets/icon/dispatcher_icon.png");
const img_salesrep = require("../../assets/icon/salesRep_icon.png");
const img_driver = require("../../assets/icon/driver_icon.png");

const ChatListItem = ({
  channelId,
  userId,
  initial,
  displayName,
  routeName,
  time,
  message,
  unreadCount,
}: {
  channelId: string;
  userId: string;
  initial: string;
  displayName: string;
  routeName?: string;
  time: string;
  message?: string;
  unreadCount: number;
}) => {
  const onClick_chatListItem = (channelId: string) => {
    console.log(`List Item clicked: ${channelId}`);
    router.push(`/channel/${channelId}`);
  };

  let user = getUser(userId)!;
  let role = getRole(user);

  return (
    <View style={listStyles.viewBackground}>
      <Pressable onPress={() => onClick_chatListItem(channelId)}>
        <View style={listStyles.viewContent}>
          <Text style={listStyles.txtUser}>{initial}</Text>
          <Image source={getRoleIcon(role)} style={listStyles.roleIcon}></Image>
          <View style={listStyles.viewDetails}>
            <View style={listStyles.viewInfo}>
              <Text style={listStyles.txtName}>{displayName}</Text>

              {routeName ? (
                <View style={listStyles.viewRoute}>
                  <Text style={listStyles.txtRoute}>{routeName}</Text>
                </View>
              ) : (
                <View style={listStyles.viewNoRoute}>
                  <Text style={listStyles.txtRoute}>{""}</Text>
                </View>
              )}

              <Text style={listStyles.txtTime}>{time}</Text>
            </View>
            <View style={listStyles.viewMessage}>
              <Text style={listStyles.txtMessage}>{message}</Text>

              {unreadCount > 0 ? (
                <Text style={listStyles.txtBadge}>{unreadCount}</Text>
              ) : (
                <Text style={listStyles.txtNoBadge}></Text>
              )}
            </View>
          </View>
        </View>
        <View style={listStyles.viewSeparator} />
      </Pressable>
    </View>
  );
};

export default ChatListItem;

const getRoleIcon = (role: string) => {
  if (role == "Sales Representative") {
    return img_salesrep;
  } else if (role == "Dispatcher") {
    return img_dispatcher;
  } else {
    return img_driver;
  }
};

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
    color: "white",
    textAlign: "center",
    padding: 5,
    paddingTop: 15,
    borderColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewDetails: {
    flexDirection: "column",
    marginLeft: 10,
  },
  viewInfo: {
    flexDirection: "row",
    marginLeft: 10,
    height: 20,
  },
  txtName: {
    width: "50%",
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  viewRoute: {
    backgroundColor: "#ed8735",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    width: "18%",
    marginTop: 2,
    height: 16,
    marginRight: 5,
  },
  viewNoRoute: {
    backgroundColor: "#555",
    width: "18%",
    marginRight: 5,
  },
  txtRoute: {
    fontSize: 11,
    fontWeight: "light",
    color: "white",
    textAlign: "center",
  },
  txtTime: {
    width: "22%",
    fontSize: 16,
    fontWeight: "light",
    color: "white",
    textAlign: "right",
  },
  viewMessage: {
    marginLeft: 10,
    height: 30,
    flexDirection: "row",
  },
  txtMessage: {
    width: "80%",
    height: "100%",
    fontSize: 16,
    fontWeight: "light",
    textAlign: "left",
    paddingTop: 10,
    color: "white",
  },
  txtBadge: {
    width: "5%",
    height: "55%",
    fontSize: 12,
    fontWeight: "light",
    textAlign: "center",
    marginTop: 10,
    marginRight: 5,
    marginLeft: 10,
    color: "#555",
    backgroundColor: "white",
    borderRadius: 50,
  },
  txtNoBadge: {
    width: "5%",
    height: "60%",
    fontSize: 14,
    fontWeight: "light",
    textAlign: "left",
    marginTop: 10,
    paddingLeft: 5,
    marginRight: 5,
    color: "#555",
    backgroundColor: "#555",
    borderRadius: 50,
  },
  viewImageMessage: {
    width: "100%",
    height: "100%",
    paddingTop: 5,
  },
  viewSeparator: {
    height: 1,
    backgroundColor: "white",
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
