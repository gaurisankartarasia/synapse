
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";

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
//     "Inappropriate content",
//     "Harassment",
//     "Spam",
//     "Misinformation",
//     "Other",
//   ];

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Report</DialogTitle>
//           <DialogDescription>
//             Select a reason for reporting
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <Select
//             value={selectedReason}
//             onValueChange={(value) => setSelectedReason(value)}
//           >
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Select a reason" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 {reportReasons.map((reason) => (
//                   <SelectItem key={reason} value={reason}>
//                     {reason}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>

//           {selectedReason === "Other" && (
//             <Textarea
//               placeholder="Enter your reason..."
//               value={customReason}
//               onChange={(e) => setCustomReason(e.target.value)}
//               className="mt-2"
//             />
//           )}
//         </div>
//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={onClose}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="destructive"
//             onClick={handleSubmit}
//             disabled={loading || !selectedReason}
//           >
//             {loading ? "Submitting..." : "Report"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
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

// Define the possible report types
type ReportType = "profile" | "page" | "post" | "comment" | "message";

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, additionalInfo?: Record<string, any>) => Promise<void>;
  type: ReportType; // New type prop
};

export const ReportModal = ({ isOpen, onClose, onSubmit, type }: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Get type-specific report reasons
  const getReportReasons = () => {
    // Default report reasons
    const defaultReasons = [
      "Inappropriate content",
      "Harassment",
      "Spam",
      "Misinformation",
      "Other",
    ];

    // Type-specific reasons can be added here
    switch (type) {
      case "profile":
        return [
          "Fake account",
          "Impersonation",
          ...defaultReasons
        ];
      case "page":
        return [
          "Fraudulent organization",
          "Misleading content",
          ...defaultReasons
        ];
      case "post":
        return [
          "Copyright violation",
          "Violent content",
          "Hate speech",
          ...defaultReasons
        ];
      case "comment":
        return [
          "Hate speech",
          "Bullying",
          ...defaultReasons
        ];
      case "message":
        return [
          "Unwanted contact",
          "Phishing attempt",
          ...defaultReasons
        ];
      default:
        return defaultReasons;
    }
  };

  const reportReasons = getReportReasons();

  // Get the title based on the type
  const getReportTitle = () => {
    switch (type) {
      case "profile":
        return "Report Profile";
      case "page":
        return "Report Page";
      case "post":
        return "Report Post";
      case "comment":
        return "Report Comment";
      case "message":
        return "Report Message";
      default:
        return "Report";
    }
  };

  const handleSubmit = async () => {
    const reason = selectedReason === "Other" ? customReason.trim() : selectedReason;
    if (!reason) return;

    setLoading(true);
    try {
      await onSubmit(reason, additionalInfo);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Update additional info fields
  const updateAdditionalInfo = (key: string, value: any) => {
    setAdditionalInfo(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Render type-specific fields
  const renderTypeSpecificFields = () => {
    // This is where you can add the custom fields based on type
    // For now, it's a placeholder that you can expand upon
    switch (type) {
      case "profile":
        // Profile-specific fields will go here
        return null;
      case "page":
        // Page-specific fields will go here
        return null;
      case "post":
        // Post-specific fields will go here
        return null;
      case "comment":
        // Comment-specific fields will go here
        return null;
      case "message":
        // Message-specific fields will go here
        return null;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getReportTitle()}</DialogTitle>
          <DialogDescription>
            Select a reason for reporting this {type}
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

          {/* Placeholder for type-specific fields */}
          {renderTypeSpecificFields()}
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