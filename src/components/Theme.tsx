"use client";

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdLightMode } from "react-icons/md"; 

const ThemeDropdown = () => {
  // Initialize theme directly from localStorage to avoid flickering
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (typeof window !== "undefined" && localStorage.getItem("theme") as "light" | "dark") || "dark"
  );

  useEffect(() => {
    // Apply the theme class to the document body
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = (key: string | number) => {
    if (key === "light" || key === "dark") {
      setTheme(key);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" className=""> 
          <span
                    className="material-symbols-outlined"
                    // style={{ fontSize: "124px" }}
                >
                    light_mode
                </span>
                </Button>
      </DropdownTrigger>
      <DropdownMenu onAction={handleThemeChange} variant="faded">
        <DropdownItem key="light" className="flex items-center mr-3 ">     
           <span
                    className="material-symbols-outlined"
                    // style={{ fontSize: "124px" }}
                >
                    light_mode
                </span> Light
                </DropdownItem>
        <DropdownItem key="dark" className="flex items-center mr-3"
        >      <span
                    className="material-symbols-outlined"
                    // style={{ fontSize: "124px" }}
                >
                    dark_mode
                </span> Dark</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ThemeDropdown;
