// src/app/profile/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


import { Button, TextField } from '@mui/material';

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  profilePhotoURL: string;
  lastEditedAt?: string;
}

const EditProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    displayName: '',
    bio: '',
    profilePhotoURL: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/user-profile/edit/form_data');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setPreviewUrl(data.profilePhotoURL);
    } catch (error) {
      
    }
  };

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Create HTMLImageElement instead of using new Image()
        const img = document.createElement('img') as HTMLImageElement;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas to Blob conversion failed'));
            },
            'image/webp',
            0.85 // quality
          );
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBlob = await compressImage(file);
        const compressedFile = new File([compressedBlob], file.name, {
          type: 'image/webp',
        });
        setImageFile(compressedFile);
        setPreviewUrl(URL.createObjectURL(compressedBlob));
      } catch (error) {
       
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Check edit cooldown
      const response = await fetch('/api/user-profile/edit/verify');
      const { canEdit } = await response.json();
      if (!canEdit) {
        
        return;
      }

      // Upload image if changed
      let newPhotoURL = profile.profilePhotoURL;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch('/api/user-profile/edit/image_update', {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const { url } = await uploadRes.json();
        newPhotoURL = url;
      }

      // Update profile
      const updateRes = await fetch('/api/user-profile/edit/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          profilePhotoURL: newPhotoURL,
        }),
      });

      if (!updateRes.ok) throw new Error('Failed to update profile');

   
      router.push(`/${profile.username}`);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div>
        <h4>Edit Profile</h4>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              <Image
                src={previewUrl || profile.profilePhotoURL || '/default-avatar.png'}
                alt="Profile photo"
                fill
                sizes="128px"
                priority
                className="rounded-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="max-w-xs"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="displayName">
                Display Name
              </label>
              <TextField
                id="displayName"
                value={profile.displayName}
                slotProps={{
                
                  htmlInput: {
                    maxLength: 30,
                  },
                }}
                onChange={(e) =>
                  setProfile({ ...profile, displayName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="username">
                Username
              </label>
              <TextField
                id="username"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                slotProps={{
                
                  htmlInput: {
                    maxLength: 30,
                  },
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="bio">
                Bio
              </label>
              <TextField
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                slotProps={{
                
                  htmlInput: {
                    maxLength: 150,
                  },
                }}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;