import PimmService from "../services/PimmService";
import User from "../types/Pimm/User";
import LocalStorage from "../utils/LocalStorage";
import Log from "../utils/Log";

const useGetUsersByRole = async () => {
  Log.debug("getUsersByRoles hook called");
  let users = await PimmService.getUsersByRoles();
  return users;
};

export const sortUsers = (users: User[]) => {
  let dispatchers = new Array();
  let drivers = new Array();
  let salesReps = new Array();
  let siteId = LocalStorage.getData("siteId");

  users.map((user) => {
    if (user.firstName != undefined && user.firstName.length > 0) {
      if (user.roles.includes("RMS DISPATCHER")) {
        dispatchers.push(user);
      } else if (user.roles.includes("SALES REP")) {
        salesReps.push(user);
      } else if (user.defaultSiteID.toLowerCase() == siteId?.toLowerCase()) {
        drivers.push(user);
      }
    }
  });

  let newUsers = new Array();
  newUsers.push(...dispatchers);
  newUsers.push(...drivers);
  newUsers.push(...salesReps);

  return newUsers;
};

export default useGetUsersByRole;
