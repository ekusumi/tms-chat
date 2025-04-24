import AmityService from "../services/AmityService";
import { getMessage } from "../types/Chat/Message";
import Log from "../utils/Log";

const useSendTextMessage = async (
  channelId: string,
  text: string,
  tags: string[]
) => {
  Log.debug("useSendTextMessage hook called");
  let message = await AmityService.sendTextMessage(channelId, text, tags);
  return getMessage(message);
};

export default useSendTextMessage;
