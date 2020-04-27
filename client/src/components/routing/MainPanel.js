import React from "react";
import Routes from "./Routes";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";

const MainPanel = () => {
  return (
    <div className="main-panel">
      <Sidebar />
      <Routes />
      <Footer />
    </div>
  );
};
export default MainPanel;
