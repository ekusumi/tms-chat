import * as ImagePicker from "expo-image-picker";
import Log from "../utils/Log";

type UseImagePickerCallback = (path: string | null) => void;

const useImagePicker = async (
  selection: number,
  callback: UseImagePickerCallback
) => {
  Log.debug("useImagePicker hook called");

  const chooseFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (result.assets) {
      Log.info(`User selected a photo from library ${result.assets![0].uri}`);
      callback(result.assets![0].uri);
    } else {
      Log.info(`User cancelled selecting a photo from library`);
      callback(null);
    }
  };

  const takeAPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (result.assets) {
        Log.info(`User selected a photo from library ${result.assets![0].uri}`);
        callback(result.assets![0].uri);
      } else {
        Log.info(`User cancelled selecting a photo from library`);
        callback(null);
      }
    }
  };

  if (selection == 1) {
    await chooseFromLibrary();
  } else {
    await takeAPhoto();
  }
};

export default useImagePicker;
