import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Recruit = () => {
  return (
    <View>
      <View style={styles.profileCard}>
        <View
          style={{
            backgroundColor: "#fff",
            width: 80,
            height: 80,
            borderRadius: 100,
            alignSelf: "center",
          }}
        ></View>
        <Text style={styles.profileText}>John Doe</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={styles.profileText}>4.0</Text>
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="star" color={"orange"} size={20} />
              <Ionicons name="star" color={"orange"} size={20} />
              <Ionicons name="star" color={"orange"} size={20} />
              <Ionicons name="star" color={"orange"} size={20} />
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.profileText}>5</Text>
            <Text style={styles.profileText}>Level</Text>
          </View>
        </View>
      </View>
      {/* details section*/}
      <View>
        <Text style={{ textAlign: "center", fontSize: 20, margin: 20 }}>
          Applicant Details
        </Text>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={styles.detail}>Email</Text>
          <Text style={styles.detail}>johndoe@gmail.com</Text>
        </View>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={styles.detail}>Phone number</Text>
          <Text style={styles.detail}>+971529677139</Text>
        </View>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={styles.detail}>Date of birth</Text>
          <Text style={styles.detail}>25/05/2004</Text>
        </View>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={styles.detail}>Address</Text>
          <Text style={styles.detail}>Dier, Dubai</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" ,margin:15}}>
          <TouchableOpacity style={styles.downloadbtn}>
            <Ionicons name="download-outline" color={"white"} size={20} />
            <Text style={{ fontSize: 15, color: "white" }}>Download CV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadbtn}>
            <Ionicons name="download-outline" color={"#fff"} size={20} />
            <Text style={{ fontSize: 15, color: "white", marginRight: 10 }}>
              Download CV
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 15,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#04981F",
              flexDirection: "row",
              alignItems: "center",
              justifyContent:'space-evenly',
              padding: 10,
              width: 170,
              borderRadius:15
            }}
          >
            <Ionicons name="checkmark-outline" color={"white"} size={20} />
            <Text style={{ fontSize: 18, color: "white" }}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#C60606",
              flexDirection: "row",
              alignItems: "center",
              justifyContent:'space-evenly',
              padding: 10,
              width: 170,
              borderRadius:15
            }}
          >
            <Ionicons name="checkmark-outline" color={"white"} size={20} />
            <Text style={{ fontSize: 18, color: "white" }}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#134169",
    height: 250,
    borderBottomEndRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: "center",
  },
  profileText: {
    color: "#fff",
    fontSize: 28,
    textAlign: "center",
  },
  detail: {
    fontSize: 20,
    fontWeight: 500,
    margin: 10,
  },
  downloadbtn: {
    backgroundColor: "#134169",
    padding: 15,
    width: 170,

    borderRadius: 18,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  arbtn: {
    backgroundColor: "#04981F",
    padding: 15,
    width: 180,
    borderRadius: 18,
    margin: 5,
  },
});

export default Recruit;
