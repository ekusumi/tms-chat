import LocalStorage from "../utils/LocalStorage";

const useRemoveLoginCredentials = async () => {
  await LocalStorage.removePersistentData("spid");
  await LocalStorage.removePersistentData("username");
  await LocalStorage.removePersistentData("password");
};

export default useRemoveLoginCredentials;
