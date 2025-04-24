import AmityService from "../services/AmityService";
import Log from "../utils/Log";

const useMarkChannelRead = async (channelId: string) => {
  // Log.debug(`Mark Channel: ${channelId} as read`);
  await AmityService.markChannelRead(channelId);
};

export default useMarkChannelRead;
