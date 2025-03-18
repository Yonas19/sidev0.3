import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";

import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import { firebaseApp } from "../FireBaseConfig";
import { navigate } from "expo-router/build/global-state/routing";




const Signupcompany = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const auth1 = getAuth(firebaseApp);
  const router = useRouter();


  const handleSignup = async () => {
    setLoading(true);
    setError(null);
 
    try {
      await createUserWithEmailAndPassword(auth1, email, password);
      console.log("SignUp successful");
      router.push("/WorkerForm")
    } catch (error) {
      setError(error.message); // Display the error message
      console.error("Signup Error:", error);
    } finally {
      setLoading(false);
    }
  };
 
 
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/images/splash-icon.png")} />
      <Text style={styles.title}>Sign up as Worker</Text>


      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email input"
        accessibilityHint="Enter your email address"
      />


      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password input"
        accessibilityHint="Enter your password"
      />


      {error ? <Text style={styles.errorText}>{error}</Text> : null}


      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign up</Text>}
      </TouchableOpacity>


     
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 50,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: "70%",
    height: 50,
    backgroundColor: "rgba(19, 65, 105, 1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 100,
    resizeMode: "contain",
  },
  loginText: {
    marginTop: 5,
    fontSize: 16,
    color: "#007bff",
  },
});


export default Signupcompany;

