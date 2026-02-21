import axios from "axios";
const BaseURL = import.meta.env.VITE_BASE_URL;
const newsFeedEndPoint = "/posts";
const postDetailsEndPoint = "/posts/";
const userPostsEndPoint = "/posts/feed?only=me";
export const newsFeedService = async (token) => {
  const response = axios.get(BaseURL + newsFeedEndPoint, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  return response;
};
export const postDetailsService = async (token, postID) => {
  const response = axios.get(BaseURL + postDetailsEndPoint + postID, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });

  return response;
};

export const getUserPostsService = async (token) => {
  const response = axios.get(BaseURL + userPostsEndPoint, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  return response;
};
