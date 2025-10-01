const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "fitby/others"; // default folder
    let publicId = Date.now();   // default public_id

    if (req.baseUrl.includes("auth")) {
      folder = "fitby/auth";
      publicId = req.user ? `auth_${req.user.id}` : `auth_${Date.now()}`;
    } 
    else if (req.baseUrl.includes("blogs")) {
      const userId = req.user ? req.user.id : "anonymous";
      folder = `fitby/blogs/${userId}`;
      publicId = req.params.id || Date.now(); // use blog ID on update
    } 
    else if (req.baseUrl.includes("users") || req.baseUrl.includes("user")) {
      folder = "fitby/user";
      publicId = req.user ? `user_${req.user.id}` : `user_${Date.now()}`;
    }

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: publicId.toString(),
      overwrite: true, // ensures replacement if public_id already exists
    };
  },
});

const upload = multer({ storage });
module.exports = upload;
