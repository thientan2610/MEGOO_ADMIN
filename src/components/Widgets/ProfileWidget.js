import React from "react";
import { Card } from "react-bootstrap";

import Profile3 from "assets/team/profile-picture-3.jpg";
import ProfileCover from "assets/profile-cover.jpg";

const ProfileWidget = () => {
  return (
    <Card className="text-center mx-auto mt-3" style={{ width: "230px" }}>
      <div
        style={{ backgroundImage: `url(${ProfileCover})` }}
        className="profile-cover rounded-top"
      />
      <Card.Body>
        <Card.Img
          src={Profile3}
          alt="Night Owl"
          className="mt-n6 mx-auto mb-2 user-avatar large-avatar rounded-circle"
        />
        <Card.Title>Night Owl</Card.Title>
        <Card.Subtitle className="fw-normal">Admin</Card.Subtitle>
      </Card.Body>
    </Card>
  );
};

export default ProfileWidget;
