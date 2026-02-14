import cloudinary from "cloudinary";

cloudinary.v2.config({

    
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  
});
console.log("Cloudinary config:", {
  cloud: process.env.CLOUD_NAME,
  key: process.env.CLOUD_API_KEY ? "SET" : "MISSING",
  secret: process.env.CLOUD_API_SECRET ? "SET" : "MISSING",
});

export default cloudinary;
