import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// bootstrap
import {
  Button,
  Container,
  Image,
  Stack,
  Popover,
  OverlayTrigger,
  Row,
  Col,
  Dropdown,
  ListGroup,
} from "react-bootstrap";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faTrashArrowUp,
  faCircleCheck,
  faCircleExclamation,
  faGripLines,
  faCircleXmark,
  faEllipsisVertical,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";

// data
import { getAllGroups } from "store/requests/group";
import { getAllPackages } from "store/requests/package";
import { getAllUsers } from "store/requests/user";

// project import
import Modals from "components/Modal";
import Alerts from "components/Alerts";
import { removeGroup, restoreGroup, createGroup } from "store/requests/group";
// import { reinitializeState } from "store/reducers/group";

// third party
import * as Yup from "yup";
import { HttpStatusCode } from "axios";
import { Link } from "react-router-dom";
import ModalForm from "components/Forms/ModalForm";
import IndeterminateCheckbox from "./BSTable/IndeterminateCheckbox";
import DataTable from "components/Tables/BSTable";

const GroupTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // dispatch(reinitializeState());
  const { groups } = useSelector((state) => state?.group);
  const { packages } = useSelector((state) => state?.packages);
  const { userInfo } = useSelector((state) => state?.user);
  const { currentUser } = useSelector((state) => state?.auth.login);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState();
  const [selected, setSelected] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [addAction, setAddAction] = useState(false);
  const [classes, setClasses] = useState({
    alertVariant: "danger",
    alertClass: "fixed-top mx-auto",
  });
  const initValues = {
    packages: null,
    duration: 1,
    noOfMember: 2,
    member: null,
    submit: null,
  };
  useEffect(() => {
    getAllGroups(dispatch);
    getAllUsers(dispatch, currentUser?.accessToken);
    getAllPackages(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  function onRowClick(data) {
    navigate(`/groups/${data._id}`);
  }
  const handleAction = useCallback((row, action) => {
    if (typeof action === "object") {
      const valuesArray = Object.values(action);
      action = valuesArray.join("").trim();
    }
    setAction(action);
    setSelected(row);
    if (action === "remove") {
      setContent(`Bạn có chắc chắn muốn xóa nhóm ${row.name}?`);
    } else if (action === "restore") {
      setContent(`Bạn có chắc chắn muốn khôi phục nhóm ${row.name}?`);
    }
    setShowModal(true);
  }, []);
  const handleConfirm = async () => {
    setShowModal(false);
    let res;
    let error = false;
    if (action === "remove") {
      res = await removeGroup(selected._id, dispatch);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Xóa nhóm thành công", "success");
      } else error = true;
    } else if (action === "restore") {
      res = await restoreGroup(selected._id, dispatch);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Khôi phục nhóm thành công", "success");
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
  const handleClose = () => {
    setShowModal(false);
    setShowAlert(false);
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
  const handleAddAction = () => setAddAction(true);
  const handleShowAlert = (title, content, variant) => {
    handleAlert(title, content, variant);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };
  const popover = ({ user }) => {
    return (
      <Popover id="popover-basic">
        <Popover.Header as="h3">Quản trị viên</Popover.Header>
        <Popover.Body>
          <Stack direction="horizontal">
            <Image
              src={user?.avatar}
              className="user-avatar lg-avatar shadow "
              roundedCircle
              alt={user?._id}
            />
            <div className="d-block ms-2">
              <h5 className="fw-bold">{user?.name}</h5>
              <h6 className="fw-normal">{user?.email}</h6>
            </div>
          </Stack>
        </Popover.Body>
      </Popover>
    );
  };
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
        header: "Tên nhóm",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Thành viên",
        accessorFn: (row) => `${row.members.length}`,
        classes: "text-center",
        enableColumnFilter: false,
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        cell: ({ row }) => (
          <>
            {row.original.status === "Đang kích hoạt" && (
              <span className="text-quaternary">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="icon icon-xs"
                />{" "}
                {row.original.status}
              </span>
            )}
            {row.original.status === "Chưa kích hoạt" && (
              <span className="text-primary">
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className="icon icon-xs"
                />{" "}
                {row.original.status}
              </span>
            )}
            {row.original.status === "Đã hết hạn" && (
              <span className="text-danger">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="icon icon-xs"
                />{" "}
                {row.original.status}
              </span>
            )}
          </>
        ),
      },
      {
        header: "Quản trị",
        accessorKey: "admin",
        enableSorting: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        disableRowClick: true,
        cell: ({ row }) => {
          const su = row.original.members.filter(
            (member) => member.role === "Super User"
          );
          return (
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={popover(su[0])}
            >
              <Stack direction="horizontal">
                <Image
                  src={su[0].user?.avatar}
                  className="user-avatar shadow "
                  roundedCircle
                  alt={row._id}
                />
                <Button
                  className="m-0 p-0 btn-table-options"
                  as={Link}
                  to={`/users/${su[0].user._id}`}
                >
                  <FontAwesomeIcon icon={faGripLines} className="ps-2" />
                </Button>
              </Stack>
            </OverlayTrigger>
          );
        },
      },
      {
        accessorKey: "deleted",
        header: null,
        cell: ({ row }) => <span>{row.original.deleted}</span>,
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
                        <FontAwesomeIcon icon={faTrashArrowUp} /> Khôi phục
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faTrash} /> Xóa
                      </>
                    )}
                  </Dropdown.Item>
                </ListGroup>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    [handleAction, onRowClick]
  );
  const schema = Yup.object().shape({
    packages: Yup.object().required("Bắt buộc"),
    duration: Yup.number()
      .min(1, "Tối thiểu 1 tháng")
      .max(36, "Tối đa 36 tháng")
      .required("Bắt buộc"),
    noOfMember: Yup.number()
      .min(2, "Tối thiểu 2 thành viên")
      .max(30, "Tối đa 30 thành viên")
      .required("Bắt buộc"),
    member: Yup.string().max(255).required("Bắt buộc"),
  });
  const addForm = [
    {
      title: "Gói dịch vụ",
      data: { packages: packages },
      _Type: "packages-autocomplete",
    },
    {
      title: "Quản trị viên",
      data: userInfo,
      name: "member",
      _Type: "users-autocomplete",
    },
  ];
  const handleAddConfirm = async (values) => {
    let formData = {
      packages: [
        {
          _id: values.packages._id,
          duration: values.duration,
          noOfMember: values.noOfMember,
          quantity: 1,
        },
      ],
      member: {
        user: values.member,
      },
    };
    const res = await createGroup(formData, dispatch);
    if (res.statusCode === HttpStatusCode.Created) {
      handleClose();
      handleAlert("Thành công", "Tạo nhóm thành công", "success");
    } else {
      handleAlert("Thất bại", res.message, "danger");
    }
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };
  return (
    <Container>
      <ModalForm
        show={addAction}
        title="Nhóm"
        handleClose={handleClose}
        handleSubmit={handleAddConfirm}
        handleAlert={handleShowAlert}
        schema={schema}
        initValues={initValues}
        forms={addForm}
      />
      <Modals
        title="Xác nhận"
        show={showModal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      >
        {selected && <h6>{content}</h6>}
      </Modals>
      <Alerts
        show={showAlert}
        handleClose={handleClose}
        title={title}
        classes={classes}
      >
        {content}
      </Alerts>
      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-table-cell">
          <DataTable
            data={groups}
            columns={columns}
            classes={{ table: "mx-auto align-middle" }}
            title="Nhóm"
            // emptyItem={{ label: "Giỏ hàng trống", icon: faShoppingBasket }}
            // handleBulkRemove={onBulkRemove}
            handleAdd={handleAddAction}
            onRowClick={onRowClick}
            titleAdd="Thêm nhóm"
          />
        </Col>
      </Row>
    </Container>
  );
};
export default GroupTable;
