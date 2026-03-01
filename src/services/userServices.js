import axios from "axios";
const BaseURL = import.meta.env.VITE_BASE_URL;

/**
 * Fetch list of suggested users to follow
 * @param {string} token - Bearer token
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of suggestions per page (default: 10)
 * @returns {Promise} - Response with suggested users
 */
export const getFollowSuggestionsService = async (
  token,
  page = 1,
  limit = 10,
) => {
  return await axios.get(`${BaseURL}/users/suggestions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
};

/**
 * Follow or unfollow a user
 * @param {string} token - Bearer token
 * @param {string} userId - ID of user to follow/unfollow
 * @returns {Promise} - Response with follow status
 */
export const followUserService = async (token, userId) => {
  return await axios.put(
    `${BaseURL}/users/${userId}/follow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

/**
 * Fetch user profile data
 * @param {string} token - Bearer token
 * @param {string} userId - ID of user to fetch profile for
 * @returns {Promise} - Response with user profile data
 */
export const getUserProfileService = async (token, userId) => {
  return await axios.get(`${BaseURL}/users/${userId}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Fetch posts from a specific user
 * @param {string} token - Bearer token
 * @param {string} userId - ID of user whose posts to fetch
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of posts per page (default: 10)
 * @returns {Promise} - Response with user's posts
 */
export const getUserPostsService = async (
  token,
  userId,
  page = 1,
  limit = 10,
) => {
  return await axios.get(`${BaseURL}/users/${userId}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: page,
      limit: limit,
    },
  });
};
