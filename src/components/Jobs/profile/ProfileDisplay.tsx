// src/components/profile/ProfileDisplay.tsx
"use client"; // Keep as client component for potential future interactivity

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link as MuiLink,
  Stack,
  Avatar,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import { Description } from "@mui/icons-material";
import Link from "next/link";
import {
  JobProfile,
  JobExperience,
  JobEducation,
} from "@/types/Job/JobProfile";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import LinkIcon from "@mui/icons-material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from "@mui/icons-material/Edit";

interface ProfileDisplayProps {
  profile: JobProfile | null;
  // Optional: Pass basic user info if needed (e.g., photo, name)
  currentProfile?: { displayName?: string; profilePhotoURL?: string };
}

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "Present";
  try {
    // Attempt to create a date object. Handles ISO strings and potentially others.
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if parsing fails
    }
    // Format as Month Year (e.g., Jan 2023)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
    });
  } catch (e) {
    console.warn("Failed to parse date:", dateString, e);
    return dateString; // Return original string if error
  }
};

const ProfileSection: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <Box mb={4}>
    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
      {icon}
      <Typography  component="h5">
        {title}
      </Typography>
    </Stack>
    {children}
  </Box>
);

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  profile,
  currentProfile,
}) => {
  if (!profile || Object.keys(profile).length === 0) {
    return <Typography>No profile information available.</Typography>;
  }

  const renderExperience = (exp: JobExperience) => (
    <ListItem key={exp.id || exp.company + exp.title} alignItems="flex-start">
      <ListItemText
        primary={
          <Typography variant="h6">
            {exp.title} at {exp.company}
          </Typography>
        }
        secondary={
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formatDate(exp.startDate)} - {formatDate(exp.endDate)}{" "}
              {exp.location && `· ${exp.location}`}
            </Typography>
            {exp.description && (
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-wrap", mt: 1 }}
              >
                {exp.description}
              </Typography>
            )}
          </>
        }
      />
    </ListItem>
  );

  const renderEducation = (edu: JobEducation) => (
    <ListItem
      key={edu.id || edu.institution + edu.degree}
      alignItems="flex-start"
    >
      <ListItemText
        primary={<Typography variant="h6">{edu.institution}</Typography>}
        secondary={
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {edu.degree}
              {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
            </Typography>
            {edu.description && (
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-wrap", mt: 1 }}
              >
                {edu.description}
              </Typography>
            )}
          </>
        }
      />
    </ListItem>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, boxShadow: 0, borderRadius: 7 }}>
      <Grid container spacing={2}>
        {/* Basic Info - Could potentially come from a separate user object */}
        <Box
          //   size={{ xs: 12, md: 3 }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "#dddddd6e",
            p: 2,
            borderRadius: 7,
            width: "100%",
          }}
        >
          <Avatar
            sx={{ width: 120, height: 120, mb: 2, mx: { xs: "auto", md: 0 } }}
            src={currentProfile?.profilePhotoURL}
          />
          <div>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {currentProfile?.displayName}{" "}
              <IconButton LinkComponent={Link} href="/settings/profile/edit"  >
                <EditIcon sx={{fontSize:'0.9rem'}} />
              </IconButton>
            </Typography>
            <Typography>{profile?.email}</Typography>
          </div>
        </Box>

        {/* <Grid item xs={12} md={9}> */}
        <Grid size={12}  >
          {profile.resumeUrl && (
            <Button
              variant="outlined" // Or "text" or "contained"
              size="small"
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer" // Important for security/new tabs
              startIcon={<Description />}
              // Optionally add download attribute if the server sets appropriate headers
              // download="User_Resume"
            >
              View Resume
            </Button>
          )}{" "}
          {/* Make full width if not showing basic info here */}
          {profile.headline && (
            <Typography variant="h6" gutterBottom>
              {profile.headline}
            </Typography>
          )}
          {profile.summary && (
            <ProfileSection title="Summary">
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {profile.summary}
              </Typography>
            </ProfileSection>
          )}
          {profile.skills && profile.skills.length > 0 && (
            <ProfileSection title="Skills" icon={<LabelIcon />}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {profile.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </ProfileSection>
          )}
        </Grid>

        {profile.experience && profile.experience.length > 0 && (
          <Grid size={12}>
            <ProfileSection title="Experience" icon={<BusinessCenterIcon />}>
              <List disablePadding>
                {profile.experience.map((exp, index) => (
                  <React.Fragment key={exp.id || index}>
                    {renderExperience(exp)}
                    {index < profile.experience!.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </ProfileSection>
          </Grid>
        )}

        {profile.education && profile.education.length > 0 && (
          <Grid size={12}>
            <ProfileSection title="Education" icon={<SchoolIcon />}>
              <List disablePadding>
                {profile.education.map((edu, index) => (
                  <React.Fragment key={edu.id || index}>
                    {renderEducation(edu)}
                    {index < profile.education!.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </ProfileSection>
          </Grid>
        )}

        {(profile.portfolioUrl || profile.linkedinUrl || profile.githubUrl) && (
          <Grid size={12}>
            <ProfileSection title="Links" icon={<LinkIcon />}>
              <Stack
                spacing={1}
                direction="row"
                alignItems="center"
                flexWrap="wrap"
              >
                {profile.portfolioUrl && (
                  <MuiLink
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="flex"
                    alignItems="center"
                  >
                    <LinkIcon sx={{ mr: 0.5 }} fontSize="small" />{" "}
                    Website/Portfolio
                  </MuiLink>
                )}
                
                {profile.githubUrl && (
                  <MuiLink
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="flex"
                    alignItems="center"
                  >
                    <GitHubIcon sx={{ mr: 0.5 }} fontSize="small" /> GitHub
                  </MuiLink>
                )}
              </Stack>
            </ProfileSection>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default ProfileDisplay;
