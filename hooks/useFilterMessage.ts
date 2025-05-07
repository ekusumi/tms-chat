import AmityService from "../services/AmityService";
import {
  Channel,
  getFilterChannel,
  getFilterChannelFromMessage,
} from "../types/Chat/Channel";
import { getMessage, Message } from "../types/Chat/Message";
import LocalStorage from "../utils/LocalStorage";

export type UseFilterMessagesCallback = (result: Channel[]) => void;

const useFilterMessage = (
  channels: Channel[],
  tag: string,
  callback: UseFilterMessagesCallback
) => {
  var filterChannels = Array();
  channels.map((channel) => {
    let messages = getMessages(channel.channelId);
    console.log("MESSAGES: " + messages?.length);
    if (messages != undefined) {
      messages.map((message) => {
        if (message.tag!.length > 0) {
          if (
            message.tag!.toLocaleLowerCase().indexOf(tag.toLocaleLowerCase()) >=
            0
          ) {
            let filterChannel = getFilterChannelFromMessage(
              message,
              channel.channelId
            );
            filterChannels.push(filterChannel);
          }
        }
      });
    } else {
      // await AmityService.filterMessages(
      //   channel.channelId,
      //   tag,
      //   (amityMessages) => {
      //     saveFilterMessages(channel.channelId, amityMessages);
      //     amityMessages.map((amityMessage) => {
      // if (amityMessage.tags!.length > 0) {
      //   if (
      //     amityMessage
      //       .tags![0].toLocaleLowerCase()
      //       .indexOf(tag.toLocaleLowerCase()) >= 0
      //   ) {
      //     let channel = getFilterChannel(amityMessage);
      //     filterChannels.push(channel);
      //   }
      // }
      //     });
      //   }
      // );
    }

    callback(filterChannels);
  });
};

const saveFilterMessages = (channelId: string, messages: Amity.Message[]) => {
  let jsonMessages = JSON.stringify(messages);
  LocalStorage.saveData("messages_" + channelId, jsonMessages);
};

// const getFilterMessages = (channelId: string) => {
//   let jsonMessages = LocalStorage.getData("messages_" + channelId);
//   if (jsonMessages != undefined) {
//     let messages = JSON.parse(jsonMessages) as Amity.Message[];
//     return messages;
//   } else {
//     return undefined;
//   }
// };

const getMessages = (channelId: string) => {
  let jsonMessages = LocalStorage.getData("messages_" + channelId);
  if (jsonMessages != undefined) {
    let messages = JSON.parse(jsonMessages) as Message[];
    return messages;
  } else {
    return undefined;
  }
};

export default useFilterMessage;
