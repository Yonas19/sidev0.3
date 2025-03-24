import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, firestore } from "../FireBaseConfig"; // Import from firebaseConfig


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user); // Log the user object
      if (user) {
        try {
          await user.reload(); // Ensure user session is valid
          console.log("User session reloaded, redirecting...");
          redirectToDashboard(user.uid);
        } catch (error) {
          console.log("User session invalid, logging out...", error);
          await signOut(auth);
          router.push("/");
        }
      } else {
        console.log("No user signed in.");
      }
    });


    return () => unsubscribe();
  }, []);


  const redirectToDashboard = async (userId) => {
    console.log("Redirecting to dashboard, userId:", userId);
    try {
      // First, check if the user exists in the "companies" collection
      let userDoc = await getDoc(doc(firestore, "companies", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data(); // Log the document data
        console.log("Company User Data:", userData);
        const userType = userData.userType;
        if (userType === "company") {
          router.push("/Company");
        }
      } else {
        // If not found in companies, check the "workers" collection
        userDoc = await getDoc(doc(firestore, "workers", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Worker User Data:", userData);
          router.push("/Worker");
        } else {
          console.log("User document not found in both collections.");
          setError("User not found.");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data.");
    }
  };


  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user);
      redirectToDashboard(user.uid);
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/images/splash-icon.png")} />
      <Text style={styles.title}>Welcome Back!</Text>


      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />


      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />


      {error ? <Text style={styles.errorText}>{error}</Text> : null}


      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>


      <Link href="/">
        <Text style={styles.loginText}>Don't have an account? Sign up</Text>
      </Link>
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
    color: "#000",
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


export default LoginScreen;



