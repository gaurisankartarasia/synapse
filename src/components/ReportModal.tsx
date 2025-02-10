
// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Spinner,
// } from "@/mui-material/react";

// type ReportModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (reason: string) => Promise<void>;
// };

// export const ReportModal = ({ isOpen, onClose, onSubmit }: ReportModalProps) => {
//   const [selectedReason, setSelectedReason] = useState<string>("");
//   const [customReason, setCustomReason] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleSubmit = async () => {
//     const reason = selectedReason === "Other" ? customReason.trim() : selectedReason;
//     if (!reason) return;

//     setLoading(true);
//     try {
//       await onSubmit(reason);
//       onClose();
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reportReasons = [
//     "Bhaiya gali de raha hai ye",
//     "Inappropriate content",
//     "Harassment",
//     "Spam",
//     "Misinformation",
//     "Other",
//   ];

//   return (
//     <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>Report Comment</DialogTitle>
//       <DialogContent>
//         <Select
//           fullWidth
//           value={selectedReason}
//           onChange={(e) => setSelectedReason(e.target.value)}
//           displayEmpty
//         >
//           <MenuItem value="" disabled>
//             Reason for reporting
//           </MenuItem>
//           {reportReasons.map((reason) => (
//             <MenuItem key={reason} value={reason}>
//               {reason}
//             </MenuItem>
//           ))}
//         </Select>
//         {selectedReason === "Other" && (
//           <TextField
//             label="Please specify"
//             placeholder="Enter your reason..."
//             multiline
//             rows={4}
//             fullWidth
//             margin="normal"
//             value={customReason}
//             onChange={(e) => setCustomReason(e.target.value)}
//           />
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           color="error"
//           onClick={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? <Spinner /> : "Report"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Comment</DialogTitle>
          <DialogDescription>
            Select a reason for reporting this comment
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select 
            value={selectedReason} 
            onValueChange={(value) => setSelectedReason(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {reportReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {selectedReason === "Other" && (
            <Textarea
              placeholder="Enter your reason..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="mt-2"
            />
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSubmit} 
            disabled={loading || !selectedReason}
          >
            {loading ? "Submitting..." : "Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};