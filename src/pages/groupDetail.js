import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// bootstrap
import { Col, Container, Row } from "react-bootstrap";

// project import
import GroupInfoForm from "components/Forms/GrInfoForm";
import MemberForm from "components/Forms/MemberForm";
import { getAllGroups } from "store/requests/group";
import GroupPackageTable from "components/Tables/GrPkgTable";

const GroupDetail = () => {
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state?.group);
  const [memberFormHeight, setMemberFormHeight] = useState(0);
  const memberFormRef = useRef(null);

  useEffect(() => {
    console.log(memberFormRef.current.offsetHeight);
    if (memberFormRef.current) {
      setMemberFormHeight(memberFormRef.current.offsetHeight);
    }
  }, []);
  useEffect(() => {
    getAllGroups(dispatch);
  }, [dispatch]);
  const { id } = useParams();
  return (
    <>
      <Row className="justify-content-md-center mt-0">
        <Col xs={12} className="d-sm-block">
          <GroupInfoForm
            group={groups.filter((group) => group._id === id).at(0)}
          />
        </Col>
      </Row>
      <Container>
        <Row className="justify-content-md-center mt-0 align-items-stretch">
          <Col xs={12} xl={7} className="mb-4 d-table-cell">
            <MemberForm
              group={groups.filter((group) => group._id === id).at(0)}
              ref={memberFormRef}
            />
          </Col>
          <Col xs={12} xl={5} className="mb-4  d-table-cell">
            <GroupPackageTable
              group={groups.filter((group) => group._id === id).at(0)}
              heightCard={memberFormHeight}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default GroupDetail;
