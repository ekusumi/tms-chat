import LocalStorage from "../utils/LocalStorage";

const useGetLoginCredentials = async () => {
  let spid = await LocalStorage.getPersistentData("spid");
  let username = await LocalStorage.getPersistentData("username");
  let password = await LocalStorage.getPersistentData("password");

  if (spid != null) {
    let login: Login = {
      spid: spid!,
      username: username!,
      password: password!,
    };
    return login;
  } else {
    return null;
  }
};

export default useGetLoginCredentials;
