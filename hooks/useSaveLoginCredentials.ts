import LocalStorage from "../utils/LocalStorage";

const useSaveLoginCredentials = async (
  spid: string,
  username: string,
  password: string
) => {
  await LocalStorage.saveData("spid", spid);
  await LocalStorage.saveData("username", username);
  await LocalStorage.saveData("password", password);

  // await LocalStorage.savePersistentData("spid", spid);
  // await LocalStorage.savePersistentData("username", username);
  // await LocalStorage.savePersistentData("password", password);
};

export default useSaveLoginCredentials;
