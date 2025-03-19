import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Checkbox } from "react-native-paper";
import { db } from "../../FireBaseConfig"; // Import the Firebase configuration
import { collection, addDoc } from "firebase/firestore"; // Firebase Firestore functions

export default function JobForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobTypeOpen, setJobTypeOpen] = useState(false);
  const [jobType, setJobType] = useState(null);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [industry, setIndustry] = useState(null);
  const [workDays, setWorkDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);
  const [checkedDays, setCheckedDays] = useState([]);
  const [phone, setPhone] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSubmit = async () => {
    if (!agree) {
      Alert.alert("Error", "You must agree to the privacy policy.");
      return;
    }

    if (
      !jobTitle ||
      !jobType ||
      !industry ||
      checkedDays.length === 0 ||
      !phone ||
      !startTime ||
      !endTime ||
      !location ||
      !deadline ||
      !description
    ) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    // Create the job posting object
    const jobData = {
      jobTitle,
      jobType,
      industry,
      workDays: checkedDays,
      phone,
      startTime,
      endTime,
      location,
      deadline,
      description,
      // Store the logged-in company ID
      createdAt: new Date(),
    };

    try {
      // Add the job data to Firestore
      const docRef = await addDoc(collection(db, "jobListings"), jobData);
      Alert.alert("Success", "Job posted successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Something went wrong, please try again.");
    }
  };

  const handleCancel = () => {
    setJobTitle("");
    setJobType(null);
    setIndustry(null);
    setCheckedDays([]);
    setPhone("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setDeadline("");
    setDescription("");
    setAgree(false);
  };

  return (
    <ScrollView
      style={{ padding: 20, backgroundColor: "#f4f4f4" }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Job Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Job Title"
        value={jobTitle}
        onChangeText={setJobTitle}
      />

      <Text style={styles.label}>Job Type</Text>
      <View style={{ zIndex: 1000 }}>
        <DropDownPicker
          open={jobTypeOpen}
          value={jobType}
          items={[
            { label: "Remote", value: "Remote" },
            { label: "On-Site", value: "On-Site" },
            { label: "Hybrid", value: "Hybrid" },
          ]}
          setOpen={setJobTypeOpen}
          setValue={setJobType}
          style={styles.dropdown}
        />
      </View>

      <Text style={styles.label}>Industry</Text>
      <View style={{ zIndex: 900 }}>
        <DropDownPicker
          open={industryOpen}
          value={industry}
          items={[
            { label: "Retail", value: "Retail" },
            { label: "IT", value: "IT" },
            { label: "Hospitality", value: "Hospitality" },
          ]}
          setOpen={setIndustryOpen}
          setValue={setIndustry}
          style={styles.dropdown}
        />
      </View>

      <Text style={styles.label}>Work Days</Text>
      {workDays.map((day) => (
        <View key={day} style={styles.checkboxContainer}>
          <Checkbox
            status={checkedDays.includes(day) ? "checked" : "unchecked"}
            onPress={() =>
              setCheckedDays((prev) =>
                prev.includes(day)
                  ? prev.filter((d) => d !== day)
                  : [...prev, day]
              )
            }
          />
          <Text>{day}</Text>
        </View>
      ))}

      <Text style={styles.label}>Start Time</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM AM/PM"
        value={startTime}
        onChangeText={setStartTime}
      />

      <Text style={styles.label}>End Time</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM AM/PM"
        value={endTime}
        onChangeText={setEndTime}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Location"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="+971 123 4567 89"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Application Deadline</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={deadline}
        onChangeText={setDeadline}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Enter job description"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={agree ? "checked" : "unchecked"}
          onPress={() => setAgree(!agree)}
        />
        <Text>I have read and agreed to the privacy policy</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  textarea: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 80,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    flex: 1,
    backgroundColor: "#134169",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
