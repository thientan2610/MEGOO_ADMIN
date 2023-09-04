// third-party
import { combineReducers } from "redux";

// project import
import menu from "./menu";
import user from "./user";
import auth from "./auth";
import packages from "./package";
import group from "./group";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, user, auth, packages, group });

export default reducers;
