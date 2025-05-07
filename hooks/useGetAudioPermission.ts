import { AudioModule } from "expo-audio";
import { Alert } from "react-native";

const useGetAudioPermission = async () => {
  const status = await AudioModule.requestRecordingPermissionsAsync();
  if (!status.granted) {
    Alert.alert("Permission to access microphone was denied");
  }
};

export const getAudioPermission = async () => {
  return await AudioModule.getRecordingPermissionsAsync();
};

export default useGetAudioPermission;
