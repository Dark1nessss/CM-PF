import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { getApiUrl } from "../api";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

export default function PageScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { pageId } = route.params;

  const [page, setPage] = useState(null);
  const [pageTitle, setPageTitle] = useState("New page");
  const [folder, setFolder] = useState("Private");
  const [loading, setLoading] = useState(true);
  const [contentBlock, setContentBlock] = useState(null);
  const [inputHeight, setInputHeight] = useState(40);
  // The editor is always visible in this implementation.
  const richText = useRef();
  const debounceTimeout = useRef(null);
  const contentBlockRef = useRef(null);

  useEffect(() => {
    contentBlockRef.current = contentBlock;
  }, [contentBlock]);

  useEffect(() => {
    fetchPage();
  }, [pageId]);

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
    }, 1000);
  };

  const saveContent = async (newText) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
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
              content: newText,
              position: 0,
            }),
          });
          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(`Error creating block: ${createResponse.status}, Message: ${errorData.message}`);
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
            body: JSON.stringify({ content: newText }),
          });
          if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Error updating block: ${updateResponse.status}, Message: ${errorData.message}`);
          }
          console.log("Block content updated successfully");
        }
      } catch (error) {
        console.error("Error saving block content:", error.message);
      }
    }, 1000);
  };

  const handleTitleChange = (newTitle) => {
    setPageTitle(newTitle);
    saveTitle(newTitle);
  };

  const handleContentChange = (html) => {
    setContentBlock((prev) => ({ ...prev, content: html }));
    saveContent(html);
  };

  const closePage = () => {
    navigation.goBack();
  };

  // Helper to strip HTML tags for preview (if needed).
  const stripHTML = (html) => {
    return html ? html.replace(/<[^>]+>/g, "") : "";
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
    );
  }

  // Define toolbar actions as a literal array of strings.
  const toolbarActions = [
    "bold",
    "italic",
    "underline",
    "heading1",
    "insertBulletsList",
    "insertOrderedList",
    "insertLink",
  ];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
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

        {/* Rich Editor */}
        <View style={styles.editorContainer}>
          <RichEditor
            ref={richText}
            initialContentHTML={contentBlock && contentBlock.content ? contentBlock.content : ""}
            editorStyle={{
              backgroundColor: "transparent",
              color: colors.textSecondary,
              placeholderColor: colors.textSecondary,
            }}
            style={styles.richEditor}
            onChange={handleContentChange}
            useContainer={true}
            onCursorPosition={(cursorActions) => {
              // Optionally, adjust scroll if needed.
              console.log("Cursor position actions:", cursorActions);
            }}
          />
        </View>

        {/* Sticky Toolbar */}
        <View style={styles.stickyToolbarContainer}>
          <RichToolbar
            editor={richText}
            actions={toolbarActions}
            iconTint={colors.textSecondary}
            selectedIconTint={colors.primary}
            selectedButtonStyle={{ backgroundColor: "transparent" }}
            style={styles.richToolbar}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
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
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  pageTitle: {
    fontSize: 32,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontWeight: "400",
  },
  editorContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  richEditor: {
    flex: 1,
    minHeight: 200,
    backgroundColor: "transparent",
  },
  stickyToolbarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#252525",
  },
  richToolbar: {
    borderTopWidth: 1,
    borderColor: colors.textSecondary,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});