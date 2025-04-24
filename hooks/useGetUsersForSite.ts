import PimmService from "../services/PimmService";
import Log from "../utils/Log";

const useGetUsersForSite = async (siteId: string) => {
  Log.debug("getUsersForSite hook called");
  let users = await PimmService.getUsersForSite(siteId);
  return users;
};

export default useGetUsersForSite;
