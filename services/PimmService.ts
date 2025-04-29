import LocalStorage from "../utils/LocalStorage";
import NetworkClient, { NetworkRequest } from "./NetworkClient";
import User from "../types/Pimm/User";
import base64 from "react-native-base64";
import ActiveRouteShipment from "../types/Pimm/ActiveRouteShipment";
import SdrReport from "../types/Pimm/SdrReport";
import SiteSettings from "../types/Pimm/SiteSettings";

const PimmService = {
  loginUsernameAndPassword: async () => {
    let request = createRequest("/Pimm/User", "GET");
    let object = await NetworkClient.makeRequest(request);
    let user = object as User;
    return user;
  },

  getUsersByRoles: async () => {
    let encode = encodeURI('["RMS DISPATCHER", "SALES REP", "User"]');
    let request = createRequest(`/Pimm/User/GetByRoles?roles=${encode}`, "GET");
    let object = await NetworkClient.makeRequest(request);
    let users = object as [User];
    return users;
  },

  getUsersForSite: async (siteId: string) => {
    let request = createRequest(
      `/Pimm/User/GetUserInfoForSite?siteId=${siteId}`,
      "GET"
    );
    let object = await NetworkClient.makeRequest(request);
    let users = object as [User];
    return users;
  },

  getActiveRouteShipment: async (dcId: string) => {
    let request = createRequest(
      `/StoreDelivery/RouteShipment2/GetActiveRoutesAssignment?dcId=${dcId}`,
      "GET"
    );
    let object = await NetworkClient.makeRequest(request);
    let activeRouteShipments = object as [ActiveRouteShipment];
    return activeRouteShipments;
  },

  getAssetsForDispatch: async (siteId: string) => {
    let request = createRequest(
      `/routes/site/AssetsForDispatch?id=${siteId}`,
      "GET"
    );
    let object = await NetworkClient.makeRequest(request);
    return object;
  },

  getSdrReportForDeliveryId: async (deliveryId: string) => {
    let request = createRequest(
      `/StoreDelivery/RouteShipment2/Report?deliveryId=${deliveryId}`,
      "GET"
    );
    let object = await NetworkClient.makeRequest(request);
    let sdrReport = object as SdrReport;
    return sdrReport;
  },

  getSiteSettings: async (siteId: string) => {
    let request = createRequest(
      `/StoreDelivery/Settings?siteId=${siteId}`,
      "GET"
    );
    let object = await NetworkClient.makeRequest(request);
    let siteSettings = object as SiteSettings;
    return siteSettings;
  },
};

const createRequest = (path: string, method: string, body?: any) => {
  const request: NetworkRequest = {
    baseUrl: getBaseUrl(),
    path: path,
    headers: getHeaders(),
    method: method,
    body: body,
  };
  return request;
};

const getBaseUrl = () => {
  let spid = LocalStorage.getData("spid");
  return "https://" + spid + ".pimm.us/WebPimm5/Rest";
};

const getHeaders = () => {
  let username = LocalStorage.getData("username");
  let password = LocalStorage.getData("password");
  let basicAuth = `Basic ${base64.encode(`${username}:${password}`)}`;
  let headers = new Headers();
  headers.append("Authorization", basicAuth);
  headers.append("agent", "mobile");
  return headers;
};

export default PimmService;
