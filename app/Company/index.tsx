import { View, Text, Button, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function WorkerHome() {
  const router = useRouter();

  return (
    <ScrollView>
      <View>
        <Text>Worker Home</Text>
        <Text>Home</Text>
      </View>
     
    </ScrollView>
  );
}
