import PropTypes from "prop-types";
import _ from "lodash";

// bootstrap
import { Modal, Button, Form } from "react-bootstrap";

// third-party
import { Formik } from "formik";

// project import
import {
  PasswordGroupForm,
  SampleGroupForm,
  DateGroupForm,
  BulletedTextArea,
  CurrencyGroupForm,
  CheckboxGroupForm,
  UserSelectionForm,
  PackageSelectionForm,
  RangeSlider,
} from "./GroupForm";

// ==============================|| BOOTSTRAP FORM MODAL ||============================== //
const ModalForm = ({
  title,
  children,
  show,
  handleClose,
  handleSubmit,
  handleAlert,
  classes,
  schema,
  initValues,
  forms,
}) => {
  return (
    <Modal show={show} onHide={handleClose} scrollable={false}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Formik
        validationSchema={schema}
        initialValues={initValues}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setStatus({ success: false });
            setSubmitting(false);
            if (!_.isEqual(values, initValues)) {
              handleSubmit(values);
            } else {
              handleAlert("Thông báo", "Không có gì thay đổi", "primary");
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
            <Modal.Body>
              {children}
              {forms &&
                forms.map((form) => ({
                  ...(form._Type === "simple" && (
                    <SampleGroupForm
                      key={`form-control-${form.id}`}
                      {...form}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      touched={touched}
                      errors={errors}
                      values={values}
                    />
                  )),
                  ...(form._Type === "password" && (
                    <PasswordGroupForm
                      key={`form-control-${form.id}`}
                      {...form}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      touched={touched}
                      errors={errors}
                      values={values}
                    />
                  )),
                  ...(form._Type === "date" && (
                    <DateGroupForm
                      key={`form-control-${form.id}`}
                      {...form}
                      handleBlur={handleBlur}
                      handleChange={setFieldValue}
                      touched={touched}
                      errors={errors}
                      values={values}
                    />
                  )),
                  ...(form._Type === "text-area" && (
                    <BulletedTextArea
                      key={`form-control-${form.id}`}
                      {...form}
                      handleBlur={handleBlur}
                      handleChange={setFieldValue}
                      touched={touched}
                      errors={errors}
                      values={values}
                    />
                  )),
                  ...(form._Type === "currency" && (
                    <CurrencyGroupForm
                      key={`form-control-${form.id}`}
                      {...form}
                      handleBlur={handleBlur}
                      handleChange={setFieldValue}
                      touched={touched}
                      errors={errors}
                      values={values}
                    />
                  )),
                  ...(form._Type === "checkbox" && (
                    <CheckboxGroupForm
                      key={`form-control-${form.id}`}
                      {...form}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      touched={touched}
                      errors={errors}
                      values={values}
                    />
                  )),
                  ...(form._Type === "packages-autocomplete" && (
                    <PackageSelectionForm
                      key={`form-control-${form.id}`}
                      {...form}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                      touched={touched}
                      values={values}
                      errors={errors}
                    />
                  )),
                  ...(form._Type === "users-autocomplete" && (
                    <UserSelectionForm
                      key={`form-control-${form.id}`}
                      {...form}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                      touched={touched}
                      values={values}
                      errors={errors}
                    />
                  )),
                  ...(form._Type === "range-slider" && (
                    <RangeSlider
                      key={`form-control-${form.id}`}
                      {...form}
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      touched={touched}
                      values={values}
                      errors={errors}
                    />
                  )),
                }))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Đóng
              </Button>
              <Button variant="primary" disabled={isSubmitting} type="submit">
                Xác nhận
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
ModalForm.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  show: PropTypes.bool,
  children: PropTypes.node,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleAlert: PropTypes.func,
  classes: PropTypes.object,
  schema: PropTypes.any,
  initValues: PropTypes.object,
  forms: PropTypes.array,
};

export default ModalForm;
