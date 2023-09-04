import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user",
  initialState: {
    userInfo: [],
    trans: [],
    count: 0,
    countDeleted: 0,
    countWithDeleted: 0,
    countByMonth: [],
    period: { min: null, max: null },
    ratio: null,
  },
  reducers: {
    reinitializeState: () => {
      return {
        userInfo: [],
        trans: [],
        count: 0,
        countDeleted: 0,
        countWithDeleted: 0,
        countByMonth: [],
        period: { min: null, max: null },
        ratio: null,
      };
    },
    getInitUser: (state, action) => {
      state.userInfo = action.payload;
    },
    updateUser: (state, action) => {
      const { _id, cart } = action.payload;
      const index = state.userInfo.findIndex((item) => item._id === _id);
      if (index !== -1) {
        // Create a new array with the updated element
        const updatedData = [...state.userInfo];
        if (cart) {
          updatedData[index] = {
            ...updatedData[index],
            cart: cart,
          };
        }

        // Update the state with the new array
        return {
          ...state,
          userInfo: updatedData,
        };
      }
      return state;
    },
    getInitTrans: (state, action) => {
      state.trans = action.payload;
    },
    addUsers: (state, action) => {
      state.userInfo.push(action.payload);
    },
    setCounter: (state, action) => {
      const {
        count,
        countDeleted,
        countWithDeleted,
        countByMonth,
        period,
        ratio,
      } = action.payload;
      state.count = count;
      state.countDeleted = countDeleted;
      state.countWithDeleted = countWithDeleted;
      state.countByMonth = countByMonth;
      state.period = period;
      state.ratio = ratio;
    },
  },
});

export const {
  getInitUser,
  getInitTrans,
  setCounter,
  reinitializeState,
  addUsers,
  updateUser,
} = user.actions;

export default user.reducer;
