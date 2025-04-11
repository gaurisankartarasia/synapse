
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { reportReasonsConfig, type ReportType } from "./config/reportReasonsConfig";

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, additionalInfo?: Record<string, any>) => Promise<void>;
  type: ReportType;
};

export const ReportModal = ({ isOpen, onClose, onSubmit, type }: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const reportReasons = reportReasonsConfig[type];

  const getReportTitle = () => `Report ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  const handleSubmit = async () => {
    const reason = selectedReason === "Other" ? customReason.trim() : selectedReason;
    if (!reason) return;

    setLoading(true);
    try {
      await onSubmit(reason);
      onClose();
      setSelectedReason("");
      setCustomReason("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      {/* Title with Close Button */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {getReportTitle()}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Description */}
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          Select a reason for reporting this {type}
        </Typography>

        {/* Reason Selection */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
          {reportReasons.map((reason) => (
            <Button
              key={reason}
              variant={selectedReason === reason ? "contained" : "outlined"}
              color={selectedReason === reason ? "primary" : "inherit"}
              onClick={() => setSelectedReason(reason)}
              fullWidth
            >
              {reason}
            </Button>
          ))}
        </div>

        {/* Custom Reason Input */}
        {selectedReason === "Other" && (
          <TextField
            label="Please specify your reason..."
            multiline
            rows={3}
            fullWidth
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            margin="normal"
          />
        )}
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={loading || !selectedReason || (selectedReason === "Other" && !customReason.trim())}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
