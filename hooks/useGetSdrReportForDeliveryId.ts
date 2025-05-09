import PimmService from "../services/PimmService";
import SdrReport from "../types/Pimm/SdrReport";
import LocalStorage from "../utils/LocalStorage";
import Log from "../utils/Log";

const useGetSdrReportForDeliveryId = async (deliveryId: string) => {
  Log.debug("useGetSdrReportForDeliveryId hook called");
  let sdrReport = await PimmService.getSdrReportForDeliveryId(deliveryId);
  saveSdrReport(deliveryId, sdrReport);
  return sdrReport;
};

const saveSdrReport = async (deliveryId: string, sdrReport: SdrReport) => {
  await LocalStorage.saveData(deliveryId, JSON.stringify(sdrReport));
  sdrReport.Hierarchy.GIS.Stops.map(async (sdrStop) => {
    await LocalStorage.saveData(sdrStop.SiteId, JSON.stringify(sdrStop));
  });
};

export default useGetSdrReportForDeliveryId;
