import axios from "axios";
const BaseURL = import.meta.env.VITE_BASE_URL;
const newsFeedEndPoint = "/posts";
export const newsFeedService = async (token) => {
  const response = axios.get(BaseURL + newsFeedEndPoint, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  console.log("Here is the posts response", response);
  return response;
};
