import PimmService from "../services/PimmService";
import User, { saveLoginId, saveSiteId, saveUser } from "../types/Pimm/User";
import LocalStorage from "../utils/LocalStorage";
import Log from "../utils/Log";
import useSaveLoginCredentials from "./useSaveLoginCredentials";

const useAuthenticateUser = async (
  spid: string,
  username: string,
  password: string
) => {
  try {
    Log.debug("useAuthenticateUser hook called");
    await saveSpidUsernameAndPassword(spid, username, password);
    let user = await PimmService.loginUsernameAndPassword();
    if (user != null) {
      let isAllowed = checkUserRole(user);
      if (isAllowed) {
        saveLoginUser(user);
        await useSaveLoginCredentials(spid, username, password);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    Log.error(`Error: ${error}`);
    return false;
  }
};

const saveLoginUser = (user: User) => {
  saveUser(user);
  saveLoginId(user.userId);
  saveSiteId(user.defaultSiteID);
};

const saveSpidUsernameAndPassword = async (
  spid: string,
  username: string,
  password: string
) => {
  LocalStorage.saveData("spid", spid);
  LocalStorage.saveData("username", username);
  LocalStorage.saveData("password", password);
};

const checkUserRole = (user: User) => {
  let roles = user.roles;
  let isDispatcher = false;
  roles.map((role) => {
    if (role == "RMS DISPATCHER") {
      isDispatcher = true;
    }
  });

  return isDispatcher;
};

export default useAuthenticateUser;
