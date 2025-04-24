import AmityService from "../services/AmityService";
import { getMessage, Message } from "../types/Chat/Message";
import Log from "../utils/Log";
import useDownloadFile from "./useDownloadFile";

export type UseGetMessagesCallback = (result: Message[]) => void;

const useGetMessages = async (
  channelId: string,
  callback: UseGetMessagesCallback
) => {
  Log.debug("useGetMessages hook called");
  await AmityService.getMessages(channelId, (amityMessages) => {
    let messages: Message[] = Array<Message>();
    amityMessages.map((amityMessage) => {
      let message = getMessage(amityMessage);
      messages.push(message);

      if (message.fileId) {
        useDownloadFile(message.fileId);
      }
    });

    callback(messages);
  });
};

export default useGetMessages;
