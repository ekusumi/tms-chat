import PimmService from "../services/PimmService";
import Log from "../utils/Log";

const useGetActiveRouteShipment = async (dcId: string) => {
  Log.debug("useGetActiveRouteShipment hook called");
  let activeRouteShipments = await PimmService.getActiveRouteShipment(dcId);
  return activeRouteShipments;
};

export default useGetActiveRouteShipment;
