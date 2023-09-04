import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// bootstrap
import { Col, Container, Row } from "react-bootstrap";

// project import
import ProfileForm from "components/Forms/ProfileForm";
import TransTable from "components/Tables/TransTable";
import { getAllUsers, getAllTrans } from "store/requests/user";
import CartTable from "components/Tables/CartTable";

const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { userInfo, trans } = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state?.auth.login);
  const [user, setUser] = useState(
    userInfo.filter((user) => user._id === id).at(0)
  );
  useEffect(() => {
    getAllUsers(dispatch, currentUser?.accessToken);
    getAllTrans(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    setUser(userInfo.filter((user) => user._id === id).at(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <>
      <Row className="justify-content-md-center mt-0">
        <Col xs={12} className="d-sm-block">
          <ProfileForm userInfo={user} />
        </Col>
      </Row>
      {user.role === "user" && (
        <>
          <Row>
            <Col xs={12} className="d-sm-block">
              <CartTable userInfo={user} />
            </Col>
            <Col xs={12} className="d-sm-block">
              <TransTable
                trans={trans.filter((txn) => txn.user === id)}
                userInfo={user}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
export default Profile;
