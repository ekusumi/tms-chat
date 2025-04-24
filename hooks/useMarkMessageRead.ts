import AmityService from "../services/AmityService";
import { Message } from "../types/Chat/Message";
import Log from "../utils/Log";

const useMarkMessageRead = async (message: Message) => {
  // Log.debug(`Mark Message: ${message.messageId} as read`);
  await AmityService.markMessageRead(message.messageId);
};

export default useMarkMessageRead;
