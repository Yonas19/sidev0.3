import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [courseContent, setCourseContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);

  const options = [
    "WhatsApp Automation",
    "Facebook Ads",
    "Graphics design",
    "Web Development",
    "Other",
  ];

  const sections = [
    "Introduction",
    "Deep Dive into the Topic",
    "How to Make Money with It",
    "Final Project",
    "Summary and Next Steps"
  ];

  useEffect(() => {
    const generateCourse = async () => {
      if (step === 2 && selectedOption) {
        setLoading(true);
        try {
          const response = await fetch(
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
                    content: `Create a complete course on "${selectedOption}" with the following sections:
                    1) Introduction - Overview and basics
                    2) Deep Dive into the Topic - Detailed concepts and techniques
                    3) How to Make Money with It - Monetization strategies
                    4) Final Project - Practical application
                    5) Summary and Next Steps - Review and future learning
                    
                    For each section, provide:
                    - Detailed content
                    - Key points
                    - Practical examples
                    - Quiz questions
                    
                    Format the response in a clear, structured way.`,
                  },
                ],
              }),
            }
          );

          const data = await response.json();
          const message = data.choices?.[0]?.message?.content || "No course content received.";
          setCourseContent(message);
        } catch (error) {
          console.error("Course generation failed:", error);
          setCourseContent("Error generating course content.");
        } finally {
          setLoading(false);
        }
      }
    };

    generateCourse();
  }, [step, selectedOption]);

  const parsedSections = courseContent?.split(/\n(?=\d\)|Section)/i).map((section) => {
    const lines = section.trim().split("\n");
    const title = lines[0].replace(/^\d\)|-/, "").trim();
    const content = lines.slice(1).join("\n");
    return {
      title,
      content,
    };
  }) || [];

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
          <Text style={styles.buttonText}>Next</Text>
          <AntDesign name="arrowright" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.courseContainer}>
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
            <Text style={styles.sectionButtonText}>{section}</Text>
            {completedSections.includes(index) && (
              <AntDesign name="checkcircle" size={16} color="#4CAF50" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#134169" style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{sections[currentSection]}</Text>
            <Text style={styles.sectionText}>
              {parsedSections[currentSection]?.content || "Loading content..."}
            </Text>
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
        }}
      >
        <AntDesign name="arrowleft" size={18} color="white" />
        <Text style={styles.buttonText}>Back to Courses</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF9FF",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "grey",
    marginBottom: 20,
  },
  option: {
    width: "90%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 0.6,
    borderColor: "gray",
  },
  selectedOption: {
    borderColor: "#FBA741",
  },
  optionText: {
    fontSize: 16,
    color: "gray",
  },
  selectedOptionText: {
    fontWeight: "bold",
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: "#134169",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  disabledButton: {
    backgroundColor: "#D8C8F5",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  courseContainer: {
    flex: 1,
    backgroundColor: "#F4F4FC",
  },
  sectionList: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
  activeSection: {
    backgroundColor: "#ECEAFF",
    borderLeftWidth: 4,
    borderLeftColor: "#5A4FCF",
  },
  completedSection: {
    backgroundColor: "#E8F5E9",
  },
  sectionButtonText: {
    fontSize: 16,
    color: "#333",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  sectionContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  sectionText: {
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