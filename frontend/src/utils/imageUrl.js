const API_BASE_URL = "https://fitby-fitness-ai-powered-app.onrender.com";

export const getImageUrl = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_BASE_URL}/uploads/${image}`;
};
