import AmityService from "../services/AmityService";

const useDeleteChannel = async (channelId: string) => {
  await AmityService.deleteChannel(channelId);
};

export default useDeleteChannel;
