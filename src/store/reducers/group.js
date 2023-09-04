import { createSlice } from "@reduxjs/toolkit";

const group = createSlice({
  name: "group",
  initialState: { groups: [] },

  reducers: {
    reinitializeState: (state) => {
      return { groups: [] }; // Return the initial state to reinitialize
    },
    setInitGroups: (state, action) => {
      state.groups = action.payload;
    },
    addGroups: (state, action) => {
      state.groups.push(action.payload);
    },
    updateGroups: (state, action) => {
      const { _id, name, avatar, packages, members } = action.payload;
      const index = state.groups.findIndex((item) => item._id === _id);
      if (index !== -1) {
        // Create a new array with the updated element
        const updatedData = [...state.groups];
        if (name) {
          updatedData[index] = {
            ...updatedData[index],
            name: name,
          };
        }
        if (avatar) {
          updatedData[index] = {
            ...updatedData[index],
            avatar: avatar,
          };
        }
        if (packages) {
          updatedData[index] = {
            ...updatedData[index],
            packages: packages,
          };
        }
        if (members) {
          updatedData[index] = {
            ...updatedData[index],
            members: members,
          };
        }

        // Update the state with the new array
        return {
          ...state,
          groups: updatedData,
        };
      }
      return state;
    },
    restoreGroups: (state, action) => {
      const { _id, deletedAt, deleted } = action.payload;
      const index = state.groups.findIndex((item) => item._id === _id);
      if (index !== -1) {
        // Create a new array with the updated element
        const updatedData = [...state.groups];
        updatedData[index] = {
          ...updatedData[index],
          deleted: deleted,
          deletedAt: deletedAt,
        };

        // Update the state with the new array
        return {
          ...state,
          groups: updatedData,
        };
      }
      return state;
    },
  },
});

export const {
  setInitGroups,
  reinitializeState,
  restoreGroups,
  addGroups,
  updateGroups,
} = group.actions;

export default group.reducer;
