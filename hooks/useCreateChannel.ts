import AmityService from "../services/AmityService";
import LocalStorage from "../utils/LocalStorage";
import Log from "../utils/Log";

const useCreateChannel = async (userIds: string[]) => {
  Log.debug("useCreateChannel hook called");
  let siteId = LocalStorage.getData("siteId");
  let channel = await AmityService.createChannel(userIds, siteId!);
  return channel;
};

export default useCreateChannel;
