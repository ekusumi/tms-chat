import { Channel } from "../types/Chat/Channel";
import AmityService from "../services/AmityService";
import User, { getFullName, getInitials, getUser } from "../types/Pimm/User";
import { Search } from "../types/Chat/Search";
import LocalStorage from "../utils/LocalStorage";

export type UseSearchMessageCallback = (result: Search[]) => void;

const useSearchMessage = async (
  channels: Channel[],
  search: string,
  callback: UseSearchMessageCallback
) => {
  var messages = Array();
  channels.map(async (channel) => {
    await AmityService.searchMessages(
      channel.channelId,
      search,
      (searchMessages, searchTags, searchSenders) => {
        searchMessages.map((searchMessage) => {
          let search: Search = {
            type: "Message",
            channelId: searchMessage.channelId,
            messageId: searchMessage.messageId,
            message: searchMessage.data!.text,
          };

          if (checkDuplicate(messages, search.message) == false) {
            messages.push(search);
          }
        });

        searchTags.map((searchMessage) => {
          let search: Search = {
            type: "Tag",
            channelId: searchMessage.channelId,
            messageId: searchMessage.messageId,
            message: searchMessage.tags![0],
          };

          if (checkDuplicate(messages, search.message) == false) {
            messages.push(search);
          }
        });

        searchSenders.map((searchSender) => {
          let object = LocalStorage.getData(searchSender.creatorId);
          let user = JSON.parse(object!) as User;
          let search: Search = {
            type: "Sender",
            channelId: searchSender.channelId,
            messageId: searchSender.messageId,
            message: getFullName(user),
          };

          if (checkDuplicate(messages, search.message) == false) {
            messages.push(search);
          }
        });
      }
    );
  });
  callback(messages);
};

const checkDuplicate = (messages: Search[], searchMessage: string) => {
  let duplicate = false;
  messages.map((message) => {
    if (message.message.toLowerCase() == searchMessage.toLocaleLowerCase()) {
      duplicate = true;
    }
  });
  return duplicate;
};

export default useSearchMessage;
