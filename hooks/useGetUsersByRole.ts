import PimmService from "../services/PimmService";
import Log from "../utils/Log";

const useGetUsersByRole = async () => {
  Log.debug("getUsersByRoles hook called");
  let users = await PimmService.getUsersByRoles();
  return users;
};

export default useGetUsersByRole;
