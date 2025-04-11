
// // src/components/ActionDialog/index.tsx
// import React, { ReactNode } from 'react';
// import { 
//   Dialog as MuiDialog, 
//   DialogContent as MuiDialogContent,
//   Divider,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Paper,
// } from '@mui/material';

// interface DialogItemProps {
//   children: ReactNode;
//   onClick?: () => void;
//   className?: string;
// }

// interface DialogContextProps {
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const DialogContext = React.createContext<DialogContextProps | undefined>(undefined);

// export const useDialogContext = () => {
//   const context = React.useContext(DialogContext);
//   if (!context) {
//     throw new Error('Dialog components must be used within a Dialog');
//   }
//   return context;
// };

// export const Dialog: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [open, setOpen] = React.useState(false);
  
//   return (
//     <DialogContext.Provider value={{ open, setOpen }}>
//       {children}
//     </DialogContext.Provider>
//   );
// };

// export const DialogTrigger: React.FC<{ asChild?: boolean; children: ReactNode }> = ({ 
//   asChild, 
//   children 
// }) => {
//   const { setOpen } = useDialogContext();
  
//   if (asChild) {
//     return React.cloneElement(children as React.ReactElement, {
//       onClick: (e: React.MouseEvent) => {
//         e.preventDefault();
//         setOpen(true);
//       }
//     });
//   }
  
//   return (
//     <div onClick={() => setOpen(true)}>
//       {children}
//     </div>
//   );
// };

// export const DialogContent: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const { open, setOpen } = useDialogContext();
  
//   return (
//     <MuiDialog
//       open={open}
//       onClose={() => setOpen(false)}
//       maxWidth="xs"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           overflow: 'hidden',
//           p: 0,
//           m: 2,
        
//         }
//       }}
//     >
//       <MuiDialogContent sx={{ p: 0 }}>
//         <Paper elevation={0}>
//           <List sx={{ p: 0 }}>
//             {children}
//           </List>
//         </Paper>
//       </MuiDialogContent>
//     </MuiDialog>
//   );
// };

// export const DialogItem: React.FC<DialogItemProps> = ({ 
//   children, 
//   onClick, 
//   className 
// }) => {
//   const { setOpen } = useDialogContext();
  
//   const handleClick = () => {
//     if (onClick) {
//       onClick();
//     }
//     setOpen(false);
//   };
  
//   return (
//     <ListItem disablePadding>
//       <ListItemButton 
//         onClick={handleClick}
//         sx={{ 
//           py: 1.5,
//             textAlign:'center',
//           color: className?.includes('text-red-500') ? 'error.main' : 'inherit'
//         }}
//       >
//         <ListItemText primary={children} />
//       </ListItemButton>
//     </ListItem>
//   );
// };

// export const DialogSeparator: React.FC = () => <Divider />;

// export const DialogClose: React.FC<{ asChild: boolean; children: ReactNode }> = ({ 
//   asChild, 
//   children 
// }) => {
//   if (asChild && React.isValidElement(children)) {
//     return children;
//   }
//   return <>{children}</>;
// };





// src/components/ActionDialog/index.tsx
import React, { ReactNode } from 'react';
import { 
  Dialog as MuiDialog, 
  DialogContent as MuiDialogContent,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';

interface DialogItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

interface DialogContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogContext = React.createContext<DialogContextProps | undefined>(undefined);

export const useDialogContext = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog');
  }
  return context;
};

export const Dialog: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger: React.FC<{ asChild?: boolean; children: ReactNode }> = ({
  asChild,
  children
}) => {
  const { setOpen } = useDialogContext();

  if (asChild) {
    if (!React.isValidElement(children)) {
      console.error("DialogTrigger received invalid children with asChild=true");
      // Decide how to handle invalid children: return null, children, or throw
      return null; 
    }
    
    // --> Add type assertion for children.props <--
    const childProps = children.props as { onClick?: (e: React.MouseEvent) => void };

    return React.cloneElement(
      children, 
      { // Props to merge
        onClick: (e: React.MouseEvent) => {
          // Call existing onClick if it exists, using the asserted type
          if (childProps.onClick) { 
            childProps.onClick(e);
          }
          
          // Prevent default only if the original handler didn't stop it
          if (!e.isDefaultPrevented()) {
             e.preventDefault(); 
          }
          
          // Open the dialog
          setOpen(true);
        }
        // We still need 'as any' here because cloneElement's second argument
        // has trouble inferring compatibility with the specific unknown child's props.
      } as any 
    ); 
  }

  // Fallback div wrapper if not asChild
  return (
    <div onClick={() => setOpen(true)}>
      {children}
    </div>
  );
};

export const DialogContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { open, setOpen } = useDialogContext();
  
  return (
    <MuiDialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          p: 0,
          m: 2,
        
        }
      }}
    >
      <MuiDialogContent sx={{ p: 0 }}>
        <Paper elevation={0}>
          <List sx={{ p: 0 }}>
            {children}
          </List>
        </Paper>
      </MuiDialogContent>
    </MuiDialog>
  );
};

export const DialogItem: React.FC<DialogItemProps> = ({ 
  children, 
  onClick, 
  className 
}) => {
  const { setOpen } = useDialogContext();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setOpen(false);
  };
  
  return (
    <ListItem disablePadding>
      <ListItemButton 
        onClick={handleClick}
        sx={{ 
          py: 1.5,
            textAlign:'center',
          color: className?.includes('text-red-500') ? 'error.main' : 'inherit'
        }}
      >
        <ListItemText primary={children} />
      </ListItemButton>
    </ListItem>
  );
};

export const DialogSeparator: React.FC = () => <Divider />;

export const DialogClose: React.FC<{ asChild: boolean; children: ReactNode }> = ({ 
  asChild, 
  children 
}) => {
  if (asChild && React.isValidElement(children)) {
    return children;
  }
  return <>{children}</>;
};


