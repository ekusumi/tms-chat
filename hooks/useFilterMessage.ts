import { channel } from "diagnostics_channel";
import AmityService from "../services/AmityService";
import { Channel, getFilterChannel } from "../types/Chat/Channel";
import { getMessage, Message } from "../types/Chat/Message";
import LocalStorage from "../utils/LocalStorage";

export type UseFilterMessagesCallback = (result: Channel[]) => void;

const useFilterMessage = async (
  channels: Channel[],
  tag: string,
  callback: UseFilterMessagesCallback
) => {
  var filterChannels = Array();
  channels.map(async (channel) => {
    let filterMessages = getFilterMessages(channel.channelId);
    if (filterMessages != undefined) {
      let channel = getFilterChannel(filterMessages);
      filterChannels.push(channel);
    } else {
      await AmityService.filterMessages(
        channel.channelId,
        tag,
        (amityMessages) => {
          saveFilterMessages(channel.channelId, amityMessages);

          amityMessages.map((amityMessage) => {
            if (amityMessage.tags!.length > 0) {
              if (
                amityMessage
                  .tags![0].toLocaleLowerCase()
                  .indexOf(tag.toLocaleLowerCase()) >= 0
              ) {
                let channel = getFilterChannel(amityMessage);
                filterChannels.push(channel);
              }
            }
          });
        }
      );
    }

    callback(filterChannels);
  });
};

const saveFilterMessages = (channelId: string, messages: Amity.Message[]) => {
  let jsonMessages = JSON.stringify(messages);
  LocalStorage.saveData(`MESSAGES_${channelId}`, jsonMessages);
};

const getFilterMessages = (channelId: string) => {
  let jsonMessages = LocalStorage.getData(`MESSAGES_${channelId}`);
  if (jsonMessages != undefined) {
    let messages = JSON.parse(jsonMessages);
  } else {
    return undefined;
  }
};

export default useFilterMessage;
