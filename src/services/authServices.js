import axios from "axios";
const BaseURL = import.meta.env.VITE_BASE_URL;
const registerEndPoint = "/users/signup";
const loginEndPoint = "/users/signin";
const userProfileEndPoint = "/users/profile-data";

export const registerService = async (body) => {
  const response = axios.post(BaseURL + registerEndPoint, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};
export const loginService = async (body) => {
  const response = axios.post(BaseURL + loginEndPoint, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

export const getUserProfileService = async (token) => {
  const response = axios.get(BaseURL + userProfileEndPoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const changePasswordService = async (token, payload) => {
  const response = axios.patch(
    `${BaseURL}/users/change-password`,
    {
      password: payload.password,
      newPassword: payload.newPassword,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};
