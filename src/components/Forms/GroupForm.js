import { useState, useEffect, useRef } from "react";

// material-ui
import {
  Autocomplete,
  Box,
  InputAdornment,
  Slider,
  TextField,
} from "@mui/material";

// bootstrap
import {
  Form,
  InputGroup,
  Button,
  Col,
  ProgressBar,
  Stack,
  Row,
  Image,
} from "react-bootstrap";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUnlockAlt,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

// third party
import moment from "moment-timezone";
import Datetime from "react-datetime";
import CurrencyInput from "react-currency-input-field";
import { Field } from "formik";

// project import
import { strengthColor, strengthIndicator } from "utils/password-strength";
import {
  faSquareMinus,
  faSquarePlus,
} from "@fortawesome/free-regular-svg-icons";
import { formatCurrency } from "store/requests/user";

export const SampleGroupForm = ({
  title,
  icon,
  name,
  classes,
  type,
  placeholder,
  required = false,
  readOnly = false,
  disabled = false,
  handleBlur,
  handleChange,
  touched,
  values,
  errors,
}) => {
  return (
    <Form.Group id={name} className={classes?.formGroup}>
      <Form.Label className={classes?.formLabel}>{title}</Form.Label>
      <InputGroup>
        <InputGroup.Text>
          <FontAwesomeIcon icon={icon} />
        </InputGroup.Text>
        <Form.Control
          className={classes?.formControl}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          type={type}
          value={values[name]}
          placeholder={placeholder}
          name={name}
          onBlur={handleBlur}
          onChange={handleChange}
          isInvalid={!!(touched[name] && errors[name])}
        />
        <Form.Control.Feedback type="invalid">
          {errors[name]}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
};

export const CurrencyGroupForm = ({
  title,
  icon,
  name,
  classes,
  placeholder,
  required = false,
  readOnly = false,
  disabled = false,
  handleBlur,
  handleChange,
  touched,
  values,
  errors,
}) => {
  return (
    <Form.Group id={name} className={classes?.formGroup}>
      <Form.Label className={classes?.formLabel}>{title}</Form.Label>
      <InputGroup>
        <InputGroup.Text>
          <FontAwesomeIcon icon={icon} />
        </InputGroup.Text>
        <CurrencyInput
          id={name}
          name={name}
          className={`form-control ${classes?.formControl} ${
            touched[name] && errors[name] ? "is-invalid" : ""
          }`}
          onValueChange={(value) => {
            handleChange(name, value);
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values[name]}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          decimalsLimit={0}
          placeholder={placeholder}
          intlConfig={{ locale: "vi-VN", currency: "VND" }}
          step={1}
        />
        {touched[name] && errors[name] && (
          <Form.Control.Feedback type="invalid">
            {errors[name]}
          </Form.Control.Feedback>
        )}
      </InputGroup>
    </Form.Group>
  );
};

export const DateGroupForm = ({
  title,
  name,
  classes,
  required = false,
  readOnly = false,
  disabled = false,
  handleBlur,
  handleChange,
  touched,
  values,
  errors,
}) => {
  const [birthday, setBirthday] = useState(values[name]);
  return (
    <Form.Group id={name} className={classes?.formGroup}>
      <Form.Label className={classes?.formLabel}>{title}</Form.Label>
      <Datetime
        timeFormat={false}
        onChange={(e) => {
          let value = e;
          setBirthday(value);
          handleChange(name, new Date(value));
        }}
        renderInput={(props, openCalendar) => (
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faCalendarAlt} />
            </InputGroup.Text>
            <Form.Control
              className={classes?.formControl}
              type="text"
              value={birthday ? moment(birthday).format("DD/MM/YYYY") : ""}
              required={required}
              readOnly={readOnly}
              disabled={disabled}
              name={name}
              placeholder="dd/mm/yyyy"
              onFocus={openCalendar}
              onChange={() => {}}
              onBlur={handleBlur}
              isInvalid={touched[name] && !!errors[name]}
            />
            <Form.Control.Feedback type="invalid">
              {errors[name]}
            </Form.Control.Feedback>
          </InputGroup>
        )}
      />
    </Form.Group>
  );
};

export const BulletedTextArea = ({
  title,
  name,
  classes,
  required = false,
  readOnly = false,
  disabled = false,
  handleBlur,
  handleChange,
  touched,
  values,
  errors,
}) => {
  const inputRef = useRef(null);
  const bullet = "\u2022";
  const bulletWithSpace = `${bullet} `;
  const [formattedValue, setFormattedValue] = useState(values[name]);

  const _onKeyDown = (e) => {
    const { value, selectionStart } = e.target;
    if (e.keyCode === 13) {
      e.target.value = [...value]
        .map((c, i) => (i === selectionStart - 1 ? `\n${bulletWithSpace}` : c))
        .join("");
      e.target.selectionStart = selectionStart + bulletWithSpace.length;
      e.target.selectionEnd = selectionStart + bulletWithSpace.length;
      e.preventDefault();
      e.stopPropagation();
    }
    if (value[0] !== bullet) {
      e.target.value = `${bulletWithSpace}${value}`;
    }
  };
  return (
    <Form.Group id={name} className={classes?.formGroup}>
      <Form.Label className={classes?.formLabel}>{title}</Form.Label>
      <Form.Control
        ref={inputRef}
        as="textarea"
        placeholder=""
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        style={{ height: "4rem" }}
        onKeyDown={_onKeyDown}
        value={
          formattedValue && Array.isArray(formattedValue)
            ? bulletWithSpace +
              formattedValue.join(`\n${bulletWithSpace}`) +
              " "
            : formattedValue
        }
        onBlur={handleBlur}
        onChange={(e) => {
          let value = e.target.value;
          setFormattedValue(value);
          value = value.split(`\n${bulletWithSpace}`);
          value[0] = value[0].substring(2);
          handleChange(name, value);
        }}
        isInvalid={touched[name] && !!errors[name]}
      />
      <Form.Control.Feedback type="invalid">
        {errors[name]}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export const CheckboxGroupForm = ({
  title,
  icon,
  name,
  nameCheckbox,
  labelCheckbox,
  classes,
  type,
  placeholder,
  required = false,
  readOnly = false,
  disabled = false,
  handleBlur,
  handleChange,
  touched,
  values,
  errors,
}) => {
  return (
    <Form.Group id={name} className={classes?.formGroup}>
      <Form.Label className={classes?.formLabel}>{title}</Form.Label>
      <InputGroup>
        <InputGroup.Text>
          <FontAwesomeIcon icon={icon} />
        </InputGroup.Text>
        <Form.Control
          className={classes?.formControl}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          type={type}
          value={values[name]}
          placeholder={placeholder}
          name={name}
          onBlur={handleBlur}
          onChange={handleChange}
          isInvalid={!!(touched[name] && errors[name])}
        />
        <InputGroup.Checkbox
          as={Field}
          type="checkbox"
          name={nameCheckbox}
          checked={values[nameCheckbox]}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={touched[nameCheckbox] && !!errors[nameCheckbox]}
        />
        <span className="label-checkbox pt-2 pe-2">{labelCheckbox}</span>
        <Form.Control.Feedback type="invalid">
          {errors[name]}
          {errors[nameCheckbox]}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
};

export const PasswordGroupForm = ({
  title,
  name,
  classes,
  handleBlur,
  handleChange,
  touched,
  values,
  errors,
  checkStrength = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [level, setLevel] = useState();
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword("");
  }, []);
  return (
    <Form.Group id="password" className={classes?.formGroup}>
      <Form.Label className={classes?.formLabel}>{title}</Form.Label>
      <InputGroup>
        <InputGroup.Text>
          <FontAwesomeIcon icon={faUnlockAlt} />
        </InputGroup.Text>
        <Form.Control
          className={classes?.formControl}
          required
          type={showPassword ? "text" : "password"}
          value={values[name]}
          placeholder="Password"
          name={name}
          onBlur={handleBlur}
          onChange={
            !checkStrength
              ? handleChange
              : (e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }
          }
          isInvalid={!!(touched[name] && errors[name])}
        />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
        >
          {showPassword ? (
            <FontAwesomeIcon icon={faEye} />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} />
          )}
        </Button>
        <Form.Control.Feedback type="invalid">
          {errors[name]}
        </Form.Control.Feedback>
      </InputGroup>
      {checkStrength && touched[name] && (
        <Stack direction="horizontal">
          <Col className="align-items-center justify-content-center mt-1 me-1">
            <ProgressBar
              now={level?.percentage}
              variant={level?.color}
              style={{ height: "8px" }}
            />
          </Col>
          <small>
            <b>{level?.label}</b>
          </small>
        </Stack>
      )}
    </Form.Group>
  );
};
export const calcPrice = (duration, price, noOfMember, coefficient) => {
  return Math.round(
    duration >= 12
      ? (price + (coefficient ?? 0) * (noOfMember - 2) * duration) * 0.7
      : price + (coefficient ?? 0) * (noOfMember - 2) * duration
  );
};
export const PackageSelectionForm = (props) => {
  const {
    title,
    data,
    showQty = false,
    handleBlur,
    setFieldValue,
    touched,
    values,
    errors,
  } = props;
  const packageProps = {
    options: data.packages.filter((pkg) => !pkg.deleted),
    getOptionLabel: (option) => option.name,
  };

  const findIdxCart = (pkg, cart, duration, noOfMember) => {
    if (cart) {
      const idx = cart.find((elem) => {
        if (
          elem._id === pkg._id &&
          elem.duration === Number(duration) &&
          elem.noOfMember === Number(noOfMember)
        )
          return true;
        else return false;
      });
      if (idx) {
        return idx.quantity;
      }
      return 1;
    }
    return 1;
  };
  return (
    <>
      <h6 className="fw-bold mb-3">{title}</h6>
      <Autocomplete
        {...packageProps}
        id="packages"
        onChange={(e, value) => {
          const idx = findIdxCart(
            value,
            data.cart,
            value.duration,
            value.noOfMember
          );
          setFieldValue("packages", value);
          setFieldValue("duration", value.duration);
          setFieldValue("noOfMember", value.noOfMember);
          setFieldValue("quantity", idx);
        }}
        onBlur={handleBlur}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label={title}
            size="small"
            error={touched.packages && Boolean(errors.packages)}
            helperText={touched.packages && errors.packages}
            style={{ borderRadius: "0.5rem" }}
            value={values.packages}
          />
        )}
      />
      <Row className="mt-4">
        <Col className="mt-2">
          <TextField
            id="noOfMember"
            name="noOfMember"
            label="Thành viên"
            size="small"
            type="number"
            value={values.noOfMember}
            disabled={!values.packages || !values.packages.editableNoOfMember}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const idx = findIdxCart(
                  values.packages,
                  data.cart,
                  values.duration,
                  value
                );
                setFieldValue("quantity", idx);
              }
              setFieldValue("noOfMember", value);
            }}
            onBlur={handleBlur}
            error={touched.noOfMember && Boolean(errors.noOfMember)}
            helperText={touched.noOfMember && errors.noOfMember}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">người</InputAdornment>
              ),
            }}
          />
        </Col>
        <Col className="mt-2">
          <TextField
            id="duration"
            name="duration"
            label="Thời hạn"
            size="small"
            type="number"
            value={values.duration}
            disabled={!values.packages || !values.packages.editableDuration}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const idx = findIdxCart(
                  values.packages,
                  data.cart,
                  value,
                  values.noOfMember
                );
                setFieldValue("quantity", idx);
              }
              setFieldValue("duration", value);
            }}
            onBlur={handleBlur}
            error={touched.duration && Boolean(errors.duration)}
            helperText={touched.duration && errors.duration}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">tháng</InputAdornment>
              ),
            }}
          />
        </Col>
      </Row>
      {showQty && (
        <Stack gap={3}>
          <RangeSlider {...props} title="Số lượng" name="quantity" />
          {values.packages &&
            values.duration >= 1 &&
            values.noOfMember >= 2 && (
              <h4 className="text-center fw-bolder">
                {formatCurrency(
                  calcPrice(
                    values.duration,
                    values.packages?.price,
                    values.noOfMember,
                    values.packages?.coefficient
                  ) * values.quantity
                )}
              </h4>
            )}
        </Stack>
      )}
    </>
  );
};

export const RangeSlider = ({
  title,
  name,
  min,
  max,
  step,
  handleBlur,
  handleChange,
  setFieldValue,
  touched,
  values,
  errors,
}) => {
  const handleSliderChange = (event, value) => {
    setFieldValue(name, value);
  };
  const handleInputChange = (event) => {
    setFieldValue(
      name,
      event.target.value === "" ? "" : Number(event.target.value)
    );
  };
  function valuetext(value) {
    return `${value}`;
  }
  // -----Increment Event------
  const increaseQuantity = () => {
    const value = values[name] + 1;
    if (value <= 30) setFieldValue(name, value);
  };

  // -----Decrement Event------
  const decreaseQuantity = () => {
    const value = values[name] - 1;
    if (value >= 1) setFieldValue(name, value);
  };
  return (
    <>
      <Stack direction="horizontal" gap={2}>
        <h6 className="mt-4 mb-3 fw-bold">{title}</h6>
        <div className="mb-n2">
          <TextField
            variant="standard"
            id={name}
            value={values[name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={touched[name] && Boolean(errors[name])}
            helperText={touched[name] && errors[name]}
            inputProps={{
              step: step,
              min: min,
              max: max,
              type: "number",
              "aria-labelledby": "range-slider",
              style: {
                textAlign: "center",
                fontSize: "15px",
                fontWeight: "bolder",
              },
            }}
          />
        </div>
      </Stack>
      <Stack direction="horizontal" gap={3} className="mx-3">
        <Button
          className="btn-table-options btn-slider icon icon-sm"
          onClick={decreaseQuantity}
        >
          <FontAwesomeIcon icon={faSquareMinus} />
        </Button>
        <Slider
          value={typeof values[name] === "number" ? values[name] : min}
          onChange={handleSliderChange}
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          step={step}
          min={min}
          max={max}
          aria-labelledby="range-slider"
        />
        <Button
          className="btn-table-options btn-slider icon icon-sm"
          onClick={increaseQuantity}
        >
          <FontAwesomeIcon icon={faSquarePlus} />
        </Button>
      </Stack>
    </>
  );
};

export const UserSelectionForm = ({
  title,
  handleBlur,
  setFieldValue,
  touched,
  values,
  errors,
  data,
  name,
}) => {
  const userProps = {
    options: data.filter((user) => !user.deleted && user.role !== "admin"),
    getOptionLabel: (option) => option.name,
  };
  return (
    <>
      <h6 className="mt-4 mb-3 fw-bold">{title}</h6>
      <Autocomplete
        {...userProps}
        id={name}
        name={name}
        disableClearable
        onChange={(e, value) => {
          console.log(value);
          setFieldValue(name, value._id);
        }}
        onBlur={handleBlur}
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
            label={title}
            value={values[name]}
            size="small"
            style={{ borderRadius: "0.5rem" }}
            error={touched[name] && Boolean(errors[name])}
            helperText={touched[name] && errors[name]}
          />
        )}
      />
    </>
  );
};
