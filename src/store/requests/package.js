import apiClient from "http/http-common";

import { formatDate, formatCurrency } from "./user.js";
import { setCounter, setInitPackage } from "store/reducers/package.js";
import { mapToYearTotal } from "components/Charts/RevenueChart.js";
import { mapToYearCount } from "components/Charts/TransactionChart.js";

export const getAllPackages = async (dispatch) => {
  try {
    const res = await apiClient.get("/pkg-mgmt/pkg/all");
    let dataPackage = [];
    for (let item of res.data) {
      item["coefficient_vnd"] = item.coefficient
        ? formatCurrency(item.coefficient)
        : null;
      item["price_vnd"] = formatCurrency(item.price);
      item.updatedAt = formatDate(item.updatedAt);
      item.createdAt = formatDate(item.createdAt);
      item.description = item.description.split(/[\r\n]+/);
      dataPackage.push(item);
    }
    console.log(dataPackage);
    dispatch(setInitPackage(dataPackage));
  } catch (error) {
    console.error(error);
  }
};
export const createPackage = async (newPackage, dispatch) => {
  try {
    const res = await apiClient.post(`pkg-mgmt/pkg`, newPackage);

    await getAllPackages(dispatch);

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const updatePackage = async (newPackage, dispatch, pkgId) => {
  try {
    const res = await apiClient.put(`pkg-mgmt/pkg/${pkgId}`, newPackage);

    await getAllPackages(dispatch);

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const removePackage = async (pkgId, dispatch) => {
  try {
    const res = await apiClient.delete(`pkg-mgmt/pkg/${pkgId}`);

    await getAllPackages(dispatch);

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const restorePackage = async (pkgId, dispatch) => {
  try {
    const res = await apiClient.patch(`pkg-mgmt/pkg/${pkgId}`);

    await getAllPackages(dispatch);

    return res?.data;
  } catch (error) {
    return error.response.data;
  }
};
export const statisticTrans = async (dispatch) => {
  try {
    const res = await apiClient.get("/txn/statistic");
    const yearTxn = mapToYearCount(res?.data.data?.statisticTrans);
    const yearTotal = mapToYearTotal(res?.data.data?.statisticTrans);
    const revenue =
      yearTotal[10][1] === 0
        ? (
            ((yearTotal[11][1] - yearTotal[10][1]) / yearTotal[10][1]) *
            100
          ).toFixed(2)
        : null;
    const trans =
      yearTxn[10][1] === 0
        ? (((yearTxn[11][1] - yearTxn[10][1]) / yearTxn[10][1]) * 100).toFixed(
            2
          )
        : null;
    const payload = {
      countTxn: res?.data.data?.countTxn,
      countDeletedTxn: res?.data.data?.countDeletedTxn,
      countWithDeletedTxn: res?.data.data?.countWithDeletedTxn,
      txnByMonth: yearTxn[11][1],
      txnByYear: sumDataSeries(yearTxn),
      totalRevenue: res?.data.data?.totalRevenue,
      revenueByMonth: yearTotal[11][1],
      revenueByYear: sumDataSeries(yearTotal),
      statisticTxn: res?.data.data?.statisticTrans,
      pkgByMonth: res?.data.data?.pkgByMonth,
      pkgByYear: res?.data.data?.pkgByYear,
      period: res?.data.data?.period,
      ratio: { trans: trans, revenue: revenue },
    };

    console.log("statistic transaction", payload);
    dispatch(setCounter(payload));
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};

const sumDataSeries = (data) => {
  let sum = 0;
  for (const item of data) {
    sum += item[1];
  }
  return sum;
};
