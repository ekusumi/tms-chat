import { channel } from "diagnostics_channel";
import AmityService from "../services/AmityService";
import { Channel, getChannel } from "../types/Chat/Channel";
import LocalStorage from "../utils/LocalStorage";
import Log from "../utils/Log";
import useScheduleLocalNotification from "./useScheduleLocalNotification";

type UseGetChannelsCallback = (result: Channel[]) => void;

const useGetChannels = async (callback: UseGetChannelsCallback) => {
  Log.debug("useGetChannels hook called");
  await AmityService.getChannels(async (amityChannels) => {
    let channels: Channel[] = Array<Channel>();
    amityChannels.map((amityChannel) => {
      let channel = getChannel(amityChannel);
      channels.push(channel);
    });

    let jsonChannels = JSON.stringify(channels);
    LocalStorage.saveData("channels", jsonChannels);

    callback(channels);

    let channel = channels[0];
    if (channel.unreadCount > 0) {
      Log.info(
        `New Message Received for Channel: ${channel.channelId}. Will schedule local notification`
      );
      // await scheduleLocalNotification(channel);
    }
  });

  const scheduleLocalNotification = async (channel: Channel) => {
    await useScheduleLocalNotification(channel.displayName, channel.message);
  };
};

export const sortChannelsByRecent = (channels: Channel[]) => {
  channels.sort((channel1, channel2) => {
    if (channel1.lastActivity > channel2.lastActivity) {
      return -1;
    }
    if (channel1.lastActivity < channel2.lastActivity) {
      return 1;
    }
    return 0;
  });
  return channels;
};

export const sortChannelsByContact = (channels: Channel[]) => {
  var newChannels: Channel[] = new Array();
  channels.map((channel) => {
    if (channel.route != undefined) {
      newChannels.push(channel);
    }
  });

  newChannels.sort((channel1, channel2) => {
    if (channel1.displayName < channel2.displayName) {
      return -1;
    }
    if (channel1.displayName > channel2.displayName) {
      return 1;
    }
    return 0;
  });
  return newChannels;
};

export const getChannelForUserId = (userId: string) => {
  let jsonChannels = LocalStorage.getData("channels");
  let channelId = `NEW_${userId}`;
  if (jsonChannels) {
    let channels = JSON.parse(jsonChannels!) as Channel[];
    channels.map((channel) => {
      if (channel.userId == userId) {
        channelId = channel.channelId;
      }
    });
  }

  return channelId;
};

export default useGetChannels;
