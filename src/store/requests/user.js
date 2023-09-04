import apiClient from "http/http-common";
import {
  getInitUser,
  getInitTrans,
  setCounter,
  updateUser,
} from "../reducers/user";
import { setUserInfo } from "store/reducers/auth";
import { HttpStatusCode } from "axios";

export const getCartById = async (id, token) => {
  try {
    const res = await apiClient.get(`/users/${id}/cart`, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return res?.data.cart;
  } catch (error) {
    console.error(error);
  }
};
export const updateCart = async (id, token, data, dispatch) => {
  try {
    console.log("update cart", data);
    const res = await apiClient.put(`/users/${id}/cart`, data.req, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res?.data.statusCode === HttpStatusCode.Ok) {
      const payload = {
        _id: id,
        cart: data.res,
      };
      dispatch(updateUser(payload));
    }
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllUsers = async (dispatch, token) => {
  try {
    const res = await apiClient.get(`/users/all`);
    let dataUser = [];
    for (let item of res?.data) {
      let cart = await getCartById(item._id, token);
      item.cart = cart;
      item.updatedAt = formatDate(item.updatedAt);
      item.createdAt = formatDate(item.createdAt);
      item.deletedAt = formatDate(item.deletedAt);
      dataUser.push(item);
    }
    console.log("get all users", res?.data);
    dispatch(getInitUser(dataUser));
  } catch (error) {
    console.error(error);
  }
};

export const getUserById = async (userID, token, dispatch) => {
  try {
    const res = await apiClient.get(`/users/${userID}`, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setUserInfo(res?.data.user));
  } catch (error) {
    console.error(error);
  }
};

export const getAllTrans = async (dispatch) => {
  try {
    const res = await apiClient.get("/txn");
    let dataTrans = [];
    for (let item of res.data.data) {
      item["amount_vnd"] = formatCurrency(item.amount);
      item.item = item.item.map((i) => {
        i["price_vnd"] = formatCurrency(i.price);
        return i;
      });
      item["wallet"] = item.method.name;
      item.updatedAt = formatDate(item.updatedAt);
      item.createdAt = formatDatetime(item.createdAt);
      dataTrans.push(item);
    }
    dispatch(getInitTrans(dataTrans));
  } catch (error) {
    console.error(error);
  }
};

export const uploadFile = async (id, token, file) => {
  try {
    const res = await apiClient.post(`/file/upload-user-avatar/${id}`, file, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload File", res?.data);
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateAvatarUser = async (userID, token, data, dispatch) => {
  try {
    console.log("Upload User's avatar", data);
    const res = await apiClient.post(`/users/${userID}/avatar`, data, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    await getAllUsers(dispatch, token);
    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateInfoUser = async (userID, token, user, dispatch) => {
  try {
    const res = await apiClient.put(`/users/${userID}`, user, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    await getAllUsers(dispatch, token);

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};

export const removeUser = async (userID, token, dispatch) => {
  try {
    const res = await apiClient.delete(`/users/${userID}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await getAllUsers(dispatch, token);

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};

export const restoreUser = async (userID, token, dispatch) => {
  try {
    const res = await apiClient.patch(
      `/users/${userID}`,
      {},
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await getAllUsers(dispatch, token);

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};

export const statistic = async (dispatch) => {
  try {
    const res = await apiClient.get(`/users/statistic`);
    const currentDate = new Date();
    const currentMonthData = res?.data.data?.countByMonth.find(
      (item) =>
        item._id.year === currentDate.getFullYear() &&
        item._id.month === currentDate.getMonth() + 1
    );
    const lastMonthData = res?.data.data?.countByMonth.find(
      (item) =>
        item._id.year === currentDate.getFullYear() &&
        item._id.month === currentDate.getMonth()
    );
    const discrepancy = currentMonthData.count - lastMonthData.count;
    const payload = {
      count: res?.data.data?.count,
      countDeleted: res?.data.data?.countDeleted,
      countWithDeleted: res?.data.data?.countWithDeleted,
      countByMonth: res?.data.data?.countByMonth,
      period: {
        min: formatShortDate(res?.data.data?.period[0].minCreatedAt),
        max: formatShortDate(res?.data.data?.period[0].maxCreatedAt),
      },
      ratio: lastMonthData ? (discrepancy / lastMonthData.count) * 100 : null,
    };
    dispatch(setCounter(payload));
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export const createAccount = async (token, data, dispatch) => {
  try {
    console.log("create account", data);
    const res = await apiClient.post("/auth/register-admin", data, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    await getAllUsers(dispatch, token);
    console.log(res?.data);
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

export function formatDate(dateISO) {
  return new Date(dateISO).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
export function formatShortDate(dateISO) {
  return new Date(dateISO).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
export function formatMonthYear(dateISO) {
  return new Date(dateISO).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
  });
}
export function formatDatetime(dateISO) {
  return new Date(dateISO).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function formatCurrency(total) {
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return VND.format(total);
}
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
