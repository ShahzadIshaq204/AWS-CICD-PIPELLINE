import React from "react";
import MainWrapper from "layout-pages/common/MainWrapper";
import { Card, CardBody } from "reactstrap";
import { useSelector } from "react-redux";
import FormEditProfile from "./components/FormEditProfile";
import FormEditPswd from "./components/FormEditPswd";

export default function Profile() {
  const user = useSelector(state => state.Login.user);

  return (
    <MainWrapper title={"My profile"} heading={"My profile"}>
      <Card>
        <CardBody>
          <h5>Profile Settings</h5>
          <FormEditProfile editData={user} />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h5>Privacy Settings</h5>
          <FormEditPswd editData={user} />
        </CardBody>
      </Card>
    </MainWrapper>
  );
}
