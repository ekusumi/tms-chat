import AmityService from "../services/AmityService";
import { Channel, getChannel } from "../types/Chat/Channel";
import LocalStorage from "../utils/LocalStorage";
import Log from "../utils/Log";
import useScheduleLocalNotification from "./useScheduleLocalNotification";
import { Message } from "../types/Chat/Message";

type UseGetChannelsCallback = (result: Channel[]) => void;

let channelCallback: UseGetChannelsCallback;

export const useDownloadChannels = async () => {
  Log.debug("useDownloadChannels hook called");
  await AmityService.getChannels(async (amityChannels) => {
    let channels: Channel[] = Array<Channel>();
    amityChannels.map(async (amityChannel) => {
      let channel = getChannel(amityChannel);
      channels.push(channel);
    });

    saveChannels(channels);
    channelCallback(channels);
  });
};

const useGetChannels = (callback: UseGetChannelsCallback) => {
  Log.debug("useGetChannels hook called");
  channelCallback = callback;
  let channels = getChannels();
  if (channels != undefined) {
    callback(channels);
  }

  const scheduleLocalNotification = async (channel: Channel) => {
    await useScheduleLocalNotification(channel.displayName, channel.message);
  };
};

export const useGetLocalChannels = (callback: UseGetChannelsCallback) => {
  Log.debug("useGetLocalChannels hook called");
  let channels = getChannels();
  if (channels != undefined) {
    callback(channels);
  }
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

const saveChannels = (channels: Channel[]) => {
  let jsonChannels = JSON.stringify(channels);
  LocalStorage.saveData("channels", jsonChannels);
};

const getChannels = () => {
  let jsonChannels = LocalStorage.getData("channels");
  if (jsonChannels != undefined) {
    let channels = JSON.parse(jsonChannels) as Channel[];
    return channels;
  } else {
    return undefined;
  }
};

// const saveMessages = (amityMessages: Amity.Message[], channelId: string) => {
//   let jsonMessages = JSON.stringify(amityMessages);
//   LocalStorage.saveData("messages_" + channelId, jsonMessages);
// };

// const saveMessages = (messages: Message[], channelId: string) => {
//   let jsonMessages = JSON.stringify(messages);
//   LocalStorage.saveData("messages_" + channelId, jsonMessages);
// };

export default useGetChannels;
