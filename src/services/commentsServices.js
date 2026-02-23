import axios from "axios";
const BaseURL = import.meta.env.VITE_BASE_URL;

export const getCommentsService = async (
  token,
  postID,
  page = 1,
  limit = 10,
) => {
  const response = axios.get(BaseURL + "/posts/" + postID + "/comments", {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    params: {
      page: page,
      limit: limit,
    },
  });
  return response;
};
