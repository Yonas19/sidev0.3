import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../FireBaseConfig";


const timeAgo = (dateString: string) => {
  if (!dateString) return "N/A";


  const postDate = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);


  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  if (diffInSeconds < 30 * 86400) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 365 * 86400) return `${Math.floor(diffInSeconds / (30 * 86400))} months ago`;


  return `${Math.floor(diffInSeconds / (365 * 86400))} years ago`;
};


export default function JobListings() {
  interface Job {
    postingDate: string; // New field


    id: string;
    jobTitle: string;
    jobType: string;
    industry: string;
    workDays?: string[];
    location: string;
    deadline: string;
   
  }


  const [jobs, setJobs] = useState<Job[]>([]);


  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobListings"));
        console.log("Fetched docs:", querySnapshot.docs);
        querySnapshot.docs.forEach(doc => {
          console.log("Job data:", doc.data());
        });


        const jobList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            postingDate: data.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : data.createdAt, // Convert Firestore Timestamp to Date
            ...data,
          } as Job;
        });
       




        setJobs(jobList);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    };


    fetchJobs();
  }, []);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <FlatList
      data={jobs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
          <Text style={styles.details}>Type: {item.jobType}</Text>
          <Text style={styles.details}>Industry: {item.industry}</Text>
          <Text style={styles.details}>Work Days: {item.workDays?.join(", ") || "N/A"}</Text>
          <Text style={styles.details}>Location: {item.location}</Text>
          <Text style={styles.details}>
            Posting Date: {item.postingDate ? timeAgo(item.postingDate) : "N/A"}
          </Text>


          <Text style={styles.details}>Deadline: {item.deadline}</Text>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.buttonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  applyButton: {
    marginTop: 10,
    backgroundColor: "#134169",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});



