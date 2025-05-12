import { Channel, getFilterChannelFromMessage } from "../types/Chat/Channel";
import { Message } from "../types/Chat/Message";
import LocalStorage from "../utils/LocalStorage";
import { sortChannelsByRecent } from "./useGetChannels";
import { getMessages } from "./useGetMessages";

export type UseFilterMessagesCallback = (result: Channel[]) => void;

const useFilterMessage = (
  channels: Channel[],
  tag: string,
  callback: UseFilterMessagesCallback
) => {
  var filterChannels = Array();
  channels.map((channel) => {
    let messages = getMessages(channel.channelId);
    if (messages != undefined) {
      console.log("LOCAL FILTER MESSAGES: " + messages?.length);
      messages!.map((message) => {
        if (message.tag != undefined) {
          if (
            message.tag!.toLocaleLowerCase().indexOf(tag.toLocaleLowerCase()) >=
            0
          ) {
            let filterChannel = getFilterChannelFromMessage(
              message,
              channel.channelId
            );

            let duplicate = checkDuplicates(
              filterChannels,
              filterChannel.channelId
            );

            if (duplicate == false) {
              console.log("FILTER CHANNEL: " + JSON.stringify(message));
              filterChannels.push(filterChannel);
            }
          }
        }
      });

      let sortedChannels = sortChannelsByRecent(filterChannels);
      callback(sortedChannels);
    }
    // } else {
    //   await AmityService.getMessages(channel.channelId, (amityMessages) => {
    //     var messages = Array();
    //     amityMessages.map((amityMessage) => {
    //       let message = getMessage(amityMessage);
    //       messages.push(message);
    //       if (message.tag != undefined) {
    //         if (
    //           message
    //             .tag!.toLocaleLowerCase()
    //             .indexOf(tag.toLocaleLowerCase()) >= 0
    //         ) {
    //           let filterChannel = getFilterChannelFromMessage(
    //             message,
    //             channel.channelId
    //           );

    //           let duplicate = checkDuplicates(
    //             filterChannels,
    //             filterChannel.channelId
    //           );

    //           console.log("CHECK DUPLICATE:" + duplicate);

    //           if (duplicate == false) {
    //             filterChannels.push(filterChannel);
    //           }
    //         }
    //       }
    //     });

    //     saveMessages(channel.channelId, messages);

    //     let sortedChannels = sortChannelsByRecent(filterChannels);
    //     callback(sortedChannels);
    //   });
    // }
  });
};

// const saveFilterMessages = (channelId: string, messages: Amity.Message[]) => {
//   let jsonMessages = JSON.stringify(messages);
//   LocalStorage.saveData("messages_" + channelId, jsonMessages);
// };

// const getFilterMessages = (channelId: string) => {
//   let jsonMessages = LocalStorage.getData("messages_" + channelId);
//   if (jsonMessages != undefined) {
//     let messages = JSON.parse(jsonMessages) as Amity.Message[];
//     return messages;
//   } else {
//     return undefined;
//   }
// };

// const saveMessages = (channelId: string, messages: Message[]) => {
//   let jsonMessages = JSON.stringify(messages);
//   LocalStorage.saveData("messages_" + channelId, jsonMessages);
// };

// const getMessages = (channelId: string) => {
//   let jsonMessages = LocalStorage.getData("messages_" + channelId);
//   if (jsonMessages != undefined) {
//     let messages = JSON.parse(jsonMessages) as Message[];
//     return messages;
//   } else {
//     return undefined;
//   }
// };

const checkDuplicates = (channels: Channel[], channelId: string) => {
  channels.map((channel) => {
    if (channel.channelId == channelId) {
      return true;
    }
  });
  return false;
};

export default useFilterMessage;
