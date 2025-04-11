import React from 'react';
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha } from '@mui/material/styles';

// Define the props interface for our custom switch component
interface MD3SwitchProps extends Omit<SwitchProps, 'color'> {
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  label?: string;
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
}

// Create the styled switch following Material Design 3 guidelines
const MD3StyledSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => {
  const primaryColor = theme.palette.primary.main;
  return {
    width: 52,
    height: 32,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 4,
      margin: 0,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(20px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: primaryColor,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: primaryColor,
        border: `6px solid ${theme.palette.common.white}`,
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 24,
      height: 24,
      boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
    },
    '& .MuiSwitch-track': {
      borderRadius: 32 / 2,
      backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[600],
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
    '&:hover .MuiSwitch-track': {
      backgroundColor: theme.palette.mode === 'light' 
        ? alpha(primaryColor, 0.15)
        : alpha(primaryColor, 0.25),
    },
  };
});

// Main component that uses the styled switch
const MD3Switch: React.FC<MD3SwitchProps> = ({
  color = 'primary',
  label,
  labelPlacement = 'end',
  ...props
}) => {
  const switchComponent = <MD3StyledSwitch {...props} />;

  if (label) {
    return (
      <FormControlLabel
        control={switchComponent}
        label={label}
        labelPlacement={labelPlacement}
      />
    );
  }

  return switchComponent;
};

export default MD3Switch;