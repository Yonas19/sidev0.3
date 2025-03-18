import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function WorkerHome() {
  const router = useRouter();

  return (
    <ScrollView>
      <View style={styles.navigation}>
        <Ionicons name="menu" size={30} />
        <Text>Home</Text>
        <Ionicons name="person" size={30} />
      </View>

      <Text style={{ marginLeft: 30, fontSize: 20, fontWeight: 600 }}>Jobs</Text>
      
      <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:30}}>
      <TouchableOpacity>
        <Text>Pending</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text>Accepted</Text>
      </TouchableOpacity>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    padding:20,
  }
});
