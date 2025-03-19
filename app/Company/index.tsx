import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WorkerHome() {
  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.navigation}>
        <Ionicons name="menu" size={30} />
        <Text>Home</Text>
        <Ionicons name="person" size={30} />
      </View>

      <Text
        style={{
          marginLeft: 30,
          fontSize: 20,
          fontWeight: "600",
          marginTop: 20,
        }}
      >
        Jobs
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonLabel}>Pending</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonLabel}>Accepted</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Job Listings */}
      <ScrollView style={styles.jobList}>
        {[...Array(4)].map((_, index) => (
          <View key={index} style={styles.jobCard}>
            <View>
              <Text style={styles.jobTitle}>Professional Waiter</Text>
              <Text style={styles.jobCompany}>Dier Dubai</Text>
              <Text>15 AED /hour</Text>
              <View style={styles.starContainer}>
                <Ionicons name="star" color="orange" />
                <Ionicons name="star" color="orange" />
                <Ionicons name="star" color="orange" />
                <Ionicons name="star" color="orange" />
              </View>
            </View>
            <View style={styles.profileContainer}>
              <Ionicons name="person" size={30} />
              <Text>John Doe</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full screen
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#134169",
    padding: 10,
    borderRadius: 20,
    width: "30%",
  },
  buttonLabel: {
    color: "white",
    textAlign: "center",
  },
  jobList: {
    flex: 1, // Make it scrollable
  },
  jobCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#D9D9D9",
    padding: 20,
    margin: 17,
    borderRadius: 15,
  },
  jobTitle: {
    fontWeight: "500",
    fontSize: 20,
  },
  jobCompany: {
    fontWeight: "500",
    color: "#868686",
  },
  starContainer: {
    flexDirection: "row",
  },
  profileContainer: {
    alignItems: "center",
  },
});
