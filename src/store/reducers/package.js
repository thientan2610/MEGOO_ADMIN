import { createSlice } from "@reduxjs/toolkit";

const packages = createSlice({
  name: "packages",
  initialState: {
    packages: [],
    countTxn: 0,
    countDeletedTxn: 0,
    countWithDeletedTxn: 0,
    txnByMonth: {},
    txnByYear: {},
    totalRevenue: 0,
    revenueByMonth: {},
    revenueByYear: {},
    statisticTxn: [],
    pkgByMonth: [],
    pkgByYear: [],
    period: { min: null, max: null },
    ratio: { trans: null, revenue: null },
  },
  reducers: {
    reinitializeState: (state) => {
      return {
        packages: [],
        countTxn: 0,
        countDeletedTxn: 0,
        countWithDeletedTxn: 0,
        txnByMonth: {},
        txnByYear: {},
        totalRevenue: 0,
        revenueByMonth: {},
        revenueByYear: {},
        statisticTxn: [],
        pkgByMonth: [],
        pkgByYear: [],
        period: { min: null, max: null },
        ratio: { trans: null, revenue: null },
      }; // Return the initial state to reinitialize
    },
    setInitPackage: (state, action) => {
      state.packages = action.payload;
    },
    setCounter: (state, action) => {
      const {
        countTxn,
        countDeletedTxn,
        countWithDeletedTxn,
        txnByMonth,
        txnByYear,
        totalRevenue,
        revenueByMonth,
        revenueByYear,
        statisticTxn,
        pkgByMonth,
        pkgByYear,
        period,
        ratio,
      } = action.payload;
      state.countTxn = countTxn;
      state.countDeletedTxn = countDeletedTxn;
      state.countWithDeletedTxn = countWithDeletedTxn;
      state.txnByMonth = txnByMonth;
      state.txnByYear = txnByYear;
      state.totalRevenue = totalRevenue;
      state.revenueByMonth = revenueByMonth;
      state.revenueByYear = revenueByYear;
      state.statisticTxn = statisticTxn;
      state.pkgByMonth = pkgByMonth;
      state.pkgByYear = pkgByYear;
      state.period = period;
      state.ratio = ratio;
    },
  },
});

export const { setInitPackage, setCounter, reinitializeState } =
  packages.actions;

export default packages.reducer;
