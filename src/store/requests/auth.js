import apiClient from "http/http-common";
import {
  loginStart,
  loginSuccess,
  loginFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
} from "../reducers/auth";
import { HttpStatusCode } from "axios";

export const refeshToken = async (user, dispatch, navigate) => {
  try {
    const res = await apiClient.get("/auth/refresh", {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${user?.refreshToken}`,
      },
    });
    if (res?.data.statusCode === HttpStatusCode.Ok) {
      const refeshUser = {
        ...user,
        accessToken: res?.data.accessToken,
      };
      console.log("refresh", res?.data.accessToken);
      dispatch(loginSuccess(refeshUser));
      return res?.data;
    } else if (res?.data.statusCode === HttpStatusCode.Unauthorized) {
      navigate("/sessionExpired");
    }
  } catch (error) {
    console.log(error);
    navigate("/sessionExpired");
  }
};

export const loginUser = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await apiClient.post("/auth/login/mobile", user);
    const payload = {
      accessToken: res?.data.accessToken,
      refreshToken: res?.data.refreshToken,
      data: {
        auth: res?.data.data?.auth,
        userInfo: res?.data.data?.userInfo,
      },
    };
    dispatch(loginSuccess(payload));
    return res?.data;
  } catch (error) {
    dispatch(loginFailed(error.response.data));
    return error;
  }
};

export const logoutUser = async (user, dispatch, navigate) => {
  dispatch(logoutStart());
  try {
    const res = await apiClient.post(
      "auth/logout",
      {},
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${user?.refreshToken}`,
        },
      }
    );
    if (res?.data.statusCode === 200) {
      console.log("logout", res?.data);
      dispatch(logoutSuccess());
      navigate("/login");
    }
  } catch (error) {
    dispatch(logoutFailed());
  }
};
