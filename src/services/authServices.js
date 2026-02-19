import axios from "axios";
const BaseURL = import.meta.env.VITE_BASE_URL;
const registerEndPoint = "/users/signup";
const loginEndPoint = "/users/signin";


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

