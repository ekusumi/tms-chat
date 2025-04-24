import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import Log from "../utils/Log";

const useScheduleLocalNotification = async (title: string, body: string) => {
  Log.debug("useScheduleLocalNotification hook called");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
};

export default useScheduleLocalNotification;
