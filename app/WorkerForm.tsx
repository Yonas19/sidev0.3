import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseApp } from "../FireBaseConfig";
import { useRouter } from "expo-router";

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const CompanyForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+971");
  const [location, setLocation] = useState("");

  const [id, setId] = useState(null);
  const [cv, setCv] = useState(null);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const pickDocument = async (type) => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (!result.canceled) {
      if (type === "id") {
        setId(result.assets[0]);
      } else if (type === "cv") {
        setCv(result.assets[0]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !phone || !location || !cv || !id) {
      setError("Please fill in all fields and upload a business license.");
      return;
    }
    setError("");
    try {
      // Upload ID to Firebase Storage
      const idRef = ref(storage, `idUploads/${id.name}`);
      const idResponse = await fetch(id.uri);
      const idBlob = await idResponse.blob();
      const idUploadTask = uploadBytesResumable(idRef, idBlob);

      // Upload CV to Firebase Storage
      const cvRef = ref(storage, `cvUploads/${cv.name}`);
      const cvResponse = await fetch(cv.uri);
      const cvBlob = await cvResponse.blob();
      const cvUploadTask = uploadBytesResumable(cvRef, cvBlob);

      // Wait for both uploads to complete
      await Promise.all([
        new Promise((resolve, reject) => {
          idUploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const idUrl = await getDownloadURL(idUploadTask.snapshot.ref);
              resolve(idUrl);
            }
          );
        }),
        new Promise((resolve, reject) => {
          cvUploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const cvUrl = await getDownloadURL(cvUploadTask.snapshot.ref);
              resolve(cvUrl);
            }
          );
        }),
      ]).then(async ([idUrl, cvUrl]) => {
        // Save user data to Firestore
        await addDoc(collection(db, "users"), {
          fullName,
          email,
          phone,
          location,
          cvUrl,
          idUrl,
        });

        console.log("User information submitted successfully!");
        router.push("/JobListing");
      });
    } catch (error) {
      setError("Error submitting data: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={styles.profileLogo}
        />

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+971"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Emirate ID</Text>
        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickDocument("id")}
          >
            <Image
              source={require("../assets/images/upload-icon.png")}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>

          {id && (
            <TouchableOpacity
              style={styles.fileBox}
              onPress={() => setModalVisible(true)}
            >
              <Text
                numberOfLines={1}
                style={{ color: "blue", textDecorationLine: "underline" }}
              >
                {id.name}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>CV</Text>
        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickDocument("cv")}
          >
            <Image
              source={require("../assets/images/upload-icon.png")}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>

          {cv && (
            <TouchableOpacity
              style={styles.fileBox}
              onPress={() => setModalVisible(true)}
            >
              <Text
                numberOfLines={1}
                style={{ color: "blue", textDecorationLine: "underline" }}
              >
                {cv.name}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for PDF Preview */}
      {id && (
        <Modal animationType="slide" transparent={false} visible={modalVisible}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  backgroundColor: "black",
                  textAlign: "center",
                  padding: 10,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 15,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: { fontSize: 16, alignSelf: "flex-start", marginBottom: 2 },
  input: {
    width: 350,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#134169",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginRight: 10,
  },
  closeButton: {
    padding: 10,
  },
  uploadIcon: { width: 20, height: 20, marginRight: 10 },
  uploadText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  fileBox: {
    width: 150,
    height: 40,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  button: {
    width: "70%",
    height: 50,
    backgroundColor: "#134169",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 5,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  errorText: { color: "red", marginBottom: 5 },
  profileLogo: {
    width: 100,
    height: 100,
  },
});

export default CompanyForm;
