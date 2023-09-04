import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { HttpStatusCode } from "axios";

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
} from "react-bootstrap";

// assets
import {
  faEnvelope,
  faAddressCard,
  faPhoneAlt,
  faBan,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { SampleGroupForm, DateGroupForm } from "./GroupForm";
import AvatarForm from "./AvatarForm";
import Alerts from "components/Alerts";
import Modals from "components/Modal";
import { getUserById, updateInfoUser } from "store/requests/user";
import { restoreUser, removeUser } from "store/requests/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProfileForm = ({ userInfo }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.auth.login);
  const [action, setAction] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState({
    alertVariant: "danger",
    alertClass: "fixed-top mx-auto",
  });
  const [values, setValues] = useState(null);
  const [initValues, setInitValues] = useState({
    name: userInfo.name,
    dob: userInfo.dob,
    phone: userInfo.phone,
    email: userInfo.email,
    submit: null,
  });
  useEffect(() => {
    setInitValues({
      name: userInfo.name,
      dob: userInfo.dob,
      phone: userInfo.phone,
      email: userInfo.email,
      submit: null,
    });
  }, [userInfo]);
  const handleAlert = (title, content, variant) => {
    setTitle(title);
    setContent(content);
    setClasses({
      alertVariant: variant,
      alertClass: "fixed-top mx-auto",
    });
  };
  const handleConfirm = async () => {
    setShowModal(false);
    let res;
    let error = false;
    if (action === "remove") {
      res = await removeUser(userInfo._id, currentUser?.accessToken, dispatch);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Xóa tài khoản thành công", "success");
      } else error = true;
    } else if (action === "restore") {
      res = await restoreUser(userInfo._id, currentUser?.accessToken, dispatch);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Khôi phục tài khoản thành công", "success");
      } else error = true;
    } else if (action === "update") {
      let formData = { name: values.name };
      if (values.phone) formData.phone = values.phone;
      if (values.dob) formData.dob = values.dob;
      console.log("formData", values.dob);
      const res = await updateInfoUser(
        userInfo._id,
        currentUser?.accessToken,
        formData,
        dispatch
      );
      if (res.statusCode === HttpStatusCode.Ok) {
        if (userInfo._id === currentUser?.data.auth?.userInfoId) {
          await getUserById(userInfo._id, currentUser?.accessToken, dispatch);
        }
        handleAlert(
          "Thành công",
          "Cập nhật thông tin cá nhân thành công",
          "success"
        );
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
    setShowAlert(false);
    setShowModal(false);
  };
  const phoneRegExp = /(\+84|84|0)+([3|5|7|8|9]{1})+([0-9]{8})\b/;
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Tài khoản đã xóa vào {userInfo.deletedAt}
    </Tooltip>
  );
  const handleClick = async (action) => {
    setAction(action);
    if (action === "remove") setContent("Bạn muốn xóa tài khoản?");
    else setContent("Bạn muốn khôi phục tài khoản?");
    setShowModal(true);
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
          <Col xs={12} xl={4} className="mb-4 d-table-cell">
            <AvatarForm
              user={userInfo}
              handleAlert={handleAlert}
              currentUser={currentUser}
              dispatch={dispatch}
            />
          </Col>
          <Col xs={12} xl={8} className="mb-4 d-table-cell">
            <Card border="light" className="bg-white shadow-sm h-100">
              <Card.Body>
                <div className="d-flex flex-row justify-content-between">
                  <h5 className="mb-4">
                    <b>Thông tin cá nhân</b>
                  </h5>
                  {userInfo.deleted && (
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
                  {!userInfo.deleted && (
                    <Button
                      variant="light"
                      className="icon icon-shape icon-sm rounded-circle"
                      onClick={(e) => handleClick("remove")}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  )}
                </div>
                <Formik
                  validationSchema={Yup.object().shape({
                    name: Yup.string().max(255).required("Bắt buộc"),
                    phone: Yup.string()
                      .min(0)
                      .matches(phoneRegExp, "Số điện thoại không hợp lệ")
                      .nullable(true),
                  })}
                  initialValues={initValues}
                  enableReinitialize
                  onSubmit={async (
                    values,
                    { setErrors, setStatus, setSubmitting }
                  ) => {
                    try {
                      setStatus({ success: false });
                      setSubmitting(false);
                      if (!_.isEqual(values, initValues)) {
                        setValues(values);
                        setContent("Bạn muốn cập nhật thông tin?");
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
                    setFieldValue,
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6} className="mb-3">
                          <SampleGroupForm
                            title="Họ & Tên"
                            icon={faAddressCard}
                            name="name"
                            type="text"
                            placeholder="Nhập Họ & Tên"
                            classes={{ formControl: "input-out-button-group" }}
                            required={true}
                            disabled={userInfo.deleted}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            touched={touched}
                            errors={errors}
                            values={values}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <DateGroupForm
                            title="Ngày sinh"
                            name="dob"
                            disabled={userInfo.deleted}
                            handleBlur={handleBlur}
                            handleChange={setFieldValue}
                            classes={{ formControl: "input-out-button-group" }}
                            touched={touched}
                            errors={errors}
                            values={values}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-3">
                          <SampleGroupForm
                            title="Email"
                            icon={faEnvelope}
                            name="email"
                            type="email"
                            classes={{ formControl: "input-out-button-group" }}
                            placeholder="Nhập Email"
                            required={true}
                            readOnly={true}
                            disabled={userInfo.deleted}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            touched={touched}
                            errors={errors}
                            values={values}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <SampleGroupForm
                            title="Số điện thoại"
                            icon={faPhoneAlt}
                            name="phone"
                            type="text"
                            required={false}
                            disabled={userInfo.deleted}
                            classes={{ formControl: "input-out-button-group" }}
                            placeholder="Nhập số điện thoại"
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            touched={touched}
                            errors={errors}
                            values={values}
                          />
                        </Col>
                      </Row>
                      {!userInfo.deleted && (
                        <div className="mt-3 text-end">
                          <Button
                            variant="primary"
                            disabled={isSubmitting}
                            type="submit"
                          >
                            Xác nhận
                          </Button>
                        </div>
                      )}
                      {userInfo.deleted && (
                        <div className="mt-3 text-end">
                          <Button
                            variant="quaternary"
                            onClick={(e) => handleClick("restore")}
                          >
                            Khôi phục
                          </Button>
                        </div>
                      )}
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfileForm;
