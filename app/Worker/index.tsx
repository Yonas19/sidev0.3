import React, { useState, useEffect } from "react";
import { View, Text, Animated, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { push } from "expo-router/build/global-state/routing";
import { router, useNavigation } from "expo-router";
import { db } from "../../FireBaseConfig"; // Import the Firestore instance
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions


const { width, height } = Dimensions.get("window");


const JobListing = () => {
  const navigation = useNavigation();  // Initialize navigation


  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Most Viewed");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-width * 0.6))[0];
  const bottomAnim = useState(new Animated.Value(-height * 0.5))[0]; // New animation for bottom bar
  const [bottombarVisible, setBottombarVisible] = useState(false);
  const [salaryRange, setSalaryRange] = useState(50); // Default to 50 AED/hr
  const [selectedTitle, setSelectedTitle] = useState("");
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);


interface Job {
  id: string;
  jobTitle: string;
  location: string;
  salary: string;
  schedule: { day: string; date: string; time: string }[];
  postdate: string;
}


const [jobs, setJobs] = useState<Job[]>([]); // State to hold job listings




  useEffect(() => {
    const fetchJobs = async () => {
      const jobCollection = collection(db, "jobListings"); // Reference to the jobListings collection
      const jobSnapshot = await getDocs(jobCollection); // Fetch documents
const jobList = jobSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job)); // Map to job objects


      setJobs(jobList); // Update state with fetched jobs
    };


    fetchJobs(); // Call the fetch function
  }, []); // Empty dependency array to run once on mount


  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? -width * 0.6 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };


  const toggleBottombar = () => {
    Animated.timing(bottomAnim, {
      toValue: bottombarVisible ? -height * 0.5 : 0, // Moves it up or down
      duration: 300,
      useNativeDriver: false,
    }).start();
    setBottombarVisible(!bottombarVisible);
  };


  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job =>
    (job.title.toLowerCase().includes(search.toLowerCase()) ||
     job.location.toLowerCase().includes(search.toLowerCase())) &&
    parseInt(job.salary.replace(/\D/g, "")) <= salaryRange
    && (selectedTitle ? job.title === selectedTitle : true)
    && (selectedLocation ? job.location === selectedLocation : true)
  );


  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
          <Ionicons name="close" size={35} color="#112752" />
        </TouchableOpacity>
        <Image style={styles.image} source={require("../../assets/images/side-logo.png")} />
       
        <Text style={styles.sidebarItem}>Saved Jobs</Text>
        <Text style={styles.sidebarItem}>About Us</Text>
        <Text style={styles.sidebarItem}>Privacy & Policy</Text>
        <Text style={styles.sidebarItem}>Contact Us</Text>
        <TouchableOpacity
          style={styles.sidebarlogout}
          onPress={() => router.replace("/Login")} // Navigate to login
        >
          <Text style={styles.sidebarlogouttext}>Logout </Text>
          <Ionicons name="log-out-outline" size={25} color="#112752" />
        </TouchableOpacity>
      </Animated.View>


      <Animated.View style={[styles.bottombar, { bottom: bottomAnim }]}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleBottombar}>
          <Ionicons name="close" size={30} color="#09b9e6" />
        </TouchableOpacity>
       
        <View style={styles.Designation}>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowDesignationDropdown(!showDesignationDropdown)}>
            <Text style={styles.dropdownButtonText}>{selectedTitle || "Select Designation"}</Text>
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </TouchableOpacity>


          {showDesignationDropdown && (
            <View style={styles.dropdownMenu}>
              {Array.from(new Set(jobs.map(job => job.title))).map((title, index) => (
                <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => {
                  setSelectedTitle(title);
                  setShowLocationDropdown(false);
                }}>
                  <Text style={styles.dropdownItemText}>{title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowLocationDropdown(!showLocationDropdown)}>
            <Text style={styles.dropdownButtonText}>{selectedLocation || "Select Location"}</Text>
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </TouchableOpacity>


          {showLocationDropdown && (
            <View style={styles.dropdownMenu}>
              {Array.from(new Set(jobs.map(job => job.location))).map((location, index) => (
                <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => {
                  setSelectedLocation(location);
                  setShowLocationDropdown(false);
                }}>
                  <Text style={styles.dropdownItemText}>{location}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <Text style={styles.salaryLabel}>Salary Range: AED {salaryRange}/hr</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={20}
          maximumValue={50}
          step={5}
          value={salaryRange}
          onValueChange={(value) => setSalaryRange(value)}
          minimumTrackTintColor="#09b9e6"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#09b9e6"
        />
      </Animated.View>


      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Ionicons name="menu" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <Ionicons name="notifications-outline" size={24} />
      </View>


      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search places"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={toggleBottombar}>
          <Ionicons name="options-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>


      <View style={styles.filterContainer}>
        {["Most Viewed", "Nearby", "Latest"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive, { width: width * 0.3 }]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={activeFilter === filter ? styles.filterTextActive : styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>


      <ScrollView>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((item, index) => (
            <View key={index} style={styles.jobDetailCard}>
              <TouchableOpacity style={styles.saveButton}>
                <Ionicons name="bookmark-outline" size={24} color="#161b5a" />
              </TouchableOpacity>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobLocation}>{item.location}</Text>
              <View style={styles.scheduleContainer}>
                {item.schedule.map((schedule, i) => (
                  <View key={i} style={styles.jobInfoRow}>
                    <Text style={styles.daycard}>{schedule.day}</Text>
                    <Text style={styles.datecard}>{schedule.date}</Text>
                    <Text style={styles.tmecard}>{schedule.time}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.salaryPostDateContainer}>
                <Text style={styles.jobInfo}>{item.salary}</Text>
                <Text style={styles.postInfo}>Posted {item.postdate}</Text>
              </View>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noResultsText}>No jobs found</Text>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    marginTop: 45,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sidebar: {
    position: "absolute",
    top: 60,
    left: -width * 0.8,
    width: width * 0.6,
    height: "100%",
    backgroundColor: "#dadcdd",
    padding: 20,
    paddingTop: 60,
    borderTopRightRadius: 20,
    zIndex: 1500,
  },
  image: {
    width: "50%",
    height: 40,
    marginBottom: 50
  },
  sidebarItem: {
    color: "#0e0b0b",
    fontSize: 18,
    marginVertical: 10,
  },
  sidebarlogout: {
    marginTop: 300,
    left: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  sidebarlogouttext: {
    color: "#030202",
    fontSize: 20,
    fontWeight: "bold",
  },
  bottombar: {
    position: "absolute",
    bottom: height - height * 0.5,
    width: 380,
    left: 4,
    height: height * 0.5,  // 40% of screen height
    backgroundColor: "#2c5985",
    padding: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1500,
  },
  bottombarItem: {
    color: "#0f0c0c",
    fontSize: 18,
    marginVertical: 10,
  },
  Designation: {
    flexDirection: "column",
  },
  dropdownButton: {
    backgroundColor: "#09b9e6",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 70,
    width: "50%",
  },
  dropdownButtonText: {
    color: "white",
    fontSize: 16,
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    position: "absolute",
    width: "50%",
    top: 130,
    zIndex: 2000,
    elevation: 5,
    left: 20,
  },
  dropdownItem: {
    paddingVertical: 8,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "black",
  },
  salaryLabel: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    color: "#3ddada",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  filterButton: {
    height: 35,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  jobInfo: {
    color: "black",
    fontSize: 14,
  },
  filterButtonActive: {
    backgroundColor: "rgba(19, 65, 105, 1)",
  },
  filterText: {
    color: "black",
    fontSize: 14,
  },
  filterTextActive: {
    color: "white",
    fontSize: 14,
  },
  scheduleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  jobDetailCard: {
    backgroundColor: "#ececec",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 5,
    width: width * 0.9,
    alignSelf: "center",
  },
  saveButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  jobLocation: {
    color: "gray",
    marginVertical: 5,
  },
  jobInfoRow: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#dddde2",
    borderRadius: 8,
    padding: 5,
    marginBottom: 5,
    width: 90,
  },
  salaryPostDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  applyButton: {
    marginTop: 10,
    backgroundColor: "rgba(19, 65, 105, 1)",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  postInfo: {
    color: "gray",
    fontSize: 12,
  },
  datecard: {
    color: "black",
    fontSize: 14,
    alignSelf: "center",
  },
  tmecard: {
    color: "#7a7373",
    fontSize: 10,
    alignSelf: "center",
    width: 50,
  },
  daycard: {
    color: "#7a7373",
    fontSize: 15,
    alignSelf: "center",
  },
});


export default JobListing;



