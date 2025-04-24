import AmityService from "../services/AmityService";
import { getMessage } from "../types/Chat/Message";

const useSendImageMessage = async (
  channelId: string,
  path: string,
  text?: string
) => {
  let message = await AmityService.sendImageMessage(channelId, path, text);
  return getMessage(message!);
};

export default useSendImageMessage;
