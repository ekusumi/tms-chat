import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native";

const HomePage = () => {
  return (
    <SafeAreaView>
      <Redirect href={"/login"} />
    </SafeAreaView>
  );
};

export default HomePage;
