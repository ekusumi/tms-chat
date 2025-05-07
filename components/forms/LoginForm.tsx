import { Alert, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";

import TextField from "../controls/TextField";
import TextButton from "../controls/TextButton";

import useAuthenticateUser from "../../hooks/useAuthenticateUser";
import useGetLoginCredentials from "../../hooks/useGetLoginCredentials";
import useGetSiteSettings from "../../hooks/useGetSiteSettings";
import useGetUsersForSite from "../../hooks/useGetUsersForSite";

import AmityService from "../../services/AmityService";

import { saveSiteSettings } from "../../types/Pimm/SiteSettings";
import User, { saveUser } from "../../types/Pimm/User";

import LocalStorage from "../../utils/LocalStorage";
import useGetUsersByRole from "../../hooks/useGetUsersByRole";
import Log from "../../utils/Log";
import Loader from "../views/Loader";
import useGetAssetsForDispatch from "../../hooks/useGetAssetsForDispatch";
import useGetChannels, {
  useDownloadChannels,
} from "../../hooks/useGetChannels";

const LoginForm = () => {
  const [spid, setSpid] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [enableLogin, setEnableLogin] = useState(false);
  const [loginClicked, setLoginClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setSpidValue = (spid: string) => {
    setSpid(spid);
  };

  const setUsernameValue = (username: string) => {
    setUsername(username);
  };

  const setPasswordValue = (password: string) => {
    setPassword(password);
  };

  const onClick_btnLogin = () => {
    if (enableLogin == true) {
      Log.info(`The user clicked the login button`);
      setLoginClicked(true);
    }
  };

  const getSiteSettings = async () => {
    let siteId = LocalStorage.getData("siteId");
    let siteSettings = await useGetSiteSettings(siteId!);
    saveSiteSettings(siteSettings);
    return;
  };

  const getUsersForSite = async () => {
    let siteId = LocalStorage.getData("siteId");
    let users: User[] = await useGetUsersForSite(siteId!);
    saveUsers(users);
    return;
  };

  const getUsersByRoles = async () => {
    let users: User[] = await useGetUsersByRole();
    saveUsers(users);
    return;
  };

  const getAssetsForDispatch = async () => {
    let siteId = LocalStorage.getData("siteId");
    let object = await useGetAssetsForDispatch(siteId!);
    return object;
  };

  const saveUsers = (users: User[]) => {
    users.map((user) => {
      saveUser(user);
    });
  };

  const showLoginFailed = () => {
    Alert.alert(
      "Login Failed!",
      "User does not exist. Check SPID and/or Username settings.",
      [
        {
          text: "OK",
          onPress: () => {},
        },
      ]
    );
  };

  const getPimmData = async () => {
    await getSiteSettings();
    await getUsersForSite();
    await getUsersByRoles();
    await getAssetsForDispatch();
  };

  const loginToAmity = async () => {
    let userId = LocalStorage.getData("loginId");
    let isConnected = await AmityService.initClient(userId!);
    return isConnected;
  };

  useEffect(() => {
    const checkIfSavedLoginExists = async () => {
      let login = await useGetLoginCredentials();
      if (login) {
        setSpid(login.spid);
        setUsername(login.username);
        setPassword(login.password);
        setLoginClicked(true);
      } else {
        checkIfEnableLogin();
      }
    };

    const checkIfEnableLogin = () => {
      if (spid.length > 0 && username.length > 0 && password.length > 0) {
        setEnableLogin(true);
      } else {
        setEnableLogin(false);
      }
    };

    checkIfSavedLoginExists();
  }, [spid, username, password]);

  useEffect(() => {
    const authenticateUser = async () => {
      if (loginClicked == true) {
        setIsLoading(true);
        let connected = await useAuthenticateUser(spid, username, password);
        if (connected) {
          Log.debug(`Successfully logged in to Pimm Server`);
          await getPimmData();
          let success = await loginToAmity();
          if (success) {
            Log.info("Successfully logged in to Amity Server");
            setTimeout(async () => {
              await useDownloadChannels();
              setIsLoading(false);
              setLoginClicked(false);
              router.push("/channel/list");
            }, 5000);
          } else {
            setIsLoading(false);
            setLoginClicked(false);
            Log.error("Failed to login to Amity Server");
            showLoginFailed();
          }
        } else {
          setIsLoading(false);
          setLoginClicked(false);
          Log.error("Failed to login to Pimm Server");
          showLoginFailed();
        }
      }
    };

    authenticateUser();
  }, [loginClicked]);

  return (
    <View style={styles.container}>
      <View>
        <TextField placeholder="SPID" updateText={setSpidValue} />
        <TextField placeholder="Username" updateText={setUsernameValue} />
        <TextField placeholder="Password" updateText={setPasswordValue} />
        <TextButton text="LOGIN" onClick={onClick_btnLogin} />
      </View>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 260,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    borderRadius: 20,
    paddingTop: 20,
    paddingLeft: 10,
  },
});

export default LoginForm;
