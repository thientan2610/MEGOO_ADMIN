import { formatDate, formatCurrency, formatDatetime } from "./user";
import {
  setInitGroups,
  restoreGroups,
  addGroups,
  updateGroups,
} from "store/reducers/group.js";
import apiClient from "http/http-common";

export const getAllGroups = async (dispatch) => {
  try {
    const queryParams = {
      page: 0,
      limit: 100,
      sort: "-createdAt",
    };
    const res = await apiClient.get("/pkg-mgmt/gr/all", {
      params: queryParams,
    });
    let dataGroup = [];
    for (let item of res.data?.groups) {
      item.billing = item.billing.map((elem) => {
        elem.date = formatDate(elem.date);
        elem.total = formatCurrency(elem.total);
        elem.createdAt = formatDate(elem.createdAt);
        elem.updatedAt = formatDate(elem.updatedAt);
        elem.borrowers = elem.borrowers.map((ele) => {
          ele.amount = formatCurrency(ele.amount);
          return ele;
        });
        return elem;
      });
      item.todos = item.todos.map((elem) => {
        elem.createdAt = formatDate(elem.createdAt);
        elem.updatedAt = formatDate(elem.updatedAt);
        return elem;
      });
      item.task = item.task.map((elem) => {
        elem.startDate = formatDatetime(elem.startDate);
        elem.createdAt = formatDate(elem.createdAt);
        elem.updatedAt = formatDate(elem.updatedAt);
        if (elem.recurrence) {
          const { ends } = elem.recurrence;
          elem.recurrence.ends = isISO8601Date(ends)
            ? formatDatetime(ends)
            : ends;
        }
        return elem;
      });
      item["status"] = GroupStatusEn_Vn(setGroupStatus(item.packages));
      item.updatedAt = formatDate(item.updatedAt);
      item.createdAt = formatDate(item.createdAt);
      item.deletedAt = formatDate(item.deletedAt);
      dataGroup.push(item);
    }
    console.log("groups", dataGroup);

    dispatch(setInitGroups(dataGroup));
  } catch (error) {
    console.error(error);
  }
};
export const restoreGroup = async (grId, dispatch) => {
  try {
    const res = await apiClient.patch(`pkg-mgmt/gr/${grId}`);
    const payload = {
      _id: res?.data.data?._id,
      deleted: res?.data.data?.deleted,
      deletedAt: formatDate(res?.data.data?.deletedAt),
    };
    dispatch(restoreGroups(payload));

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const removeGroup = async (grId, dispatch) => {
  try {
    const res = await apiClient.delete(`pkg-mgmt/gr/${grId}`);

    const payload = {
      _id: res?.data.data?._id,
      deleted: res?.data.data?.deleted,
      deletedAt: formatDate(res?.data.data?.deletedAt),
    };
    dispatch(restoreGroups(payload));

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const getGroupById = async (grId) => {
  try {
    const res = await apiClient.get(`pkg-mgmt/gr/${grId}`);
    if (res?.data.statusCode !== 200) {
      console.error(res?.data.message);
    }
    let item = res?.data.group;
    if (item) {
      item.billing = item.billing.map((elem) => {
        elem.date = formatDate(elem.date);
        elem.total = formatCurrency(elem.total);
        elem.createdAt = formatDate(elem.createdAt);
        elem.updatedAt = formatDate(elem.updatedAt);
        elem.borrowers = elem.borrowers.map((ele) => {
          ele.amount = formatCurrency(ele.amount);
          return ele;
        });
        return elem;
      });
      item.todos = item.todos.map((elem) => {
        elem.createdAt = formatDate(elem.createdAt);
        elem.updatedAt = formatDate(elem.updatedAt);
        return elem;
      });
      item.task = item.task.map((elem) => {
        elem.startDate = formatDatetime(elem.startDate);
        elem.createdAt = formatDate(elem.createdAt);
        elem.updatedAt = formatDate(elem.updatedAt);
        if (elem.recurrence) {
          const { ends } = elem.recurrence;
          elem.recurrence.ends = isISO8601Date(ends)
            ? formatDatetime(ends)
            : ends;
        }
        return elem;
      });
      item["status"] = GroupStatusEn_Vn(setGroupStatus(item.packages));
      item.updatedAt = formatDate(item.updatedAt);
      item.createdAt = formatDate(item.createdAt);
      item.deletedAt = formatDate(item.deletedAt);
    }
    console.log("group_by_id", item);
    return item;
  } catch (error) {
    console.error(error.response.data);
  }
};
export const createGroup = async (gr, dispatch) => {
  try {
    const res = await apiClient.post(`pkg-mgmt/gr`, gr);
    const group = await getGroupById(res.data.data?.at(0)._id);
    if (group) {
      dispatch(addGroups(group));
    }

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const updateGroup = async (id, token, data, dispatch) => {
  try {
    const res = await apiClient.put(`pkg-mgmt/gr/${id}`, data, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res?.data.statusCode === 200) {
      const payload = {
        _id: res?.data.data?._id,
        name: res?.data.data?.name,
        avatar: null,
        packages: null,
        members: null,
      };
      dispatch(updateGroups(payload));
    }

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const uploadFile = async (id, token, file) => {
  try {
    const res = await apiClient.post(`/file/upload-gr-avatar/${id}`, file, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};
export const updateAvatar = async (id, token, data, dispatch) => {
  try {
    const res = await apiClient.post(`pkg-mgmt/gr/${id}/avatar`, data, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res?.data.statusCode === 200) {
      const payload = {
        _id: id,
        name: null,
        avatar: res?.data.data?.avatar,
        packages: null,
        members: null,
      };
      dispatch(updateGroups(payload));
    }

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const activateGroup = async (id, token, data, dispatch) => {
  try {
    const res = await apiClient.post(`pkg-mgmt/gr/${id}/activate`, data, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res?.data.statusCode === 200) {
      const data = await getGroupById(id);
      const payload = {
        _id: id,
        name: null,
        avatar: null,
        packages: data?.packages,
        members: null,
      };
      dispatch(updateGroups(payload));
    }

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const addMemb = async (id, token, data, dispatch) => {
  try {
    const res = await apiClient.put(`pkg-mgmt/gr/${id}/memb`, data, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res?.data.statusCode === 200) {
      const data = await getGroupById(id);
      const payload = {
        _id: res?.data.data?._id,
        name: null,
        avatar: null,
        packages: null,
        members: data?.members,
      };
      dispatch(updateGroups(payload));
    }

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const rmMemb = async (id, data, dispatch) => {
  try {
    const res = await apiClient.delete(`pkg-mgmt/gr/${id}/memb`, {
      data: data,
    });
    if (res?.data.statusCode === 200) {
      const data = await getGroupById(id);
      const payload = {
        _id: res?.data.data?._id,
        name: null,
        avatar: null,
        packages: null,
        members: data?.members,
      };
      dispatch(updateGroups(payload));
    }

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const isISO8601Date = (str) => {
  const isoDateRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/;
  return isoDateRegex.test(str);
};
const setGroupStatus = (packages) => {
  let flag = false;
  for (const elem of packages) {
    if (elem.status === "Active") return elem.status;
    if (elem.status === "Not Activated") flag = true;
  }
  if (flag) return "Not Activated";
  else return "Expired";
};
const GroupStatusEn_Vn = (status) => {
  if (status === "Active") return "Đang kích hoạt";
  if (status === "Expired") return "Đã hết hạn";
  return "Chưa kích hoạt";
};
function convertToDate(dateString) {
  // Tách thành phần của ngày và thời gian từ chuỗi
  const dateParts = dateString.split(", ")[1].split(" ");
  const timeParts = dateString.split(" ")[0].split(":");

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[2], 10);
  const year = parseInt(dateString.split(", ")[2], 10);
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  // Tạo đối tượng Date
  const date = new Date(year, month, day, hours, minutes);
  return date;
}

export function getDifferenceInDays(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // Một ngày tính bằng mili giây
  return Math.round(Math.abs((date1 - date2) / oneDay));
}

function findNearestDate(data, key) {
  const currentDate = new Date();
  let nearestObject = null;
  let nearestDiff = Infinity;

  data.forEach((item) => {
    const startDate = convertToDate(item[key]);
    const diff = getDifferenceInDays(startDate, currentDate);

    if (diff < nearestDiff) {
      nearestDiff = diff;
      nearestObject = item;
    }
  });

  return nearestObject;
}
export const findMainPackage = (pkgs) => {
  if (pkgs.length === 1) return pkgs.at(0);
  const active = pkgs.filter((item) => item.status === "Active");
  if (active) return active.at(0);
  const notActive = pkgs.filter((item) => item.status === "Not Activated");
  if (notActive) {
    return findNearestDate(notActive, "startDate");
  }
  const exp = pkgs.filter((item) => item.status === "Expired");
  return findNearestDate(exp, "endDate");
};
