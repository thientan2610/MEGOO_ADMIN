import { Breadcrumb } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const Breadcrumbs = ({ navigation, title, ...others }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState();

  const getCollapse = (menu) => {
    if (menu.children) {
      menu.children.filter((collapse) => {
        // if (collapse.type && collapse.type === "item") {
        if (location.pathname === collapse.url) {
          setItem(collapse);
        }
        // }
        // return false;
      });
    }
  };

  useEffect(() => {
    navigation?.items?.map((menu) => {
      if (menu.type && menu.type === "group") {
        getCollapse(menu);
      }
      return false;
    });
  });

  let itemContent;
  let breadcrumbContent;
  let itemTitle = "";

  if (item && item.type === "item") {
    itemTitle = item.title;
    if (id) {
      itemContent = [
        <Breadcrumb.Item
          onClick={() => {
            navigate(`${item.url}`);
          }}
        >
          {itemTitle}
        </Breadcrumb.Item>,
        <Breadcrumb.Item active>Chi tiết</Breadcrumb.Item>,
      ];
    } else itemContent = <Breadcrumb.Item active>{itemTitle}</Breadcrumb.Item>;

    // main
    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <Breadcrumb>
          <Breadcrumb.Item
            onClick={() => {
              navigate("/");
            }}
          >
            <FontAwesomeIcon icon={faHouse} />
          </Breadcrumb.Item>
          {itemContent}
        </Breadcrumb>
      );
    }
  }

  return breadcrumbContent;
};

Breadcrumbs.propTypes = {
  navigation: PropTypes.object,
  title: PropTypes.bool,
};

export default Breadcrumbs;
