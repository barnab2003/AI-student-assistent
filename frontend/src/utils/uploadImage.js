import axios from 'axios';

export const uploadImageToCloudinary = async (file) => {
  // TODO: Replace these with your actual Cloudinary details
  const cloudName = "dxtmeehyv"; 
  const uploadPreset = "smartstudy_images"; // The Unsigned preset you just made

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
      formData
    );
    
    // Cloudinary hands back a secure, public URL!
    return res.data.secure_url; 
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};