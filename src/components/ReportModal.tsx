// components/ReportModal.tsx
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Select,
  SelectItem
} from "@nextui-org/react";

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
};

export const ReportModal = ({ isOpen, onClose, onSubmit }: ReportModalProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
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
    "Inappropriate content",
    "Harassment",
    "Spam",
    "Misinformation",
    "Other"
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Report Comment</ModalHeader>
        <ModalBody>
          <Select
            label="Reason for reporting"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {reportReasons.map((reason) => (
              <SelectItem key={reason} value={reason}>
                {reason}
              </SelectItem>
            ))}
          </Select>
          {reason === "Other" && (
            <Textarea
              label="Please specify"
              placeholder="Enter your reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="danger" onPress={handleSubmit} isLoading={loading}>
            Report
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
