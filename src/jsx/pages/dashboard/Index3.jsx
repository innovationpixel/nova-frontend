import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import Dashboard from "../admin/dashboard/Dashboard";

const Index3 = () => {
  const { setHeaderIcon } = useContext(ThemeContext);
  useEffect(() => {
    setHeaderIcon(true);
  }, [setHeaderIcon]);
  return (
    <>
      <Dashboard />
    </>
  );
};

export default Index3;
