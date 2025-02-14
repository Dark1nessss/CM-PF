import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView as RNWebView } from 'react-native-webview';

// Fallback for web using an iframe with srcDoc.
const WebViewFallback = ({ source, onLoad, style }) => {
  return (
    <iframe
      title="Rich Text Editor"
      srcDoc={source.html}
      style={style}
      onLoad={onLoad}
    />
  );
};

const WebViewComponent = Platform.OS === 'web' ? WebViewFallback : RNWebView;

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    /* Base styling to mimic Notion */
    body {
      margin: 0;
      padding: 0;
      background-color: #191919;
      color: #D3D3D3;
      font-size: 16px;
      line-height: 1.5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      overflow-y: scroll;
    }
    /* Editor area styling */
    #editor {
      padding: 10px;
      /* We don't add extra bottom padding here because we adjust it from native */
      min-height: calc(100vh - 60px);
      outline: none;
    }
    /* Each line becomes its own block */
    #editor div {
      margin: 0;
    }
    /* Placeholder styling */
    #editor:empty:before {
      content: 'start typing here...';
      color: #aaa;
    }
    /* Toolbar styling: fixed at bottom */
    #toolbar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #2a2a2a;
      border-top: 1px solid #444;
      padding: 8px;
      display: flex;
      justify-content: center;
    }
    #toolbar button {
      background: none;
      border: none;
      color: #D3D3D3;
      font-size: 16px;
      margin: 0 8px;
      cursor: pointer;
    }
    #toolbar button.active {
      color: #007AFF;
    }
  </style>
</head>
<body>
  <div id="editor" contenteditable="true"></div>
  <div id="toolbar">
    <button id="boldBtn" onclick="format('bold')"><b>B</b></button>
    <button id="italicBtn" onclick="format('italic')"><i>I</i></button>
    <button id="underlineBtn" onclick="format('underline')"><u>U</u></button>
    <button id="quoteBtn" onclick="format('quote')">"</button>
  </div>
  <script>
    const editor = document.getElementById('editor');
    const toolbar = document.getElementById('toolbar');
    let debounceTimer = null;
    
    // Debounce function: wait 500ms after user stops typing.
    function triggerAutosave() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        sendContent();
      }, 500);
    }
    
    // When Enter is pressed, insert a new block.
    editor.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.execCommand('insertHTML', false, '<div><br></div>');
      }
    });
    
    // Formatting function with improved quote handling.
    function format(command) {
      if (command === 'quote') {
        let inQuote = false;
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          let node = selection.getRangeAt(0).commonAncestorContainer;
          while (node && node !== editor) {
            if (node.nodeName.toLowerCase() === 'blockquote') {
              inQuote = true;
              break;
            }
            node = node.parentNode;
          }
        }
        if (inQuote) {
          document.execCommand('formatBlock', false, 'div');
        } else {
          document.execCommand('formatBlock', false, 'blockquote');
        }
      } else {
        document.execCommand(command, false, null);
      }
      updateToolbar();
      editor.focus();
      triggerAutosave();
    }
    
    // Update toolbar active states.
    function updateToolbar() {
      toolbar.querySelector('#boldBtn').classList.toggle('active', document.queryCommandState('bold'));
      toolbar.querySelector('#italicBtn').classList.toggle('active', document.queryCommandState('italic'));
      toolbar.querySelector('#underlineBtn').classList.toggle('active', document.queryCommandState('underline'));
      
      let isQuote = false;
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let node = selection.getRangeAt(0).commonAncestorContainer;
        while (node && node !== editor) {
          if (node.nodeName.toLowerCase() === 'blockquote') {
            isQuote = true;
            break;
          }
          node = node.parentNode;
        }
      }
      toolbar.querySelector('#quoteBtn').classList.toggle('active', isQuote);
    }
    
    // Send current content.
    function sendContent() {
      const msg = JSON.stringify({ content: editor.innerHTML });
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(msg);
      } else if (window.parent) {
        window.parent.postMessage(msg, "*");
      }
    }
    
    // Trigger autosave on input and blur.
    editor.addEventListener('input', function() {
      updateToolbar();
      triggerAutosave();
    });
    editor.addEventListener('blur', function() {
      clearTimeout(debounceTimer);
      sendContent();
    });
    window.addEventListener('beforeunload', sendContent);
    
    // Listen for messages from React Native to set content.
    document.addEventListener('message', function(event) {
      const message = JSON.parse(event.data);
      if (message.command === 'setContent') {
        editor.innerHTML = message.content;
      } else if (message.command === 'setEditable') {
        editor.contentEditable = message.editable;
        if (message.editable) {
          toolbar.style.display = "flex";
        } else {
          toolbar.style.display = "none";
        }
      }
    });
    
    // On load, if empty, insert a starting block.
    window.onload = function() {
      if (editor.innerHTML.trim() === '') {
        editor.innerHTML = '<div></div>';
      }
      editor.focus();
      updateToolbar();
    };
  </script>
</body>
</html>
`;

const RichTextEditor = ({ onSave, initialContent = '', keyboardHeight = 0, editable = true }) => {
  const webviewRef = useRef(null);
  
  const onWebViewLoad = useCallback(() => {
    if (initialContent && Platform.OS !== 'web') {
      const message = JSON.stringify({ command: 'setContent', content: initialContent });
      if (webviewRef.current && webviewRef.current.postMessage) {
        webviewRef.current.postMessage(message);
      }
    }
    // Send the editable state.
    const setEditableMsg = JSON.stringify({ command: 'setEditable', editable });
    if (webviewRef.current && webviewRef.current.postMessage) {
      webviewRef.current.postMessage(setEditableMsg);
    }
  }, [initialContent, editable]);
  
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.content && onSave) {
        onSave(data.content);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    if (Platform.OS === 'web') {
      function messageHandler(event) {
        try {
          const data = JSON.parse(event.data);
          if (data.content && onSave) {
            onSave(data.content);
          }
        } catch (err) {
          // ignore parsing errors
        }
      }
      window.addEventListener('message', messageHandler);
      return () => window.removeEventListener('message', messageHandler);
    }
  }, [onSave]);
  
  return (
    // Adjust container style to add a bottom margin equal to keyboardHeight.
    <View style={[styles.container, { marginBottom: keyboardHeight }]}>
      <WebViewComponent
        ref={Platform.OS !== 'web' ? webviewRef : null}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={Platform.OS !== 'web' ? handleMessage : undefined}
        onLoad={onWebViewLoad}
        javaScriptEnabled
        domStorageEnabled
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  webview: { flex: 1, backgroundColor: "transparent" },
});

export default RichTextEditor;