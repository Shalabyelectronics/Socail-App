import axios from "axios";
const BaseURL = import.meta.env.VITE_BASE_URL;
const newsFeedEndPoint = "/posts";
const createPostEndPoint = "/posts";
const postDetailsEndPoint = "/posts/";
const userPostsEndPoint = "/posts/feed?only=me";
export const newsFeedService = async (token, page = 1, limit = 10) => {
  const response = axios.get(BaseURL + newsFeedEndPoint, {
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
export const postDetailsService = async (token, postID) => {
  const response = axios.get(BaseURL + postDetailsEndPoint + postID, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
export const CreateUserPostsService = async (token, payLoad) => {
  const data = new FormData();
  if (payLoad.body) {
    data.append("body", payLoad.body);
  }
  if (payLoad.image) {
    data.append("image", payLoad.image);
  }
  const response = axios.post(BaseURL + createPostEndPoint, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const sharePostService = async (token, postID, body) => {
  const response = axios.post(
    `${BaseURL}/posts/${postID}/share`,
    { body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response;
};

export const likePostService = async (token, postID) => {
  return await axios.put(
    `${BaseURL}/posts/${postID}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};





