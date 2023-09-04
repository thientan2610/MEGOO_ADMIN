import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { HttpStatusCode } from "axios";
import Countdown from "react-countdown";

// bootstrap
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  Container,
  OverlayTrigger,
  Tooltip,
  Image,
  Stack,
  Spinner,
} from "react-bootstrap";

// material-ui
import { TextField } from "@mui/material";

// assets
import {
  faBan,
  faTrash,
  faCameraAlt,
  faPen,
  faUser,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarCheck, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Alerts from "components/Alerts";
import Modals from "components/Modal";
import {
  removeGroup,
  restoreGroup,
  updateGroup,
  updateAvatar,
  uploadFile,
  activateGroup,
  findMainPackage,
} from "store/requests/group";
import { formatShortDate } from "store/requests/user";

const GroupInfoForm = ({ group }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.auth.login);
  const [avatar, setAvatar] = useState(group.avatar);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [action, setAction] = useState(null);
  const [values, setValues] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [packages, setPackages] = useState(findMainPackage(group.packages));
  const [countdown, setCountdown] = useState(
    packages.endDate && new Date(packages.endDate) - new Date() > 0
      ? Math.round(Math.abs(new Date(packages.endDate) - new Date()))
      : 0
  );
  const [classes, setClasses] = useState({
    alertVariant: "danger",
    alertClass: "fixed-top mx-auto",
  });
  useEffect(() => {
    setAvatar(group.avatar);
    setPackages(findMainPackage(group.packages));
  }, [group]);
  useEffect(() => {
    setCountdown(
      packages.endDate && new Date(packages.endDate) - new Date() > 0
        ? Math.round(Math.abs(new Date(packages.endDate) - new Date()))
        : 0
    );
  }, [packages]);

  const handleAlert = (title, content, variant) => {
    setTitle(title);
    setContent(content);
    setClasses({
      alertVariant: variant,
      alertClass: "fixed-top mx-auto",
    });
  };
  const handleClose = () => {
    setShowAlert(false);
    setShowModal(false);
  };
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Tài khoản đã xóa vào {group.deletedAt}
    </Tooltip>
  );
  const handleConfirm = async () => {
    setShowModal(false);
    let res;
    let error = false;
    if (action === "remove") {
      res = await removeGroup(group._id, dispatch);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Xóa nhóm thành công", "success");
      } else error = true;
    } else if (action === "restore") {
      res = await restoreGroup(group._id, dispatch);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Khôi phục nhóm thành công", "success");
      } else error = true;
    } else if (action === "update") {
      let formData = { name: values.name };
      const res = await updateGroup(
        group._id,
        currentUser?.accessToken,
        formData,
        dispatch
      );
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Đổi tên nhóm thành công", "success");
      } else error = true;
    }
    if (error) {
      handleAlert("Thất bại", res.message, "danger");
      error = false;
    } else if (action === "activate") {
      let formData = {
        package: {
          _id: packages.package._id,
          duration: packages.package.duration,
          noOfMember: packages.package.noOfMember,
        },
      };
      const res = await activateGroup(
        group._id,
        currentUser?.accessToken,
        formData,
        dispatch
      );
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Kích hoạt nhóm thành công", "success");
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
  const handleClick = async (action) => {
    setAction(action);
    if (action === "remove") setContent("Bạn muốn xóa nhóm này?");
    else if (action === "restore") setContent("Bạn muốn khôi phục nhóm này?");
    else if (action === "update") setContent("Bạn muốn đổi tên nhóm?");
    else if (action === "activate") setContent("Bạn muốn kích hoạt nhóm?");
    setShowModal(true);
  };

  const handleChangeAva = () => {
    inputRef.current.click();
  };
  const handleFileChange = async (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    console.log("fileObj is", fileObj);
    setLoading(true);
    const form = new FormData();
    form.append("file", fileObj);
    try {
      const res = await uploadFile(group._id, currentUser?.accessToken, form);
      const data = { avatar: res.data };
      const resImg = await updateAvatar(
        group._id,
        currentUser?.accessToken,
        data,
        dispatch
      );

      if (resImg.statusCode === 200) {
        setAvatar(URL.createObjectURL(fileObj));
        handleAlert(
          "Thành công",
          "Cập nhập thành công ảnh đại diện",
          "success"
        );
      } else {
        handleAlert("Thất bại", "Cập nhập ảnh đại diện thất bại", "danger");
      }
    } catch (error) {
      handleAlert(
        "Thất bại",
        "Đã xảy ra lỗi khi cập nhập ảnh đại diện",
        "danger"
      );
    } finally {
      setLoading(false);
    }

    // 👇️ reset file input
    event.target.value = null;

    // 👇️ is now empty
    console.log(event.target.files);
  };
  return (
    <>
      <Modals
        title="Xác nhận"
        show={showModal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      >
        <h6>{content}</h6>
      </Modals>
      <Alerts
        show={showAlert}
        handleClose={handleClose}
        title={title}
        classes={classes}
      >
        {content}
      </Alerts>
      <Container>
        <Row className="justify-content-center align-items-start align-items-stretch">
          <Col xs={12} xl={7} className="mb-4 d-table-cell">
            <Card border="light" className="bg-white shadow-sm h-100">
              <Card.Body>
                <div className="d-flex flex-row justify-content-between ">
                  <h5 className="mb-4">
                    <b>Thông tin nhóm</b>
                  </h5>
                  {group.deleted && (
                    <h3 className="text-danger">
                      <OverlayTrigger
                        placement="left"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                      >
                        <FontAwesomeIcon icon={faBan} />
                      </OverlayTrigger>
                    </h3>
                  )}
                  {!group.deleted && (
                    <Button
                      variant="light"
                      className="icon icon-shape icon-sm rounded-circle"
                      onClick={(e) => handleClick("remove")}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  )}
                </div>
                <Stack direction="horizontal" className="ms-3 me-2">
                  <div className="position-relative" style={{ width: "10rem" }}>
                    {loading ? (
                      // Show loading state while avatar is being updated
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      <>
                        <Image
                          src={avatar}
                          alt={group.name}
                          className="mx-auto user-avatar profile-avatar rounded-circle"
                          loading="lazy"
                        />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          ref={inputRef}
                          onChange={handleFileChange}
                        />
                        <Button
                          className="rounded-circle text-center"
                          onClick={handleChangeAva}
                          variant="light"
                          style={{
                            height: "30px",
                            width: "30px",
                            padding: "0 1px 0 1px",
                            position: "absolute",
                            bottom: ".5rem",
                            right: ".5rem",
                          }}
                          disabled={group.deleted || loading}
                        >
                          <FontAwesomeIcon icon={faCameraAlt} />
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="flex-fill pe-0 ms-2">
                    <Formik
                      validationSchema={Yup.object().shape({
                        name: Yup.string().max(255).required("Bắt buộc"),
                      })}
                      initialValues={{ name: group.name }}
                      enableReinitialize
                      onSubmit={async (
                        values,
                        { setErrors, setStatus, setSubmitting }
                      ) => {
                        try {
                          setStatus({ success: false });
                          setSubmitting(false);
                          if (!_.isEqual(values, group.name)) {
                            setValues(values);
                            setContent("Bạn muốn đổi tên nhóm?");
                            setAction("update");
                            setShowModal(true);
                          } else {
                            handleAlert(
                              "Thông báo",
                              "Không có gì thay đổi",
                              "primary"
                            );
                            setShowAlert(true);
                            setTimeout(() => {
                              handleClose();
                            }, 1000);
                          }
                        } catch (err) {
                          setStatus({ success: false });
                          setErrors({ submit: err.message });
                          setSubmitting(false);
                        }
                      }}
                    >
                      {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values,
                      }) => (
                        <Form
                          noValidate
                          onSubmit={handleSubmit}
                          className="d-flex flex-row"
                        >
                          <TextField
                            hiddenLabel
                            id="name"
                            name="name"
                            variant="standard"
                            size="medium"
                            InputProps={{
                              style: {
                                fontSize: 25,
                                fontWeight: "bolder",
                              },
                            }}
                            value={values.name}
                            disabled={group.deleted}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.noOfMember && Boolean(errors.noOfMember)
                            }
                            helperText={touched.noOfMember && errors.noOfMember}
                            fullWidth
                          />
                          {!group.deleted && (
                            <Button
                              disabled={isSubmitting}
                              type="submit"
                              variant="light"
                              className="btn-table-options px-3 ms-n1"
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </Button>
                          )}
                        </Form>
                      )}
                    </Formik>
                  </div>
                </Stack>
                {group.deleted && (
                  <div className="text-end" style={{ marginTop: "-39px" }}>
                    <Button
                      variant="quaternary"
                      onClick={(e) => handleClick("restore")}
                    >
                      Khôi phục
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} xl={5} className="mb-4 d-table-cell">
            <Card border="light" className="bg-white shadow-sm h-100">
              <Card.Body>
                <div className="d-flex flex-row justify-content-between mb-3">
                  <h5>
                    <b>Gói dịch vụ</b>
                  </h5>
                  {packages.status === "Not Activated" && (
                    <Button
                      variant="primary"
                      onClick={(e) => handleClick("activate")}
                    >
                      Kích hoạt
                    </Button>
                  )}
                  {packages.status === "Expired" && (
                    <Button variant="secondary" disabled>
                      Đã hết hạn
                    </Button>
                  )}
                  {packages.status === "Active" && (
                    <Button
                      variant="outline-quaternary"
                      disabled
                      className="fw-bolder"
                      style={{
                        backgroundColor: "rgba(0, 110, 95, 0.2)",
                      }}
                    >
                      Đang kích hoạt
                    </Button>
                  )}
                </div>
                <Row className="mb-4">
                  <Col xs={12}>
                    <h5>{packages.package.name}</h5>
                  </Col>
                  <Col>
                    <FontAwesomeIcon icon={faCalendarCheck} /> <b>Thời hạn: </b>
                    {packages.package.duration} tháng
                  </Col>
                  <Col>
                    <FontAwesomeIcon icon={faUser} /> <b>Thành viên: </b>
                    <b className="fw-bolder text-quaternary">
                      {group.members.length}
                    </b>{" "}
                    / {packages.package.noOfMember} người
                  </Col>
                </Row>
                <Row className="justify-content-center align-items-center mb-4">
                  <Col xs={12} className="text-center ">
                    <span className="icon icon-sm me-2">
                      <FontAwesomeIcon
                        icon={faStopwatch}
                        shake={countdown !== 0}
                      />
                    </span>
                    <Countdown
                      date={Date.now() + countdown}
                      className="h3 text-primary fw-bold"
                    />
                  </Col>
                  <Col xs={12} className="text-center">
                    <FontAwesomeIcon icon={faClock} />{" "}
                    {packages.startDate
                      ? formatShortDate(packages.startDate)
                      : "______"}{" "}
                    -{" "}
                    {packages.endDate
                      ? formatShortDate(packages.endDate)
                      : "______"}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GroupInfoForm;
