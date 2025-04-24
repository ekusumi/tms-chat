import { useLocalSearchParams } from "expo-router";
import RouteManifestPage from "../../pages/RouteManifestPage";

const routemanifest_id = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RouteManifestPage deliveryId={id} />;
};

export default routemanifest_id;
