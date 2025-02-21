import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { getApiUrl } from "../api";
import RichTextEditor from "../components/RichTextEditor";

export default function PageScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { pageId } = route.params;

  const [page, setPage] = useState(null);
  const [pageTitle, setPageTitle] = useState("New page");
  const [folder, setFolder] = useState("Private");
  const [loading, setLoading] = useState(true);
  const [contentBlock, setContentBlock] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const debounceTimeout = useRef(null);
  const contentBlockRef = useRef(null);
  const isSavingContent = useRef(false);

  useEffect(() => {
    contentBlockRef.current = contentBlock;
  }, [contentBlock]);

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  // Listen for keyboard events on mobile.
  useEffect(() => {
    if (Platform.OS !== "web") {
      const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsEditing(true);
      });
      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardHeight(0);
        setIsEditing(false);
      });
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }
  }, []);

  const fetchPage = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Token is missing");
      const response = await fetch(`${getApiUrl()}/pages/page/${pageId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Error fetching page: ${response.status}`);
      const data = await response.json();
      setPage(data);
      setPageTitle(data.title || "New page");
      if (data.pages && data.pages.length > 0) {
        setContentBlock(data.pages[0]);
      } else {
        setContentBlock({ _id: "new", content: "" });
      }
      setFolder(
        data.source === "otherpages"
          ? "Private"
          : data.source === "favorites"
          ? "Favorites"
          : "Unknown"
      );
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveTitle = async (newTitle) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token is missing");
        const response = await fetch(`${getApiUrl()}/pages/page/${pageId}`, {
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
    }, 500);
  };

  const handleRichTextSave = async (serializedData) => {
    if (isSavingContent.current) return;
    isSavingContent.current = true;
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Token is missing");
      const currentBlock = contentBlockRef.current;
      if (!currentBlock) return;
      if (currentBlock._id === "new") {
        const createResponse = await fetch(`${getApiUrl()}/pages/block`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageId,
            type: "text",
            content: serializedData,
            position: 0,
          }),
        });
        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(
            `Error creating block: ${createResponse.status}, Message: ${errorData.message}`
          );
        }
        const newBlock = await createResponse.json();
        setContentBlock(newBlock);
        contentBlockRef.current = newBlock;
        console.log("Block created successfully", newBlock);
      } else {
        const updateResponse = await fetch(`${getApiUrl()}/pages/block/${currentBlock._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: serializedData }),
        });
        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(
            `Error updating block: ${updateResponse.status}, Message: ${errorData.message}`
          );
        }
        const updatedBlock = await updateResponse.json();
        setContentBlock(updatedBlock);
        contentBlockRef.current = updatedBlock;
        console.log("Block content updated successfully", updatedBlock);
      }
    } catch (error) {
      console.error("Error saving block content:", error.message);
    } finally {
      isSavingContent.current = false;
    }
  };

  const handleTitleChange = (newTitle) => {
    setPageTitle(newTitle);
    saveTitle(newTitle);
  };

  const closePage = () => {
    navigation.goBack();
  };

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimeout.current);
      if (contentBlockRef.current && contentBlockRef.current.content) {
        handleRichTextSave(contentBlockRef.current.content);
      }
    };
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.pageContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.folderWrapper}>
            <View style={styles.folderContainer}>
              <Ionicons name="folder-outline" size={24} color={colors.text} />
            </View>
            <Text style={styles.folderName}>{folder}</Text>
          </View>
          <TouchableOpacity onPress={closePage}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <ActionButton icon="happy-outline" label="Add icon" />
          <ActionButton icon="image-outline" label="Add cover" />
          <ActionButton icon="chatbubble-outline" label="Add comment" />
        </View>

        {/* Page Title */}
        <TextInput
          style={styles.pageTitle}
          value={pageTitle}
          onChangeText={handleTitleChange}
          placeholderTextColor={colors.textSecondary}
        />

        {/* Editor / Preview */}
        {Platform.OS !== "web" ? (
          isEditing ? (
            <RichTextEditor
              onSave={handleRichTextSave}
              initialContent={contentBlock.content}
              keyboardHeight={keyboardHeight}
              editable={true}
            />
          ) : (
            <TouchableOpacity
              style={styles.preview}
              onPress={() => setIsEditing(true)}
            >
              <RichTextEditor
                onSave={handleRichTextSave}
                initialContent={contentBlock.content}
                editable={false}
              />
            </TouchableOpacity>
          )
        ) : (
          <RichTextEditor
            onSave={handleRichTextSave}
            initialContent={contentBlock.content}
            keyboardHeight={keyboardHeight}
            editable={true}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const ActionButton = ({ icon, label }) => (
  <TouchableOpacity style={styles.actionButton}>
    <Ionicons name={icon} size={20} color={colors.textSecondary} />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

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
  preview: {
    flex: 1,
    backgroundColor: "#191919",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});