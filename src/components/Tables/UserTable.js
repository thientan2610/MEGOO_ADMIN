import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// bootstrap
import {
  Image,
  Badge,
  Dropdown,
  ListGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faLock,
  faTrash,
  faTrashArrowUp,
  faAddressCard,
  faEnvelope,
  faPhoneAlt,
  faCakeCandles,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";

// data
import {
  createAccount,
  formatShortDate,
  getAllUsers,
} from "store/requests/user";

// project import
import Modals from "components/Modal";
import ModalForm from "components/Forms/ModalForm";
import { removeUser, restoreUser } from "store/requests/user";
import Alerts from "components/Alerts";

// third party
import * as Yup from "yup";
import { HttpStatusCode } from "axios";
import IndeterminateCheckbox from "./BSTable/IndeterminateCheckbox";
// import { reinitializeState } from "store/reducers/user";
import DataTable from "components/Tables/BSTable";
import Filter from "./BSTable/FilterFunction";

const UserTable = () => {
  const dispatch = useDispatch();
  // dispatch(reinitializeState());
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.auth.login);
  const { userInfo } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState({
    alertVariant: "danger",
    alertClass: "fixed-top mx-auto",
  });
  const [addAction, setAddAction] = useState(false);
  const [selected, setSelected] = useState();
  const phoneRegExp = /(\+84|84|0)+([3|5|7|8|9])+([0-9]{8})\b/;

  function onRowClick(data) {
    navigate(`/users/${data._id}`);
  }
  useEffect(() => {
    getAllUsers(dispatch, currentUser?.accessToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  const handleClose = () => {
    setShowModal(false);
    setAddAction(false);
  };
  const handleAlert = (title, content, variant) => {
    setTitle(title);
    setContent(content);
    setClasses({
      alertVariant: variant,
      alertClass: "fixed-top mx-auto",
    });
  };
  const handleAction = useCallback((row, action) => {
    if (typeof action === "object") {
      const valuesArray = Object.values(action);
      action = valuesArray.join("").trim();
    }
    setAction(action);
    setSelected(row);
    if (action === "remove") {
      setContent(`Bạn có chắc chắn muốn xóa tài khoản này?`);
    } else if (action === "restore") {
      setContent(`Bạn có chắc chắn muốn khôi phục tài khoản này?`);
    } else {
      setContent(`Bạn có chắc chắn muốn khóa tài khoản này?`);
    }
    setShowModal(true);
  }, []);
  const handleSubmitModalForm = async (values) => {
    let formData = {
      username: values.email,
      password: values.password,
      email: values.email,
      name: values.name,
      role: "admin",
    };
    if (values.phone) formData.phone = values.phone;
    if (values.dob) formData.dob = values.dob;
    const res = await createAccount(
      currentUser?.accessToken,
      formData,
      dispatch
    );
    if (res?.statusCode === HttpStatusCode.Created) {
      handleClose();
      handleAlert("Thành công", "Tạo tài khoản thành công", "success");
    } else {
      handleAlert("Thất bại", res?.message, "danger");
    }

    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };
  const handleConfirm = async () => {
    setShowModal(false);
    let res;
    let error = false;
    if (action === "remove") {
      res = await removeUser(selected._id, currentUser?.accessToken, dispatch);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Xóa tài khoản thành công", "success");
      } else error = true;
    } else if (action === "restore") {
      res = await restoreUser(selected._id, currentUser?.accessToken, dispatch);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Khôi phục tài khoản thành công", "success");
      } else error = true;
    }
    if (error) {
      handleAlert("Thất bại", res.message, "danger");
      error = false;
    }
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };
  const handleAddAction = () => setAddAction(true);
  const handleShowAlert = (title, content, variant) => {
    handleAlert(title, content, variant);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };
  const schema = Yup.object().shape({
    name: Yup.string().max(255).required("Bắt buộc"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .max(255)
      .required("Bắt buộc"),
    phone: Yup.string()
      .min(0)
      .matches(phoneRegExp, "Số điện thoại không hợp lệ")
      .nullable(true),
    password: Yup.string().max(255).required("Bắt buộc"),
  });

  const initValues = {
    name: "",
    dob: "",
    phone: "",
    email: "",
    password: "",
    submit: null,
  };

  // icons
  const icons = {
    faAddressCard,
    faEnvelope,
    faPhoneAlt,
  };

  const addForm = [
    {
      title: "Họ & Tên",
      icon: icons.faAddressCard,
      name: "name",
      type: "text",
      placeholder: "Nhập họ và tên",
      classes: { formGroup: "mb-4", formControl: "input-out-button-group" },
      required: true,
      _Type: "simple",
    },
    {
      title: "Email",
      icon: icons.faEnvelope,
      name: "email",
      type: "email",
      placeholder: "Nhập email",
      classes: { formGroup: "mb-4", formControl: "input-out-button-group" },
      required: true,
      _Type: "simple",
    },
    {
      title: "Ngày sinh",
      name: "dob",
      classes: { formGroup: "mb-4", formControl: "input-out-button-group" },
      _Type: "date",
    },
    {
      title: "Số điện thoại",
      icon: icons.faPhoneAlt,
      name: "phone",
      type: "text",
      placeholder: "Nhập số điện thoại",
      classes: { formGroup: "mb-4", formControl: "input-out-button-group" },
      _Type: "simple",
    },
    {
      title: "Mật khẩu",
      name: "password",
      classes: {
        formGroup: "mb-4",
        formControl: "input-button-group",
      },
      checkStrength: true,
      _Type: "password",
    },
  ];
  const columns = useMemo(
    () => [
      {
        accessorKey: "select",
        classes: "text-center",
        enableSorting: false,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        showFooter: true,
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      {
        header: "Mã",
        accessorKey: "_id",
        enableColumnFilter: false,
        hide: true,
      },
      {
        accessorKey: "deleted",
        header: null,
        cell: ({ row }) => <span>{row.original.deleted}</span>,
      },
      {
        header: null,
        accessorKey: "avatar",
        enableGlobalFilter: false,
        enableColumnFilter: false,
        enableSorting: false,
        style: { width: "1.5rem" },
        cell: ({ row }) => (
          <Image
            src={row.original.avatar}
            className="user-avatar shadow "
            roundedCircle
            alt={row._id}
          />
        ),
      },
      {
        header: "Họ & Tên",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Ngày sinh",
        accessorKey: "dob",
        cell: ({ row }) => (
          <>
            {row.original.phone && (
              <span>
                <FontAwesomeIcon icon={faCakeCandles} />{" "}
                {formatShortDate(row.original.dob)}
              </span>
            )}
          </>
        ),
        enableColumnFilter: false,
        hide: true,
      },
      {
        header: "Số điện thoại",
        accessorKey: "phone",
        cell: ({ row }) => (
          <>
            {row.original.phone && (
              <span>
                <FontAwesomeIcon icon={faPhoneAlt} /> {row.original.phone}
              </span>
            )}
          </>
        ),
        enableColumnFilter: false,
        hide: true,
      },
      {
        header: "Quyền",
        accessorKey: "role",
        cell: ({ row }) => (
          <Badge
            pill
            bg={row.original.role === "admin" ? "primary" : "quaternary"}
            style={{ width: "3.5rem" }}
            className="tag"
          >
            {row.original.role === "admin" ? "Admin" : "User"}
          </Badge>
        ),
      },
      {
        header: "Ngày lập",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        hide: true,
        cell: ({ row }) => (
          <span>
            <FontAwesomeIcon icon={faClock} /> {row.original.createdAt}
          </span>
        ),
      },
      {
        header: "Cập nhật",
        accessorKey: "updatedAt",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span>
            <FontAwesomeIcon icon={faClock} /> {row.original.updatedAt}
          </span>
        ),
      },
      {
        header: null,
        accessorKey: "actions",
        enableColumnFilter: false,
        classes: "text-center",
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => {
          return (
            <Dropdown>
              <Dropdown.Toggle
                className="text-dark me-lg-1 dropdown-table-option"
                id="dropdown-autoclose-true"
              >
                <span className="icon icon-sm m-0">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="notifications-dropdown shadow rounded-3 mt-2 py-0 ">
                <ListGroup className="list-group-flush">
                  <Dropdown.Item
                    className="text-start text-dark py-3"
                    onClick={(e) => onRowClick(row.original)}
                  >
                    <FontAwesomeIcon icon={faPen} /> Chỉnh sửa
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-start text-dark py-3"
                    onClick={(e) =>
                      handleAction(row.original, {
                        ...(row.original.deleted ? "restore" : " remove"),
                      })
                    }
                  >
                    {row.original.deleted ? (
                      <>
                        <FontAwesomeIcon icon={faTrashArrowUp} /> Khôi phục tài
                        khoản
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faTrash} /> Xóa tài khoản
                      </>
                    )}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-start text-dark py-3"
                    onClick={(e) => handleAction(row.original)}
                  >
                    <FontAwesomeIcon icon={faLock} /> Khóa tài khoản
                  </Dropdown.Item>
                </ListGroup>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    [handleAction]
  );
  return (
    <Container>
      <Alerts
        show={showAlert}
        handleClose={handleClose}
        title={title}
        classes={classes}
      >
        {content}
      </Alerts>
      <Modals
        title="Xác nhận"
        show={showModal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      >
        {selected && <h6>{content}</h6>}
      </Modals>
      <ModalForm
        title="Thêm tài khoản"
        show={addAction}
        handleClose={handleClose}
        schema={schema}
        initValues={initValues}
        forms={addForm}
        handleSubmit={handleSubmitModalForm}
        handleAlert={handleShowAlert}
      />
      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-table-cell">
          <DataTable
            data={userInfo.filter(
              (user) => user._id !== currentUser?.data.auth?.userInfoId
            )}
            columns={columns}
            classes={{ table: "mx-auto align-middle" }}
            title="Tài khoản"
            handleAdd={handleAddAction}
            onRowClick={onRowClick}
            titleAdd="Thêm tài khoản"
          />
        </Col>
      </Row>
    </Container>
  );
};
export default UserTable;
// Then, use it in a component.
