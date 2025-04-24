import * as Notifications from "expo-notifications";
import Log from "../utils/Log";

const useRegisterNotifications = async () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const permission = await Notifications.requestPermissionsAsync();
  Log.debug(`Notification Permission: ${JSON.stringify(permission)}`);
};

export default useRegisterNotifications;
