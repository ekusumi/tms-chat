import LocalStorage from "../../utils/LocalStorage";

type User = {
  userId: string;
  defaultSiteID: string;
  firstName: string;
  lastName: string;
  roles: [string];
  username: string;
};

export const getFullName = (user: User) => {
  if (user != null) {
    return `${user.firstName} ${user.lastName}`;
  } else {
    return "";
  }
};

export const getInitials = (user: User) => {
  if (user != null) {
    let firsLetter = Array.from(user.firstName)[0];
    let lastLetter = Array.from(user.lastName)[0];
    return `${firsLetter}${lastLetter}`;
  } else {
    return "";
  }
};

export const saveUser = async (user: User) => {
  try {
    let json = JSON.stringify(user);
    await LocalStorage.saveData(user.userId, json);
  } catch (error) {
    console.error("Error: " + error);
  }
};

export const getUser = (userId: string) => {
  let json = LocalStorage.getData(userId);
  if (json != null) {
    let object = JSON.parse(json);
    let user = object as User;
    return user;
  }
  return null;
};

export const getRole = (user: User) => {
  let roleName = "Driver";
  user?.roles.map((role) => {
    if (role == "RMS DISPATCHER") {
      roleName = "Dispatcher";
    } else if (role == "SALES REP") {
      roleName = "Sales Representative";
    }
  });
  return roleName;
};

export const saveLoginId = async (userId: string) => {
  await LocalStorage.saveData("loginId", userId);
};

export const saveSiteId = async (siteId: string) => {
  await LocalStorage.saveData("siteId", siteId);
};

export default User;
