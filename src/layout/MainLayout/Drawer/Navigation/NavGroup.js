import PropTypes from "prop-types";
import { useSelector } from "react-redux";

// project import
import NavItem from "./NavItem";

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  const navItems = item.children?.map((menuItem) => {
    return <NavItem key={menuItem.id} item={menuItem} />;
  });

  return (
    <>
      {item.title && drawerOpen && (
        <div className="sidebar-group title align-items-center row ps-4">
          {item.title}
        </div>
      )}
      {navItems}
    </>
  );
};

NavGroup.propTypes = { item: PropTypes.object };

export default NavGroup;
