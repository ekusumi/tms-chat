import { useLocalSearchParams } from "expo-router";
import ImagePage from "../../pages/ImagePage";

const image = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ImagePage fileId={id} />;
};

export default image;
