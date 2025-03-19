
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Checkbox } from "react-native-paper";

export default function JobForm() {
  const [jobType, setJobType] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [workDays, setWorkDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
  const [checkedDays, setCheckedDays] = useState([]);
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSubmit = () => {
    if (!agree) {
      Alert.alert("Error", "You must agree to the privacy policy.");
      return;
    }
    Alert.alert("Success", "Job posted successfully!");
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: "#f4f4f4" }}>
      <Text style={styles.label}>Job Title</Text>
      <TextInput style={styles.input} placeholder="Enter Job Title" />

      <Text style={styles.label}>Job Type</Text>
      <DropDownPicker
        open={false}
        value={jobType}
        items={[
          { label: "Remote", value: "Remote" },
          { label: "On-Site", value: "On-Site" },
          { label: "Hybrid", value: "Hybrid" },
        ]}
        setValue={setJobType}
        style={styles.dropdown}
      />

      <Text style={styles.label}>Industry</Text>
      <DropDownPicker
        open={false}
        value={industry}
        items={[
          { label: "Retail", value: "Retail" },
          { label: "IT", value: "IT" },
          { label: "Hospitality", value: "Hospitality" },
        ]}
        setValue={setIndustry}
        style={styles.dropdown}
      />

      <Text style={styles.label}>Work Days</Text>
      {workDays.map((day) => (
        <View key={day} style={styles.checkboxContainer}>
          <Checkbox
            status={checkedDays.includes(day) ? "checked" : "unchecked"}
            onPress={() =>
              setCheckedDays((prev) =>
                prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
              )
            }
          />
          <Text>{day}</Text>
        </View>
      ))}

      <Text style={styles.label}>Start Time</Text>
      <TextInput style={styles.input} placeholder="HH:MM AM/PM" />

      <Text style={styles.label}>End Time</Text>
      <TextInput style={styles.input} placeholder="HH:MM AM/PM" />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} placeholder="Enter Location" />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="+971 123 4567 89"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Application Deadline</Text>
      <TextInput style={styles.input} placeholder="YYYY-MM-DD" />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.textarea} placeholder="Enter job description" multiline numberOfLines={4} />

      <View style={styles.checkboxContainer}>
        <Checkbox status={agree ? "checked" : "unchecked"} onPress={() => setAgree(!agree)} />
        <Text>I have read and agreed to the privacy policy</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },

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
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  textarea: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 80,
  },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  button: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: { backgroundColor: "#ccc" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
};