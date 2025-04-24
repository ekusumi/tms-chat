import LocalStorage from "../../utils/LocalStorage";

type ActiveRouteShipment = {
  shipmentId: string;
  status: number;
  dispatchTime: string;
  routeName: string;
  trailer?: Asset;
  tractor?: Asset;
  driver?: Driver;
  stops?: Stop[];
};

export type Asset = {
  id: string;
  name: string;
};

export type Driver = {
  id: string;
  userId: string;
  username: string;
  name: string;
  isPlaceholder: boolean;
  mobileNumber: string;
};

export type Stop = {
  SiteId: string;
  CustomerName: string;
  SiteName: string;
  Address: string;
  City: string;
  State: string;
  Postal: string;
};

export const getRouteName = (userId: string) => {
  return getValue("routeName", userId);
};

export const getTractorName = (userId: string) => {
  return getValue("tractorName", userId);
};

export const getTrailerName = (userId: string) => {
  return getValue("trailerName", userId);
};

export const getDeliveryId = (userId: string) => {
  return getValue("deliveryId", userId);
};

export const getStops = (userId: string) => {
  return getValue("stops", userId);
};

export const getValue = (key: string, userId: string) => {
  let value;
  let activeRouteShipments = JSON.parse(
    LocalStorage.getData("activeRouteShipments")!
  ) as [ActiveRouteShipment];

  activeRouteShipments.map((activeRouteShipment) => {
    if (activeRouteShipment.driver) {
      if (activeRouteShipment.driver.userId == userId) {
        if (key == "routeName") {
          value = activeRouteShipment.routeName;
        } else if (key == "tractorName") {
          value = activeRouteShipment.tractor?.name!;
        } else if (key == "trailerName") {
          value = activeRouteShipment.trailer?.name!;
        } else if (key == "deliveryId") {
          value = activeRouteShipment.shipmentId;
        } else if (key == "stops") {
          value = activeRouteShipment.stops;
        }
      }
    }
  });

  return value;
};

export default ActiveRouteShipment;
