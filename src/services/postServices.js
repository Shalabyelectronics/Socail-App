import axios from "axios";
const BaseURL = import.meta.env.VITE_BASE_URL;
const newsFeedEndPoint = "/posts";
const createPostEndPoint = "/posts";
const postDetailsEndPoint = "/posts/";
const userPostsEndPoint = "/posts/feed?only=me";
const bookmarkedPostsEndPoint = "/posts/feed?only=bookmarks";
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
  if (payLoad.privacy) {
    data.append("privacy", payLoad.privacy);
  }
  const response = axios.post(BaseURL + createPostEndPoint, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const bookmarkedFeedService = async (token, page = 1, limit = 10) => {
  const response = axios.get(BaseURL + bookmarkedPostsEndPoint, {
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

export const getBookmarksService = async (token, page = 1, limit = 10) => {
  const response = axios.get(`${BaseURL}/users/bookmarks`, {
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
export const bookmarkPostService = async (token, postID) => {
  return await axios.put(
    `${BaseURL}/posts/${postID}/bookmark`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const updatePostService = async (token, postID, payload) => {
  const data = new FormData();
  if (payload.body) data.append("body", payload.body);
  if (payload.image) data.append("image", payload.image);
  if (payload.privacy) data.append("privacy", payload.privacy);
  const response = axios.put(`${BaseURL}/posts/${postID}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
export const deletePostService = async (token, postID) => {
  const response = axios.delete(`${BaseURL}/posts/${postID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
