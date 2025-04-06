import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Recruit from "../Recruit";
import { useEffect } from "react";
import { doc, getDocs,getDoc, setDoc , collection} from "firebase/firestore";
import { db, auth } from "../../FireBaseConfig";

const { width, height } = Dimensions.get("window");

export default function WorkerHome() {
  const [applications, setApplications] = useState([]);
  const [bottombarVisible, setBottomVisible] = useState(false);
  const bottomAnim = useState(new Animated.Value(-height * 0.9))[0];

  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const toggleBottomBar = () => {
    Animated.timing(bottomAnim, {
      toValue: bottombarVisible ? -height * 0.9 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setBottomVisible(!bottombarVisible);
  };
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const companyDoc = await getDoc(doc(db, "companies", user.uid));
          if (companyDoc.exists()) {
            const data = companyDoc.data();
            setEmail(data.email || ""); // Set email from Firestore
            setPhone(data.phone || ""); // Set phone from Firestore
          } else {
            console.log("No company document found for this user.");
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
  
    fetchCompanyData();
  }, []); 
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "applications"));
        const apps = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications: ", error);
      }
    };

    fetchApplications();
  }, []);
  

  const updateUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "companies", user.uid), {
          email,
          phone,
        }, { merge: true }); // Merge to keep existing data

        alert("Profile updated successfully!");
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.navigation}>
        <Ionicons name="menu" size={30} />
        <Text>Home</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="person" size={30} />
        </TouchableOpacity>
      </View>

      <Text style={styles.heading}>Jobs</Text>

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
      <FlatList
      data={applications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.jobCard} onPress={toggleBottomBar}>
          <View>
            <Text style={styles.jobTitle}>{item.jobTitle || "Unknown Job"}</Text>
            <Text style={styles.jobCompany}>{item.company || "Unknown Company"}</Text>
            <Text>{item.salary || "N/A"} AED /hour</Text>
            <View style={styles.starContainer}>
              <Ionicons name="star" color="orange" />
              <Ionicons name="star" color="orange" />
              <Ionicons name="star" color="orange" />
              <Ionicons name="star" color="orange" />
            </View>
          </View>
          <View style={styles.profileContainer}>
            <Ionicons name="person" size={30} />
            <Text>{item.name || "Anonymous"}</Text>
          </View>
        </TouchableOpacity>
      )}
    />

      {/* Animated Bottom Bar */}
      <Animated.View style={[styles.bottombar, { bottom: bottomAnim }]}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleBottomBar}>
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.bottomText}>Job Details</Text>
        <ScrollView>
          <Recruit />
        </ScrollView>
      </Animated.View>

      {/* Modal for Editing Email & Phone */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.updateButton]} onPress={updateUserData}>
                <Text style={styles.buttonText} >Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    marginLeft: 30,
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
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
    flex: 1,
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
  bottombar: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: 10,
    right: 10,
    height: height * 0.9,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1500,
    paddingTop: 80,
  },
  bottomText: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 20,
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  updateButton: {
    backgroundColor: "#134169",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
