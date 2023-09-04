import apiClient from "./http-common.js";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { refeshToken } from "store/requests/auth.js";

export const createAxios = (user, dispatch) => {
  const newInstance = apiClient.create();
  newInstance.interceptors.request.use(
    async (config) => {
      const navigate = useNavigate();
      const decodedToken = jwtDecode(user?.accessToken);
      if (decodedToken.exp < new Date().setTime() / 1000) {
        const data = await refeshToken(user, dispatch, navigate);
        config.headers["token"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return newInstance;
};
