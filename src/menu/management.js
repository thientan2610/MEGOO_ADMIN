// assets
import {
  faUserGroup,
  faBoxes,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

// icons
const icons = { faUserGroup, faBoxes, faUsers };

// ==============================|| MENU - MANAGEMENT ||============================== //

const management = {
  id: "group-management",
  title: "Quản lý",
  type: "group",
  children: [
    {
      id: "userMgmt",
      title: "Người dùng",
      type: "item",
      url: "/users",
      icon: icons.faUserGroup,
      target: true,
    },
    {
      id: "packageMgmt",
      title: "Gói dịch vụ",
      type: "item",
      url: "/packages",
      icon: icons.faBoxes,
      target: true,
    },
    {
      id: "groupMgmt",
      title: "Nhóm",
      type: "item",
      url: "/groups",
      icon: icons.faUsers,
      target: true,
    },
  ],
};

export default management;
