// src/components/GeminiChat.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateTextAsync,
  clearGeneratedText,
} from "@/redux/features/gemini/geminiSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useProfile } from "@/hooks/useProfile";

// MUI Imports
import {Box, IconButton, TextField,Button, AppBar, Toolbar, Typography, MenuItem, FormControl, InputLabel, Paper, CircularProgress, Alert,   } from "@mui/material";

import Select, { SelectChangeEvent } from "@mui/material/Select";

import {Send, DeleteSweep} from "@mui/icons-material"; 

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const GeminiChat: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { profile } = useProfile();

  const dispatch = useDispatch<AppDispatch>();
  const { generatedText, loading, error } = useSelector(
    (state: RootState) => state.gemini
  );

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Memoize addMessageToChat to prevent unnecessary re-renders triggered by useEffect
  const addMessageToChat = useCallback((text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, newMessage]);
  }, []); // No dependencies, safe to memoize

  // Add AI response to chat when generated
  useEffect(() => {
    if (
      generatedText &&
      !loading &&
      chatHistory[chatHistory.length - 1]?.isUser
    ) {
      // Add AI response only if the last message was from the user
      addMessageToChat(generatedText, false);
      // Optionally clear generatedText from Redux state if it's meant to be transient
      // dispatch(clearGeneratedText()); // Uncomment if needed
    }
  }, [generatedText, loading, addMessageToChat, chatHistory]); // Add dependencies

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleModelChange = (event: SelectChangeEvent<string>) => {
    setModel(event.target.value as string);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    addMessageToChat(prompt, true);
    dispatch(generateTextAsync({ prompt, model }));
    setPrompt("");
    // Optional: Keep focus after sending
    // inputRef.current?.focus();
  };

  const handleClear = () => {
    dispatch(clearGeneratedText());
    setChatHistory([]);
    setPrompt("");
    inputRef.current?.focus();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "70%",
        mx: "auto",
        minHeight: "100vh",
        bgcolor: "background.default", // Use theme background
      }}
    >
      <AppBar
        position="sticky"
        elevation={1}
        sx={{ bgcolor: "background.paper", width: "100%" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* <Typography variant="h6" component="h1" sx={{ color: 'text.primary' }}>
                       Gemini
                    </Typography> */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="model-select-label">Model</InputLabel>
              <Select
                labelId="model-select-label"
                id="model-select"
                value={model}
                label="Model"
                onChange={handleModelChange}
              >
                <MenuItem value="gemini-2.0-flash">Gemini 2.0 Flash</MenuItem>
                <MenuItem value="gemini-2.0-flash-lite">
                  Gemini 2.0 Flash Lite
                </MenuItem>
                <MenuItem value="gemini-1.5">Gemini 1.5</MenuItem>
                <MenuItem value="gemini-1.5-pro">Gemini 1.5 Pro</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClear}
              startIcon={<DeleteSweep />}
            >
              Clear Chat
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Chat Container */}
      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1, // Takes up available space
          overflowY: "auto", // Enable vertical scrolling
          p: 2, // Padding
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {chatHistory.length === 0 && !loading && !error && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                background: "linear-gradient(90deg, #9a67ea, #e91e63)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "500",
              }}
            >
              Hello, {profile?.displayName}
            </Typography>
          </Box>
        )}

        {chatHistory.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              justifyContent: message.isUser ? "flex-end" : "flex-start",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                maxWidth: "75%",
                bgcolor: message.isUser ? "primary.main" : "background.paper",
                color: message.isUser ? "primary.contrastText" : "text.primary",
                borderRadius: message.isUser
                  ? "20px 20px 5px 20px" // Rounded top-left, top-right, bottom-left
                  : "20px 20px 20px 5px", // Rounded top-left, top-right, bottom-right
                wordWrap: "break-word", // Ensure long words break
                whiteSpace: "pre-wrap", // Preserve whitespace and wrap text
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
              <Typography
                variant="caption"
                component="div" // Use div for block display
                sx={{
                  mt: 0.5,
                  textAlign: "right",
                  color: message.isUser
                    ? "rgba(255, 255, 255, 0.7)"
                    : "text.secondary",
                }}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Paper>
          </Box>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                borderRadius: "20px 20px 20px 5px",
                bgcolor: "background.paper",
              }}
            >
              <CircularProgress size={20} />
            </Paper>
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Alert severity="error" sx={{ width: "100%", maxWidth: "75%" }}>
              Error: {error}
            </Alert>
          </Box>
        )}
      </Box>

      {/* Input Area - Fixed at Bottom */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          zIndex: (theme) => theme.zIndex.appBar,
          borderRadius: 20,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Ask Gemini"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            multiline
            maxRows={8}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 20,
              },

              "& fieldset": {
                borderRadius: 20,
              },
            }}
          />
     
          <IconButton
            type="submit"
            disabled={loading || !prompt.trim()}

          ><Send /></IconButton>

        </Box>
      </Box>
    </Box>
  );
};

// Note: Exporting as default is important for React.lazy
export default GeminiChat;
