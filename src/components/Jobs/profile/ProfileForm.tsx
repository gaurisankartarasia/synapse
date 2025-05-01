// src/components/profile/ProfileForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Stack,
    Typography,
    Paper,
    Grid,
    Chip,
    IconButton,
    List,
    ListItem,
    Divider,
    Autocomplete // Make sure Autocomplete is imported
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// Keep original types which include 'id' for frontend use
import { JobProfile, JobExperience, JobEducation } from '@/types/Job/JobProfile';

// --- Type Definitions ---

// 1. Type for the form's internal state (ensures arrays exist and items have IDs)
type JobProfileFormState = Omit<JobProfile, 'uid' | 'createdAt' | 'updatedAt' | 'experience' | 'education' | 'skills'> & {
    skills: string[]; // Ensure skills is always string[]
    experience: JobExperience[]; // Ensure experience is always JobExperience[]
    education: JobEducation[]; // Ensure education is always JobEducation[]
};

// 2. Types for API payload (items within arrays DON'T have 'id')
type JobExperienceApiPayload = Omit<JobExperience, 'id'>;
type JobEducationApiPayload = Omit<JobEducation, 'id'>;

// The complete structure expected by the API POST endpoint
export type JobProfileApiPayload = Omit<JobProfileFormState, 'experience' | 'education'> & {
    experience?: JobExperienceApiPayload[]; // Array items lack 'id'
    education?: JobEducationApiPayload[]; // Array items lack 'id'
};

// --- Component Props ---
interface ProfileFormProps {
    initialData: JobProfile | null;
    onSubmit: (data: JobProfileApiPayload) => Promise<void>; // Expects API payload type
    onCancel: () => void;
    isSubmitting: boolean;
}

// --- Helper Functions ---
const generateId = () => `temp_${Math.random().toString(36).substr(2, 9)}`;

// Keys corresponding to arrays of objects requiring ID management
type ArrayWithIdKey = 'experience' | 'education';
// The type of items within those arrays
type ArrayItemWithId = JobExperience | JobEducation;


// --- Component Implementation ---
const ProfileForm: React.FC<ProfileFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
}) => {
    // Initialize state with defaults, ensuring arrays are present
    const [formData, setFormData] = useState<JobProfileFormState>({
        headline: '',
        summary: '',
        skills: [],
        experience: [],
        education: [],
        portfolioUrl: '',
        linkedinUrl: '',
        githubUrl: '',
    });

    // --- State Initialization Effect ---
    useEffect(() => {
        const dataWithIdsAndDefaults: JobProfileFormState = {
            headline: initialData?.headline ?? '',
            summary: initialData?.summary ?? '',
            skills: initialData?.skills ?? [], // Default to empty array
            // Ensure experience items have IDs
            experience: initialData?.experience?.map(exp => ({ ...exp, id: exp.id || generateId() })) ?? [], // Default to empty array
            // Ensure education items have IDs
            education: initialData?.education?.map(edu => ({ ...edu, id: edu.id || generateId() })) ?? [], // Default to empty array
            portfolioUrl: initialData?.portfolioUrl ?? '',
            linkedinUrl: initialData?.linkedinUrl ?? '',
            githubUrl: initialData?.githubUrl ?? '',
        };
        setFormData(dataWithIdsAndDefaults);
    }, [initialData]);

    // --- Input Handlers ---

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        // Type guard to ensure name is a valid key before setting state
        if (name in formData) {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSkillsChange = (event: React.SyntheticEvent, newValue: string[]) => {
        setFormData((prev) => ({
            ...prev,
            skills: newValue, // Directly update skills array
        }));
    };

    // --- Generic Array Handlers (Constrained) ---

    // Handler for changes *within* an array item
    const handleArrayItemChange = <K extends ArrayWithIdKey>(
        index: number,
        field: keyof JobProfileFormState[K][number], // Use keys of the specific item type
        value: any,
        arrayName: K // Constrained to 'experience' | 'education'
    ) => {
        setFormData((prev) => {
            // Assert that prev[arrayName] is the correct array type (JobExperience[] or JobEducation[])
            const currentArray = prev[arrayName] as ArrayItemWithId[];
            const newArray = [...currentArray];
            if (index >= 0 && index < newArray.length) {
                // Create the updated item - assert type if necessary, though often inferred
                const updatedItem = { ...newArray[index], [field]: value };
                newArray[index] = updatedItem;
            }
            // Return the updated state, ensuring the key matches the specific array type
            return { ...prev, [arrayName]: newArray };
        });
    };

    // Handler to add a new item to an array
    const addArrayItem = <K extends ArrayWithIdKey>(
        arrayName: K,
        // newItem type excludes 'id', as it will be generated
        newItem: Omit<JobProfileFormState[K][number], 'id'>
    ) => {
        setFormData((prev) => {
            const currentArray = prev[arrayName] as ArrayItemWithId[]; // Assert type
            // Create the full item with a generated ID, assert to the base item type
            const itemWithId = { ...newItem, id: generateId() } as ArrayItemWithId;
            return {
                ...prev,
                [arrayName]: [...currentArray, itemWithId], // Add the new item
            };
        });
    };

    // Handler to remove an item from an array
    const removeArrayItem = <K extends ArrayWithIdKey>(index: number, arrayName: K) => {
        setFormData((prev) => {
            const currentArray = prev[arrayName] as ArrayItemWithId[]; // Assert type
            return {
                ...prev,
                [arrayName]: currentArray.filter((_, i) => i !== index), // Filter out the item
            };
        });
    };

    // --- Specific Add Functions ---
    const addExperience = () => {
        // Call generic addArrayItem with specific key and default object structure
        addArrayItem<'experience'>('experience', { title: '', company: '', startDate: '', endDate: null, description: '', location: '' });
    };

    const addEducation = () => {
        // Call generic addArrayItem with specific key and default object structure
        addArrayItem<'education'>('education', { institution: '', degree: '', startDate: '', endDate: null, description: '', fieldOfStudy: '' });
    };

    // --- Submit Handler ---
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // 1. Create the API payload object conforming to JobProfileApiPayload
        const dataToSubmit: JobProfileApiPayload = {
            // Spread scalar values and skills array (which doesn't need ID removal)
            headline: formData.headline,
            summary: formData.summary,
            skills: formData.skills,
            portfolioUrl: formData.portfolioUrl,
            linkedinUrl: formData.linkedinUrl,
            githubUrl: formData.githubUrl,
            // 2. Map experience/education arrays, explicitly removing 'id'
            experience: formData.experience.map(({ id, ...rest }) => rest), // 'rest' conforms to JobExperienceApiPayload
            education: formData.education.map(({ id, ...rest }) => rest),   // 'rest' conforms to JobEducationApiPayload
        };

        // 3. Call onSubmit with the correctly typed payload
        await onSubmit(dataToSubmit);
    };

    // --- JSX Rendering ---
    return (
        <Paper elevation={3} sx={{ p: 3, boxShadow:'none' }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" gutterBottom mb={3}>Edit Profile</Typography>
                <Grid container spacing={3}>
                    {/* Headline */}
                    <Grid size={8}>
                        <TextField
                            fullWidth
                            label="Headline"
                            name="headline" // Matches state key
                            value={formData.headline} // Use controlled component value
                            onChange={handleInputChange}
                            variant="outlined"
                            helperText="A short professional tagline (e.g., Full Stack Developer | Cloud Enthusiast)"
                        />
                    </Grid>

                    {/* Summary */}
                    <Grid size={10}>
                        <TextField
                            fullWidth multiline rows={4} label="Summary"
                            name="summary" // Matches state key
                            value={formData.summary} // Use controlled component value
                            onChange={handleInputChange}
                            variant="outlined"
                            helperText="A detailed overview of your experience, skills, and career goals."
                        />
                    </Grid>

                    {/* Skills */}
                    <Grid size={12}>
                        <Autocomplete
                            multiple freeSolo options={[]}
                            value={formData.skills} // Use controlled component value
                            onChange={handleSkillsChange}
                            renderTags={(value: readonly string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" label="Skills"
                                    placeholder="Add skills (e.g., React, Node.js)"
                                    helperText="Press Enter to add a new skill."
                                />
                            )}
                        />
                    </Grid>

                    {/* --- Experience Section --- */}
                    <Grid size={12}>
                        <Typography variant="h6" gutterBottom>Experience</Typography>
                        <List disablePadding>
                            {formData.experience.map((exp, index) => (
                                <React.Fragment key={exp.id}> {/* Key uses frontend ID */}
                                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                        <Stack spacing={2}>
                                            {/* Pass specific key 'experience' to handlers */}
                                            <TextField required label="Job Title" value={exp.title} onChange={(e) => handleArrayItemChange(index, 'title', e.target.value, 'experience')} fullWidth />
                                            <TextField required label="Company" value={exp.company} onChange={(e) => handleArrayItemChange(index, 'company', e.target.value, 'experience')} fullWidth />
                                            <TextField label="Location (Optional)" value={exp.location || ''} onChange={(e) => handleArrayItemChange(index, 'location', e.target.value, 'experience')} fullWidth />
                                            <Stack direction="row" spacing={2}>
                                                <TextField required label="Start Date" type="month"
                                                    value={exp.startDate ? exp.startDate.substring(0, 7) : ''}
                                                    onChange={(e) => handleArrayItemChange(index, 'startDate', e.target.value, 'experience')}
                                                    InputLabelProps={{ shrink: true }} sx={{ flexGrow: 1 }} />
                                                <TextField label="End Date (leave blank if current)" type="month"
                                                    value={exp.endDate ? exp.endDate.substring(0, 7) : ''}
                                                    onChange={(e) => handleArrayItemChange(index, 'endDate', e.target.value || null, 'experience')}
                                                    InputLabelProps={{ shrink: true }} sx={{ flexGrow: 1 }} />
                                            </Stack>
                                            <TextField label="Description (Optional)" multiline rows={3} value={exp.description || ''} onChange={(e) => handleArrayItemChange(index, 'description', e.target.value, 'experience')} fullWidth />
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Button onClick={() => removeArrayItem(index, 'experience')} color="error" size="small">
                                                    <RemoveCircleOutlineIcon fontSize='small' /> Remove
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </React.Fragment>
                            ))}
                        </List>
                        <Button startIcon={<AddCircleOutlineIcon />} onClick={addExperience} variant="outlined" size="small">
                            Add Experience
                        </Button>
                    </Grid>

                    {/* --- Education Section (Apply similar corrections) --- */}
                     <Grid size={12}>
                        <Typography variant="h6" gutterBottom>Education</Typography>
                        <List disablePadding>
                            {formData.education.map((edu, index) => (
                                <React.Fragment key={edu.id}> {/* Key uses frontend ID */}
                                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                        <Stack spacing={2}>
                                             {/* Pass specific key 'education' to handlers */}
                                            <TextField required label="Institution" value={edu.institution} onChange={(e) => handleArrayItemChange(index, 'institution', e.target.value, 'education')} fullWidth />
                                            <TextField required label="Degree" value={edu.degree} onChange={(e) => handleArrayItemChange(index, 'degree', e.target.value, 'education')} fullWidth />
                                            <TextField label="Field of Study (Optional)" value={edu.fieldOfStudy || ''} onChange={(e) => handleArrayItemChange(index, 'fieldOfStudy', e.target.value, 'education')} fullWidth />
                                            <Stack direction="row" spacing={2}>
                                                <TextField required label="Start Date" type="month"
                                                    value={edu.startDate ? edu.startDate.substring(0, 7) : ''}
                                                    onChange={(e) => handleArrayItemChange(index, 'startDate', e.target.value, 'education')}
                                                    InputLabelProps={{ shrink: true }} sx={{ flexGrow: 1 }} />
                                                <TextField label="End Date (leave blank if ongoing)" type="month"
                                                    value={edu.endDate ? edu.endDate.substring(0, 7) : ''}
                                                    onChange={(e) => handleArrayItemChange(index, 'endDate', e.target.value || null, 'education')}
                                                    InputLabelProps={{ shrink: true }} sx={{ flexGrow: 1 }} />
                                            </Stack>
                                            <TextField label="Description/Activities (Optional)" multiline rows={2} value={edu.description || ''} onChange={(e) => handleArrayItemChange(index, 'description', e.target.value, 'education')} fullWidth />
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Button onClick={() => removeArrayItem(index, 'education')} color="error" size="small">
                                                    <RemoveCircleOutlineIcon fontSize='small' /> Remove
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </React.Fragment>
                            ))}
                        </List>
                        <Button startIcon={<AddCircleOutlineIcon />} onClick={addEducation} variant="outlined" size="small">
                            Add Education
                        </Button>
                    </Grid>

                    {/* Links */}
                     <Grid size={{xs:12, sm:6}} >
                        <TextField fullWidth label="Portfolio/Website URL (Optional)" name="portfolioUrl" type="url" value={formData.portfolioUrl} onChange={handleInputChange} variant="outlined" />
                    </Grid>
                    <Grid size={{xs:12, sm:6}}>
                        <TextField fullWidth label="LinkedIn Profile URL (Optional)" name="linkedinUrl" type="url" value={formData.linkedinUrl} onChange={handleInputChange} variant="outlined" />
                    </Grid>
                    <Grid size={{xs:12, sm:6}}>
                        <TextField fullWidth label="GitHub Profile URL (Optional)" name="githubUrl" type="url" value={formData.githubUrl} onChange={handleInputChange} variant="outlined" />
                    </Grid>


                    {/* Action Buttons */}
                    <Grid size={12}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} >
                                {isSubmitting ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default ProfileForm;