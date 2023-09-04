import React, { useRef, useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import ProfileCover from "assets/profile-cover.jpg";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraAlt } from "@fortawesome/free-solid-svg-icons";

// project import
import { uploadFile, updateAvatarUser, getUserById } from "store/requests/user";

const AvatarForm = ({ user, handleAlert, currentUser, dispatch }) => {
  const { _id, name, role } = user;
  const [avatar, setAvatar] = useState(user.avatar);
  const [loading, setLoading] = useState(false);
  const showRole = role === "admin" ? "Admin" : "User";
  const inputRef = useRef(null);

  useEffect(() => {
    setAvatar(user.avatar);
  }, [user]);

  const handleClick = () => {
    inputRef.current.click();
  };
  const handleFileChange = async (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    console.log("fileObj is", fileObj);

    setLoading(true); // Set loading state to true
    var form = new FormData();
    form.append("file", fileObj);
    try {
      const res = await uploadFile(_id, currentUser?.accessToken, form);

      const data = { avatar: res?.data };
      const resImg = await updateAvatarUser(
        _id,
        currentUser?.accessToken,
        data,
        dispatch
      );

      if (resImg.statusCode === 200) {
        if (_id === currentUser?.data.auth?.userInfoId) {
          await getUserById(_id, currentUser?.accessToken, dispatch);
        }
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
    <Card border="light" className="bg-white shadow-sm text-center h-100">
      <div
        style={{ backgroundImage: `url(${ProfileCover})` }}
        className="profile-cover rounded-top"
      />
      <Card.Body className="pb-4">
        <div className="position-relative mx-auto" style={{ width: "10rem" }}>
          {loading ? (
            // Show loading state while avatar is being updated
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              <Card.Img
                src={avatar}
                alt={name}
                className="mt-n7 mx-auto mb-3 user-avatar profile-avatar rounded-circle"
              />
              <input
                type="file"
                style={{ display: "none" }}
                ref={inputRef}
                onChange={handleFileChange}
              />
              <Button
                className="rounded-circle text-center"
                onClick={handleClick}
                variant="light"
                style={{
                  height: "30px",
                  width: "30px",
                  padding: "0 1px 0 1px",
                  position: "absolute",
                  bottom: ".5rem",
                  right: ".5rem",
                }}
                disabled={user.deleted || loading}
              >
                <FontAwesomeIcon icon={faCameraAlt} />
              </Button>
            </>
          )}
        </div>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="fw-normal">{showRole}</Card.Subtitle>
      </Card.Body>
    </Card>
  );
};

export default AvatarForm;
