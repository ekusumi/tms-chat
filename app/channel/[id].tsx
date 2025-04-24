import MessagePage from "../../pages/MessagePage";
import { useLocalSearchParams } from "expo-router";

const channel_id = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <MessagePage channelId={id} />;
};

export default channel_id;
