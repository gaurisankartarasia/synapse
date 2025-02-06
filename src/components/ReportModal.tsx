
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
};

export const ReportModal = ({ isOpen, onClose, onSubmit }: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    const reason = selectedReason === "Other" ? customReason.trim() : selectedReason;
    if (!reason) return;

    setLoading(true);
    try {
      await onSubmit(reason);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reportReasons = [
    "Bhaiya gali de raha hai ye",
    "Inappropriate content",
    "Harassment",
    "Spam",
    "Misinformation",
    "Other",
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Report Comment</DialogTitle>
      <DialogContent>
        <Select
          fullWidth
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Reason for reporting
          </MenuItem>
          {reportReasons.map((reason) => (
            <MenuItem key={reason} value={reason}>
              {reason}
            </MenuItem>
          ))}
        </Select>
        {selectedReason === "Other" && (
          <TextField
            label="Please specify"
            placeholder="Enter your reason..."
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Skeleton /> : "Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
