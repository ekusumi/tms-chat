import AmityService from "../services/AmityService";

const useAddMessageReaction = async (messageId: string, reaction: string) => {
  await AmityService.addMessageReaction(messageId, reaction);
};

export default useAddMessageReaction;
