import { View, Text } from "react-native";
import React from "react";

const profile = () => {
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View
        style={{
          backgroundColor: "#F1F1F1",
          padding: 15,
          margin: 20,
          borderRadius: 15,
        }}
      >
        <Text style={{ fontSize: 16, color: "#000" }}>
          You can upgrade your account to a premium account to get more features
          and benefits. only for 500 AED/ month.
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#F1F1F1",
          padding: 15,
          margin: 20,
          marginTop: 3,
          borderRadius: 15,
        }}
      >
        <Text style={{ fontSize: 16, color: "#000" }}>
          You can upgrade your account to a premium account to get more features
          and benefits. only for 500 AED/ month.
        </Text>
      </View>
    </View>
  );
};

export default profile;
