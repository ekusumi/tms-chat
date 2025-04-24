import PimmService from "../services/PimmService";
import Log from "../utils/Log";

const useGetSiteSettings = async (siteId: string) => {
  Log.debug("useGetSiteSettings hook called");
  let siteSettings = await PimmService.getSiteSettings(siteId);
  return siteSettings;
};

export default useGetSiteSettings;
