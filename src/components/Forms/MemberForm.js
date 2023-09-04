import React, { useState, useEffect, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// bootstrap
import {
  Card,
  Row,
  Col,
  Stack,
  Image,
  Form,
  CloseButton,
  Button,
  Badge,
} from "react-bootstrap";

// material-ui
import { Autocomplete, TextField, Box } from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// data
import { getAllUsers } from "store/requests/user";
import { addMemb, rmMemb } from "store/requests/group";
import Alerts from "components/Alerts";
import Modals from "components/Modal";
import { HttpStatusCode } from "axios";
import { findMainPackage } from "store/requests/group";

const MemberForm = forwardRef(({ group }, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.auth.login);
  const { userInfo } = useSelector((state) => state.user);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState({
    alertVariant: "danger",
    alertClass: "fixed-top mx-auto",
  });
  const [packages, setPackages] = useState(findMainPackage(group.packages));
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    getAllUsers(dispatch, currentUser?.accessToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    setPackages(findMainPackage(group.packages));
  }, [group]);
  const userProps = {
    options: userInfo.filter(
      (user) =>
        !user.deleted &&
        user.role !== "admin" &&
        !group.members.some((elem) => elem.user._id === user._id)
    ),
    getOptionLabel: (option) => option.name,
  };
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
  const handleConfirm = async () => {
    setShowModal(false);
    let res;
    let error = false;
    let formData = { user: selected.user._id };
    console.log("form", formData, group._id);
    res = await rmMemb(group._id, formData, dispatch);
    if (res.statusCode === HttpStatusCode.Ok) {
      handleAlert("Thành công", "Xóa nhóm thành công", "success");
    } else error = true;
    if (error) {
      handleAlert("Thất bại", res.message, "danger");
      error = false;
    }
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };
  const handleClick = async (member) => {
    setContent("Bạn muốn xóa thành viên này ra khỏi nhóm?");
    setSelected(member);
    console.log("seclect", member);
    setShowModal(true);
  };
  const MemberCard = ({ member }) => {
    return (
      <Col xs={12}>
        <Card className="shadow-sm mb-2">
          <Card.Body className="py-1">
            <Row className="align-items-center">
              <Col
                onClick={() => {
                  navigate(`/users/${member.user._id}`);
                }}
              >
                <Stack direction="horizontal">
                  <Image
                    src={member.user.avatar}
                    className="user-avatar xs-avatar"
                    roundedCircle
                  />
                  <p className="ms-2 my-auto fw-bold">{member.user.name}</p>
                </Stack>
              </Col>
              <Col
                onClick={() => {
                  navigate(`/users/${member.user._id}`);
                }}
              >
                <p className="my-auto">{member.user.email}</p>
              </Col>
              <Col>
                <div className="d-flex justify-content-end">
                  <Badge
                    tab
                    bg={member.role === "User" ? "quaternary" : "primary"}
                    style={{ width: "4.3rem" }}
                    className="tag my-auto p-auto"
                  >
                    {member.role === "User" ? "User" : "Super User"}
                  </Badge>
                  <CloseButton
                    className="ms-2"
                    onClick={() => handleClick(member)}
                  />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    );
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
      <Card border="light" className="bg-white shadow-sm h-100" ref={ref}>
        <Card.Body>
          <h5 className="mb-4">
            <b>Thành viên</b>
          </h5>
          <Row>
            {group.members.map((member) => {
              return (
                <MemberCard key={`member-card-${member.id}`} member={member} />
              );
            })}
          </Row>
          {group.members.length < packages.package.noOfMember && (
            <Row>
              <Formik
                validationSchema={Yup.object().shape({
                  member: Yup.string().required("Bắt buộc"),
                })}
                initialValues={{ member: null }}
                onSubmit={async (
                  values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    setStatus({ success: false });
                    setSubmitting(false);
                    if (values.member !== null) {
                      let formData = { user: values.member };
                      console.log(formData);
                      const res = await addMemb(
                        group._id,
                        currentUser?.accessToken,
                        formData,
                        dispatch
                      );
                      if (res.statusCode === HttpStatusCode.Ok) {
                        handleClose();
                        handleAlert(
                          "Thành công",
                          "Thêm thành viên thành công",
                          "success"
                        );
                      } else {
                        handleAlert("Thất bại", res.message, "danger");
                      }
                      setShowAlert(true);
                      setTimeout(() => {
                        setShowAlert(false);
                      }, 1000);
                    } else {
                      handleAlert(
                        "Thông báo",
                        "Không có gì thay đổi",
                        "primary"
                      );
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
                  <Form noValidate className="mb-3" onSubmit={handleSubmit}>
                    <Autocomplete
                      {...userProps}
                      id="member"
                      name="member"
                      disabled={group.status !== "Đang kích hoạt"}
                      onChange={(e, value) => {
                        if (value) setFieldValue("member", value._id);
                        else setFieldValue("member", null);
                      }}
                      blurOnSelect={handleBlur}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          sx={{
                            "& > img": { mr: 2, flexShrink: 0 },
                          }}
                          {...props}
                        >
                          <Image
                            src={option.avatar}
                            className="user-avatar xs-avatar shadow "
                            roundedCircle
                            alt={option._id}
                          />
                          <span>
                            <b>{option.name}</b> ({option.email})
                          </span>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Thành viên"
                          value={values.member}
                          size="small"
                          style={{ borderRadius: "0.5rem" }}
                          error={touched.member && Boolean(errors.member)}
                          helperText={touched.member && errors.member}
                        />
                      )}
                    />
                    {values.member && (
                      <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
                        <Button
                          variant="primary"
                          disabled={isSubmitting}
                          type="submit"
                        >
                          Xác nhận
                        </Button>
                        <Button variant="light">Đóng</Button>
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </Row>
          )}
        </Card.Body>
      </Card>
    </>
  );
});

export default MemberForm;
