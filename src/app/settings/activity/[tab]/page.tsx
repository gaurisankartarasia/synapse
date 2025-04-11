
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LikedPostsPage from "../components/Liked";
import SavedPostsGrid from "../components/Saved";
import UserComments from "../components/Comments";
import ArchivedPostsGrid from "../components/Archived";

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function MuiTabsDemo() {
  const router = useRouter();
  const params = useParams(); // Get the tab from the URL

  const tabFromUrl = (params.tab as string) || "liked";

  // State for managing selected tab index (MUI Tabs uses index)
  const [value, setValue] = useState<number>(() => {
    switch (tabFromUrl) {
      case "liked":
        return 0;
      case "saved":
        return 1;
      case "comments":
        return 2;
      case "archived":
        return 3;
      default:
        return 0;
    }
  });

  useEffect(() => {
    let newValue = 0;
    switch (tabFromUrl) {
      case "liked":
        newValue = 0;
        break;
      case "saved":
        newValue = 1;
        break;
      case "comments":
        newValue = 2;
        break;
      case "archived":
        newValue = 3;
        break;
      default:
        newValue = 0;
    }
    setValue(newValue);
  }, [tabFromUrl]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    let newTabRoute = "liked";
    switch (newValue) {
      case 0:
        newTabRoute = "liked";
        break;
      case 1:
        newTabRoute = "saved";
        break;
      case 2:
        newTabRoute = "comments";
        break;
      case 3:
        newTabRoute = "archived";
        break;
    }
    router.push(`/settings/activity/${newTabRoute}`, { scroll: false }); // Update the URL
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="activity tabs"
        >
          <Tab label="Liked" {...a11yProps(0)} />
          <Tab label="Saved" {...a11yProps(1)} />
          <Tab label="Comments" {...a11yProps(2)} />
          <Tab label="Archived" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <LikedPostsPage />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SavedPostsGrid />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <UserComments />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ArchivedPostsGrid />
      </CustomTabPanel>
    </Box>
  );
}