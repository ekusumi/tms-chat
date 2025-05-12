import PimmService from "../services/PimmService";
import User, { getFullName } from "../types/Pimm/User";
import LocalStorage from "../utils/LocalStorage";
import Log from "../utils/Log";

const useGetUsersByRole = async () => {
  Log.debug("getUsersByRoles hook called");
  let users = await PimmService.getUsersByRoles();
  return users;
};

const sortContacts = (contacts: User[]) => {
  contacts.sort((user1, user2) => {
    if (getFullName(user1) < getFullName(user2)) {
      return -1;
    }
    if (getFullName(user1) > getFullName(user2)) {
      return 1;
    }
    return 0;
  });
  return contacts;
};

export const sortUsers = (users: User[]) => {
  let dispatchers = new Array();
  let drivers = new Array();
  let salesReps = new Array();
  let siteId = LocalStorage.getData("siteId");
  let userId = LocalStorage.getData("loginId");

  users.map((user) => {
    if (user.firstName != undefined && user.firstName.length > 0) {
      if (
        siteId?.toLocaleLowerCase() == user.defaultSiteID.toLocaleLowerCase() &&
        userId?.toLocaleLowerCase() != user.userId.toLocaleLowerCase()
      ) {
        if (user.roles.includes("RMS DISPATCHER")) {
          dispatchers.push(user);
        } else if (user.roles.includes("SALES REP")) {
          salesReps.push(user);
        } else if (user.defaultSiteID.toLowerCase() == siteId?.toLowerCase()) {
          drivers.push(user);
        }
      }
    }
  });

  let newUsers = new Array();
  newUsers.push(...sortContacts(dispatchers));
  newUsers.push(...sortContacts(drivers));
  newUsers.push(...sortContacts(salesReps));

  return newUsers;
};

export default useGetUsersByRole;
