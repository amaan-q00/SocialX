// lib/uploadToCloudinary.ts

export async function uploadToCloudinary(file: File): Promise<string> {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSizeMB = 5;
  
    if (!validTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, WEBP, or GIF images are allowed.");
    }
  
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`Image must be smaller than ${maxSizeMB}MB.`);
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
    formData.append("folder", "socialx/avatar");
  
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
  
    if (!res.ok || !data.secure_url) {
      console.error("Cloudinary upload failed:", data);
      throw new Error(data.error?.message || "Image upload failed.");
    }
  
    return data.secure_url;
  }
  