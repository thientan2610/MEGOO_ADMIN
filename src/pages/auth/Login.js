import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// project
import LoginRoutes from "routes/LoginRoutes";
import MainRoutes from "routes/MainRoutes";
import { loginUser } from "store/requests/auth";
import { PasswordGroupForm, SampleGroupForm } from "components/Forms/GroupForm";

// bootstrap
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  FormCheck,
  Container,
  Image,
} from "react-bootstrap";

// third-party
import { Formik } from "formik";
import * as Yup from "yup";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import BgImage from "assets/login.jpg";
import logo from "assets/logo.png";
import Alerts from "components/Alerts";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState({
    alertVariant: "danger",
    alertClass: "fixed-top mx-auto",
  });

  const handleClose = () => setShowAlert(false);
  return (
    <main>
      <section
        className="d-flex align-items-center bg-soft py-5 pt-lg-6 pb-lg-5"
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        <Alerts
          show={showAlert}
          handleClose={handleClose}
          title={title}
          classes={classes}
        >
          {content}
        </Alerts>
        <Container>
          <Row className="align-items-start">
            <Col
              sm={12}
              md={10}
              lg="5"
              className="d-flex align-items-center justify-content-start"
            >
              <div
                className="bg-white shadow border rounded border-light p-4 pb-3 p-lg-5 pb-lg-4 w-100"
                style={{ maxWidth: 500 }}
              >
                <div className="text-center text-md-center mb-0 mt-md-0">
                  <Image src={logo} style={{ width: "60%", height: "auto" }} />
                </div>
                <Formik
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email("Email không hợp lệ")
                      .max(255)
                      .required("Bắt buộc"),
                    password: Yup.string().max(255).required("Bắt buộc"),
                  })}
                  initialValues={{
                    email: "admin@gmail.com",
                    password: "password",
                    submit: null,
                  }}
                  onSubmit={async (
                    values,
                    { setErrors, setStatus, setSubmitting }
                  ) => {
                    try {
                      setStatus({ success: false });
                      setSubmitting(false);
                      const formData = {
                        username: values.email,
                        password: values.password,
                      };
                      const res = await loginUser(formData, dispatch);
                      if (!res.data) {
                        setContent(res?.response.data.message);
                        setTitle(res?.response.statusText);
                        setShowAlert(true);
                      } else {
                        if (res?.data.auth.role === "admin") {
                          setContent("Đăng nhập thành công");
                          setTitle("Thành công");
                          setClasses({
                            alertVariant: "success",
                            alertClass: "fixed-top mx-auto",
                          });
                          setShowAlert(true);
                          setTimeout(() => {
                            navigate("/");
                          }, 1500);
                        } else {
                          setContent("Tài khoản không tồn tại");
                          setTitle("Lỗi");
                          setShowAlert(true);
                        }
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
                    <Form noValidate className="mb-3" onSubmit={handleSubmit}>
                      <SampleGroupForm
                        title="Email"
                        classes={{
                          formGroup: "mb-4",
                          formControl: "input-out-button-group",
                        }}
                        name="email"
                        type="text"
                        icon={faEnvelope}
                        values={values}
                        touched={touched}
                        errors={errors}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        placeholder="megoo@example.com"
                        required={true}
                      />
                      <PasswordGroupForm
                        title="Mật khẩu"
                        name="password"
                        classes={{
                          formGroup: "mb-4",
                          formControl: "input-button-group",
                        }}
                        values={values}
                        touched={touched}
                        errors={errors}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                      />
                      <Form.Group>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <Form.Check type="checkbox">
                            <FormCheck.Input
                              id="defaultCheck5"
                              className="me-2"
                            />
                            <FormCheck.Label
                              htmlFor="defaultCheck5"
                              className="mb-0"
                            >
                              Nhớ mật khẩu
                            </FormCheck.Label>
                          </Form.Check>
                          <Card.Link
                            href={LoginRoutes.children[1].path}
                            className="fw-bold"
                          >
                            {` Quên mật khẩu? `}
                          </Card.Link>
                        </div>
                      </Form.Group>
                      <div className="d-grid gap-auto">
                        <Button
                          variant="primary"
                          disabled={isSubmitting}
                          type="submit"
                          className="btn-login"
                        >
                          Đăng nhập
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
                <p className="text-center">
                  <Card.Link
                    as={Link}
                    to={MainRoutes.path}
                    className="text-gray-700"
                  >
                    <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Về
                    trang chủ
                  </Card.Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Login;
