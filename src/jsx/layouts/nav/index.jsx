import React, { Fragment, useContext, useEffect, useState } from "react";
import SideBar from "./SideBar";
import NavHader from "./NavHader";
import Header from "./Header";
import ChatBox from "../ChatBox";
import { ThemeContext } from "../../../context/ThemeContext";

const JobieNav = ({ title, onClick: ClickToAddEvent, onClick2, onClick3 }) => {
  const [toggle, setToggle] = useState("");
  const onClick = (name) => setToggle(toggle === name ? "" : name);
  const { setHeaderIcon } = useContext(ThemeContext);
  useEffect(() => {
    setHeaderIcon(false);
  }, [setHeaderIcon]);
  return (
    <Fragment>
      <NavHader  nvhader = "first"/>
      <ChatBox onClick={() => onClick("chatbox")} toggle={toggle} />
      <Header
        onNote={() => onClick("chatbox")}
        onNotification={() => onClick("notification")}
        onProfile={() => onClick("profile")}
        toggle={toggle}
        title={title}
        onBox={() => onClick("box")}
        onClick={() => ClickToAddEvent()}        
        
      />
      <SideBar />
    </Fragment>
  );
};

export default JobieNav;
