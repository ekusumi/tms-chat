import AmityService from "../services/AmityService";
import * as FileSystem from "expo-file-system";
import LocalStorage from "../utils/LocalStorage";

const useDownloadFile = async (fileId: string) => {
  let file = await AmityService.downloadFile(fileId);
  downloadFile(file.data.fileUrl, file.data.fileId, file.data.attributes.name);
  return file;
};

const downloadFile = async (url: string, fileId: string, filename: string) => {
  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    FileSystem.documentDirectory + `${filename}`,
    {}
  );

  try {
    const result = await downloadResumable.downloadAsync();
    await LocalStorage.saveData(fileId, result?.uri!);
  } catch (e) {
    console.error(e);
  }
};
export default useDownloadFile;
