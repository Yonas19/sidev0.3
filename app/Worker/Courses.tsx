import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { AntDesign, MaterialIcons, FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [courseContent, setCourseContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [sections, setSections] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);

  const options = [
    "WhatsApp Automation",
    "Facebook Ads",
    "Graphics design",
    "Web Development",
    "Other",
  ];

  useEffect(() => {
    const generateCourse = async () => {
      if (step === 2 && selectedOption) {
        setLoading(true);
        try {
          // First, generate the course structure
          const structureResponse = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer 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",
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-pro-exp-03-25:free",
                messages: [
                  {
                    role: "user",
                    content: `Create a course structure for "${selectedOption}" with 5-7 engaging sections. For each section, provide:
                    1) A creative and engaging title
                    2) A brief description of what will be covered
                    3) Estimated duration
                    4) Key learning outcomes
                    
                    Format the response as a JSON array of objects with these properties:
                    - title
                    - description
                    - duration
                    - outcomes
                    
                    Make the titles engaging and the descriptions detailed.
                    
                    Example format:
                    [
                      {
                        "title": "Introduction to Topic",
                        "description": "Learn the basics and get started",
                        "duration": "30 minutes",
                        "outcomes": ["Understand fundamentals", "Set up environment"]
                      }
                    ]`,
                  },
                ],
              }),
            }
          );

          const structureData = await structureResponse.json();
          console.log("Raw structure response:", structureData.choices?.[0]?.message?.content);
          
          let structure;
          try {
            const content = structureData.choices?.[0]?.message?.content;
            // Clean the response to ensure it's valid JSON
            const cleanedContent = content
              .replace(/```json\n?/g, '')
              .replace(/```\n?/g, '')
              .trim();
            structure = JSON.parse(cleanedContent);
          } catch (parseError) {
            console.error("Failed to parse structure:", parseError);
            // If parsing fails, create a default structure
            structure = [
              {
                title: "Introduction to " + selectedOption,
                description: "Get started with the basics of " + selectedOption,
                duration: "30 minutes",
                outcomes: ["Understand the fundamentals", "Set up your environment"]
              },
              {
                title: "Core Concepts",
                description: "Learn the essential principles of " + selectedOption,
                duration: "45 minutes",
                outcomes: ["Master key concepts", "Apply basic techniques"]
              },
              {
                title: "Advanced Techniques",
                description: "Dive deeper into " + selectedOption,
                duration: "60 minutes",
                outcomes: ["Learn advanced methods", "Solve complex problems"]
              },
              {
                title: "Practical Applications",
                description: "Apply your knowledge of " + selectedOption,
                duration: "45 minutes",
                outcomes: ["Build real projects", "Solve real-world problems"]
              },
              {
                title: "Final Project",
                description: "Put your " + selectedOption + " skills to work",
                duration: "90 minutes",
                outcomes: ["Complete a full project", "Showcase your skills"]
              }
            ];
          }
          
          // Validate the structure
          if (!Array.isArray(structure) || structure.length === 0) {
            console.warn("Invalid structure received, using default structure");
            structure = [
              {
                title: "Introduction to " + selectedOption,
                description: "Get started with the basics of " + selectedOption,
                duration: "30 minutes",
                outcomes: ["Understand the fundamentals", "Set up your environment"]
              },
              {
                title: "Core Concepts",
                description: "Learn the essential principles of " + selectedOption,
                duration: "45 minutes",
                outcomes: ["Master key concepts", "Apply basic techniques"]
              },
              {
                title: "Advanced Techniques",
                description: "Dive deeper into " + selectedOption,
                duration: "60 minutes",
                outcomes: ["Learn advanced methods", "Solve complex problems"]
              }
            ];
          }
          
          // Ensure each section has all required properties
          structure = structure.map(section => ({
            title: section.title || "Untitled Section",
            description: section.description || "No description available",
            duration: section.duration || "Duration not specified",
            outcomes: Array.isArray(section.outcomes) ? section.outcomes : ["Learning outcomes not specified"]
          }));
          
          setSections(structure);

          // Then generate content for the current section
          const contentResponse = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer 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",
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-pro-exp-03-25:free",
                messages: [
                  {
                    role: "user",
                    content: `Create detailed content for the section "${structure[currentSection]?.title || 'Introduction'}" in the "${selectedOption}" course.
                    Include:
                    1) Comprehensive explanation of the topic
                    2) Step-by-step instructions
                    3) Real-world examples
                    4) Interactive exercises
                    5) Quiz questions with answers
                    
                    Format the response in a clear, structured way with markdown-style formatting.`,
                  },
                ],
              }),
            }
          );

          const contentData = await contentResponse.json();
          const content = contentData.choices?.[0]?.message?.content || "No content received.";
          setCourseContent(content);
        } catch (error) {
          console.error("Course generation failed:", error);
          setCourseContent("Error generating course content. Please try again.");
          // Set default sections if generation fails
          setSections([
            {
              title: "Introduction to " + selectedOption,
              description: "Get started with the basics of " + selectedOption,
              duration: "30 minutes",
              outcomes: ["Understand the fundamentals", "Set up your environment"]
            },
            {
              title: "Core Concepts",
              description: "Learn the essential principles of " + selectedOption,
              duration: "45 minutes",
              outcomes: ["Master key concepts", "Apply basic techniques"]
            },
            {
              title: "Advanced Techniques",
              description: "Dive deeper into " + selectedOption,
              duration: "60 minutes",
              outcomes: ["Learn advanced methods", "Solve complex problems"]
            }
          ]);
        } finally {
          setLoading(false);
        }
      }
    };

    generateCourse();
  }, [step, selectedOption, currentSection]);

  const handleSectionComplete = () => {
    setCompletedSections([...completedSections, currentSection]);
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Which of the following courses do you want to take?
        </Text>

        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedOption === option && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(option)}
          >
            <MaterialIcons 
              name={getIconForOption(option)} 
              size={24} 
              color={selectedOption === option ? "#FBA741" : "gray"} 
            />
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.nextButton, !selectedOption && styles.disabledButton]}
          onPress={() => selectedOption && setStep(2)}
          disabled={!selectedOption}
        >
          <Text style={styles.buttonText}>Start Learning</Text>
          <AntDesign name="arrowright" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.courseContainer}>
      <View style={styles.header}>
        <Text style={styles.courseTitle}>{selectedOption}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Section {currentSection + 1} of {sections.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentSection + 1) / sections.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <View style={styles.sectionList}>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.sectionButton,
              currentSection === index && styles.activeSection,
              completedSections.includes(index) && styles.completedSection,
            ]}
            onPress={() => setCurrentSection(index)}
          >
            <View style={styles.sectionInfo}>
              <Text style={styles.sectionNumber}>{index + 1}</Text>
              <View style={styles.sectionTextContainer}>
                <Text style={styles.sectionButtonText}>{section.title}</Text>
                <Text style={styles.sectionDuration}>{section.duration}</Text>
              </View>
            </View>
            {completedSections.includes(index) ? (
              <AntDesign name="checkcircle" size={20} color="#4CAF50" />
            ) : (
              <AntDesign name="right" size={20} color="#666" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#134169" style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {sections[currentSection]?.title || "Loading..."}
              </Text>
              <View style={styles.sectionMeta}>
                <View style={styles.metaItem}>
                  <MaterialIcons name="timer" size={16} color="#666" />
                  <Text style={styles.metaText}>
                    {sections[currentSection]?.duration || "Duration not specified"}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <FontAwesome name="graduation-cap" size={16} color="#666" />
                  <Text style={styles.metaText}>
                    {completedSections.length} of {sections.length} completed
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.learningOutcomes}>
              <Text style={styles.outcomesTitle}>What You'll Learn</Text>
              {sections[currentSection]?.outcomes?.map((outcome, index) => (
                <View key={index} style={styles.outcomeItem}>
                  <AntDesign name="checkcircle" size={16} color="#4CAF50" />
                  <Text style={styles.outcomeText}>{outcome}</Text>
                </View>
              )) || (
                <View style={styles.outcomeItem}>
                  <AntDesign name="checkcircle" size={16} color="#4CAF50" />
                  <Text style={styles.outcomeText}>Loading learning outcomes...</Text>
                </View>
              )}
            </View>

            <View style={styles.contentBox}>
              <Text style={styles.contentText}>
                {courseContent || "Loading content..."}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentSection === 0 && styles.disabledButton]}
          onPress={() => setCurrentSection(currentSection - 1)}
          disabled={currentSection === 0}
        >
          <AntDesign name="arrowleft" size={18} color="white" />
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleSectionComplete}
        >
          <Text style={styles.buttonText}>
            {currentSection === sections.length - 1 ? "Finish Course" : "Complete Section"}
          </Text>
          <AntDesign name="arrowright" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setStep(1);
          setSelectedOption(null);
          setCourseContent(null);
          setCurrentSection(0);
          setCompletedSections([]);
          setSections([]);
        }}
      >
        <AntDesign name="arrowleft" size={18} color="white" />
        <Text style={styles.buttonText}>Back to Courses</Text>
      </TouchableOpacity>
    </View>
  );
}

const getIconForOption = (option) => {
  switch (option) {
    case "WhatsApp Automation":
      return "chat";
    case "Facebook Ads":
      return "facebook";
    case "Graphics design":
      return "palette";
    case "Web Development":
      return "code";
    default:
      return "school";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF9FF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
  },
  option: {
    width: "90%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: "#FBA741",
    backgroundColor: "#FFF9F0",
  },
  optionText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 15,
    flex: 1,
  },
  selectedOptionText: {
    color: "#FBA741",
    fontWeight: "600",
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: "#134169",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#D8C8F5",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 10,
  },
  courseContainer: {
    flex: 1,
    backgroundColor: "#F4F4FC",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  sectionList: {
    padding: 10,
    backgroundColor: "#fff",
  },
  sectionButton: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sectionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  sectionDuration: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  activeSection: {
    backgroundColor: "#ECEAFF",
    borderLeftWidth: 4,
    borderLeftColor: "#5A4FCF",
  },
  completedSection: {
    backgroundColor: "#E8F5E9",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  sectionMeta: {
    flexDirection: "row",
    marginTop: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  learningOutcomes: {
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  outcomesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  outcomeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  outcomeText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 10,
    flex: 1,
  },
  contentBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  contentText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navButton: {
    backgroundColor: "#134169",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    margin: 20,
    backgroundColor: "#134169",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
});