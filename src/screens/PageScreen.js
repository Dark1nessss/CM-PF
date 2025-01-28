import React, { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "../theme/colors"

export default function PageScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { pageId, folder } = route.params
  const [page, setPage] = useState(null)
  const [pageTitle, setPageTitle] = useState("New page")
  const [loading, setLoading] = useState(true)
  const debounceTimeout = useRef(null)

  useEffect(() => {
    const fetchPage = async () => {
      const token = await AsyncStorage.getItem("authToken")
      if (!token) {
        console.error("Token is missing")
        setLoading(false)
        return
      }

      const response = await fetch(`http://localhost:5000/pages/page/${pageId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPage(data)
        setPageTitle(data.title || "New page")
      } else {
        console.error("Error fetching page:", response.status)
      }
      setLoading(false)
    }

    fetchPage()
  }, [pageId])

  // Save title after 1s period
  const saveTitle = async (newTitle) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Token is missing");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/pages/page/${pageId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error: ${response.status}, Message: ${errorData.message}`);
        }
  
        console.log("Page title updated successfully");
      } catch (error) {
        console.error("Error saving title:", error.message);
      }
    }, 1000);
  };

  const handleTitleChange = (newTitle) => {
    setPageTitle(newTitle)
    saveTitle(newTitle)
  }

  const closePage = () => {
    navigation.goBack()
  }

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.pageContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.folderWrapper}>
            <View style={styles.folderContainer}>
              <Ionicons name="folder-outline" size={24} color={colors.text} />
            </View>
            <Text style={styles.folderName}>{folder || "Private"}</Text>
          </View>
          <TouchableOpacity onPress={closePage}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="happy-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>Add icon</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="image-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>Add cover</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>Add comment</Text>
          </TouchableOpacity>
        </View>

        {/* Page Title */}
        <TextInput
          style={styles.pageTitle}
          value={pageTitle}
          onChangeText={handleTitleChange}
          placeholderTextColor={colors.textSecondary}
        />

        {/* Placeholder Text */}
        <Text style={styles.placeholderText}>Tap here to continue...</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191919",
  },
  pageContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  folderWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  folderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252525",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  folderName: {
    fontSize: 16,
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 32,
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  pageTitle: {
    fontSize: 32,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontWeight: "400",
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})