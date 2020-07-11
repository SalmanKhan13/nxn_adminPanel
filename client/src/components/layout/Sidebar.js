import React from "react";
import { NavLink, Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="sidebar"
      data-color="purple"
      data-background-color="white"
      data-image="assets/img/sidebar-1.jpg"
    >
      <div className="logo">
        <Link to="/" className="simple-text logo-normal">
          NxN Team
        </Link>
      </div>
      <div className="sidebar-wrapper">
        <ul className="nav">
          <li className="nav-item  ">
            <NavLink
              className="nav-link"
              activeStyle={{
                backgroundColor: "rgb(156, 39, 176)",
                color: "white"
              }}
              to="./dashboard"
            >
              <i className="material-icons">dashboard</i>
              <p>Dashboard</p>
            </NavLink>
          </li>
          <li className="nav-item ">
            <NavLink
              className="nav-link"
              activeStyle={{
                backgroundColor: "rgb(156, 39, 176)",
                color: "white",
              }}
              to="./userprofile"
            >
              <i className="material-icons">person</i>
              <p>User Profile</p>
            </NavLink>
          </li>
          <li className="nav-item ">
            <NavLink
              className="nav-link"
              activeStyle={{
                backgroundColor: "rgb(156, 39, 176)",
                color: "white",
              }}
              to="./users"
            >
              <i className="material-icons">content_paste</i>
              <p>Users</p>
            </NavLink>
          </li>
          {/* <li className="nav-item ">
            <NavLink
              className="nav-link"
              activeStyle={{
                 backgroundColor: "rgb(156, 39, 176)",
                color: "white",
              }}
              to="./typography"
            >
              <i className="material-icons">library_books</i>
              <p>Typography</p>
            </NavLink>
          </li>
          <li className="nav-item ">
            <NavLink
              className="nav-link"
              activeStyle={{
                 backgroundColor: "rgb(156, 39, 176)",
                color: "white",
              }}
              to="./icons"
            >
              <i className="material-icons">bubble_chart</i>
              <p>Icons</p>
            </NavLink>
          </li>
          <li className="nav-item ">
            <NavLink
              className="nav-link"
              activeStyle={{
                 backgroundColor: "rgb(156, 39, 176)",
                color: "white"
              }}
              to="./map"
            >
              <i className="material-icons">location_ons</i>
              <p>Maps</p>
            </NavLink>
          </li>
          <li className="nav-item ">
            <NavLink
              className="nav-link"
              activeStyle={{
                 backgroundColor: "rgb(156, 39, 176)",
                color: "white"
              }}
              to="./notifications"
            >
              <i className="material-icons">notifications</i>
              <p>Notifications</p>
            </NavLink>
          </li>
          <li className="nav-item ">
            <NavLink
              className="nav-link"
              activeStyle={{
                 backgroundColor: "rgb(156, 39, 176)",
                color: "white"
              }}
              to="./rtl"
            >
              <i className="material-icons">language</i>
              <p>RTL Support</p>
            </NavLink>
          </li>
          <li className="nav-item active-pro ">
            <NavLink
              className="nav-link"
              activeStyle={{
                 backgroundColor: "rgb(156, 39, 176)",
                color: "white"
              }}
              to="./upgrade"
            >
              <i className="material-icons">unarchive</i>
              <p>Upgrade to PRO</p>
            </NavLink>
          </li> */}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
