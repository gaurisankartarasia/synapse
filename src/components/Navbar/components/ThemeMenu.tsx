// components/ThemeMenu.tsx
import { Sun, Moon } from 'lucide-react';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ThemeMenuProps {
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

export const ThemeMenu = ({ theme, setTheme }: ThemeMenuProps) => (
  <DropdownMenuSub>
    <DropdownMenuSubTrigger className="flex items-center gap-2">
      {theme === 'light' ? <Sun /> : <Moon />}
      <span>Theme</span>
    </DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent>
        <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2">
          <LightModeOutlinedIcon className="h-4 w-4" />
          <span>Light Mode</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2">
          <DarkModeOutlinedIcon className="h-4 w-4" />
          <span>Dark Mode</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center gap-2">
          <DevicesOutlinedIcon className="h-4 w-4" />
          <span>System Theme</span>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
);