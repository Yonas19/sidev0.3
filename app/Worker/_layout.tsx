import { Tabs } from "expo-router/tabs";
import { Ionicons } from "@expo/vector-icons";




export default function WorkerLayout() {
  return (
    <Tabs  screenOptions={{headerShown: false}}>
       
      <Tabs.Screen
        name="index"
        options={{
        title: "",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Courses"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}









