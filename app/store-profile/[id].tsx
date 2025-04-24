import { useLocalSearchParams } from "expo-router";
import StoreProfilePage from "../../pages/StoreProfilePage";
import Log from "../../utils/Log";

const storeprofile_id = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  Log.debug(`Presenting Stop Profile Page for siteId: ${id}`);
  return <StoreProfilePage siteId={id} />;
};

export default storeprofile_id;
