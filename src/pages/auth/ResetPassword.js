import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import LoginRoutes from "routes/LoginRoutes";
import { PasswordGroupForm, SampleGroupForm } from "components/Forms/GroupForm";

const ResetPassword = () => {
  return (
    <main>
      <section className="d-flex align-items-center py-5 pt-lg-6 pb-lg-5 bg-soft">
        <Container>
          <Row className="justify-content-center">
            <Col
              sm={12}
              md={10}
              lg="5"
              className="d-flex align-items-center justify-content-center"
            >
              <div
                className="bg-white shadow border rounded border-light p-4 pb-3 p-lg-5 pb-lg-4 w-100"
                style={{ maxWidth: 440 }}
              >
                <h3 className="mb-4">Đặt lại mật khẩu</h3>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    re_password: "",
                    submit: null,
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (values.password !== values.re_password) {
                      errors.re_password = "Mật khẩu không trùng khớp";
                    }
                    return errors;
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email("Email không hợp lệ")
                      .max(255)
                      .required("Bắt buộc"),
                    password: Yup.string().max(255).required("Bắt buộc"),
                    re_password: Yup.string().max(255).required("Bắt buộc"),
                  })}
                  onSubmit={async (
                    values,
                    { setErrors, setStatus, setSubmitting }
                  ) => {
                    try {
                      setStatus({ success: false });
                      setSubmitting(false);
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
                    <Form noValidate onSubmit={handleSubmit}>
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
                        checkStrength={true}
                      />
                      <PasswordGroupForm
                        title="Xác nhận mật khẩu"
                        name="re_password"
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
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-100 btn-login"
                      >
                        Xác nhận
                      </Button>
                    </Form>
                  )}
                </Formik>
                <br></br>
                <p className="text-center">
                  <Card.Link
                    href={LoginRoutes.children[0].path}
                    className="text-gray-700"
                  >
                    <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Về
                    trang đăng nhập
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
export default ResetPassword;
