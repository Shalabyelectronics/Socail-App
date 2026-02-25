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
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: page,
      limit: limit,
    },
  });
  return response;
};

export const createCommentService = async (token, payLoad, postID) => {
  const data = new FormData();
  if (payLoad.body) {
    data.append("content", payLoad.body);
  }
  if (payLoad.image) {
    data.append("image", payLoad.image);
  }
  const response = axios.post(
    BaseURL + "/posts/" + postID + "/comments",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response;
};
export const createCommentReplayService = async (token, payLoad, postID) => {
  const data = new FormData();
  if (payLoad.body) {
    data.append("content", payLoad.body);
  }
  if (payLoad.image) {
    data.append("image", payLoad.image);
  }
  const response = axios.post(
    BaseURL + "/posts/" + postID + "/comments" +"replies",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response;
};
