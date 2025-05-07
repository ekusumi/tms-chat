import { channel } from "diagnostics_channel";
import AmityService from "../services/AmityService";
import { getMessage, Message } from "../types/Chat/Message";
import LocalStorage from "../utils/LocalStorage";
import Log from "../utils/Log";
import useDownloadFile from "./useDownloadFile";

export type UseGetMessagesCallback = (result: Message[]) => void;

let messageCallback: UseGetMessagesCallback;

export const useDownloadMessages = async (channelId: string) => {
  Log.debug("useDownloadMessages hook called");
  await AmityService.getMessages(channelId, (amityMessages) => {
    let messages: Message[] = Array<Message>();
    amityMessages.map((amityMessage) => {
      let message = getMessage(amityMessage);
      messages.push(message);

      if (message.fileId) {
        useDownloadFile(message.fileId);
      }
    });

    saveMessages(messages, channelId);
    messageCallback(messages);
  });
};

const useGetMessages = async (
  channelId: string,
  callback: UseGetMessagesCallback
) => {
  Log.debug("useGetMessages hook called");
  messageCallback = callback;
  let messages = getMessages(channelId);
  if (messages != undefined) {
    callback(messages);
  } else {
    useDownloadMessages(channelId);
  }
};

const saveMessages = (messages: Message[], channelId: string) => {
  let jsonMessages = JSON.stringify(messages);
  LocalStorage.saveData("messages_" + channelId, jsonMessages);
};

const getMessages = (channelId: string) => {
  let jsonMessages = LocalStorage.getData("messages_" + channelId);
  if (jsonMessages != undefined) {
    let messages = JSON.parse(jsonMessages) as Message[];
    return messages;
  } else {
    return undefined;
  }
};

export default useGetMessages;
