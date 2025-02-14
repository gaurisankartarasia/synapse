// src/app/post/create/utils/imageUpload.ts
export const uploadImages = async (images: File[]): Promise<string[]> => {
    const uploadedImageURLs = [];
    
    for (const image of images) {
      const formData = new FormData();
      formData.append("image", image);
  
      const imageResponse = await fetch("/api/post/upload_post_img", {
        method: "POST",
        credentials: 'include', // Include credentials for authentication
        body: formData,
      });
  
      if (!imageResponse.ok) {
        throw new Error("Image upload failed");
      }
  
      const imageData = await imageResponse.json();
      uploadedImageURLs.push(imageData.imageURL);
    }
    
    return uploadedImageURLs;
  };