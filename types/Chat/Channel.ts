import LocalStorage from "../../utils/LocalStorage";
import { getRouteName } from "../Pimm/ActiveRouteShipment";
import { getUser, getInitials, getFullName } from "../Pimm/User";

export type Channel = {
  channelId: string;
  userId: string;
  displayName: string;
  initials: string;
  message: string;
  timestamp: string;
  unreadCount: number;
  route?: string;
  lastActivity: string;
};

export const getUserId = (loginId: string | null, channel: any) => {
  let metadata = channel.metadata;
  let data = metadata!["data"];
  if (data != null) {
    metadata = data;
  }

  let userIds = metadata!["userIds"];
  if (userIds != null) {
    let split = userIds.toString().split(",");
    let userId = split[0];
    if (userId == loginId) {
      return split[1];
    } else {
      return userId;
    }
  } else {
    return null;
  }
};

export const getSiteId = (channel: any) => {
  let metadata = channel.metadata;
  let data = metadata!["data"];
  if (data != null) {
    metadata = data;
  }

  let siteId = metadata!["siteId"];
  return siteId;
};

export const saveChannel = (channelId: string, userId: string) => {
  LocalStorage.saveData(channelId, userId);
};

export const getUserIdForChannel = (channelId: string) => {
  try {
    let userId = LocalStorage.getData(channelId);
    if (userId != null) {
      return userId;
    } else {
      return "";
    }
  } catch (e: unknown) {
    return "";
  }
};

export const getChannel = (amityChannel: Amity.Channel) => {
  let loginId = LocalStorage.getData("loginId");
  let userId = getUserId(loginId!, amityChannel);
  LocalStorage.saveData(amityChannel.channelId, userId);

  let user = getUser(userId);
  let initials = getInitials(user!);
  let displayName = getFullName(user!);

  let message = "";

  if (amityChannel.messagePreview) {
    if (amityChannel.messagePreview.dataType == "text") {
      message = amityChannel.messagePreview.data.text;
    } else {
      message = `[${amityChannel.messagePreview.dataType}]`;
    }
  }

  let timestamp = new Date(amityChannel.lastActivity);
  let routeName = getRouteName(userId);

  let channel: Channel = {
    channelId: amityChannel.channelId,
    userId: userId,
    displayName: displayName,
    initials: initials,
    message: message,
    timestamp: timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    unreadCount: amityChannel.subChannelsUnreadCount,
    route: routeName,
    lastActivity: amityChannel.lastActivity,
  };

  return channel;
};

export const getFilterChannel = (amityMessage: Amity.Message) => {
  let userId = getUserIdForChannel(amityMessage.channelId);
  let user = getUser(userId);
  let initials = getInitials(user!);
  let displayName = getFullName(user!);

  let message = amityMessage.data?.text;

  let timestamp = new Date(amityMessage.createdAt);
  let routeName = "";

  let channel: Channel = {
    channelId: amityMessage.channelId,
    userId: userId,
    displayName: displayName,
    initials: initials,
    message: message,
    timestamp: timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    unreadCount: 0,
    route: routeName,
    lastActivity: amityMessage.createdAt,
  };

  return channel;
};
