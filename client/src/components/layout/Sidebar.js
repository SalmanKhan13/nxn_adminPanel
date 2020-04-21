import React from 'react';
import { Link } from 'react-router-dom';


const Sidebar = () => {
    return (
       
         <div className="sidebar" data-color="purple" data-background-color="white" data-image="assets/img/sidebar-1.jpg">
     
      <div className="logo"><Link to="/" className="simple-text logo-normal">
          SeeBiz Team 
        </Link></div>
      <div className="sidebar-wrapper">
        <ul className="nav">
          <li className="nav-item active  ">
            <Link className="nav-link" to="./dashboard">
              <i className="material-icons">dashboard</i>
              <p>Dashboard</p>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="./user">
              <i className="material-icons">person</i>
              <p>User Profile</p>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="./tables">
              <i className="material-icons">content_paste</i>
              <p>Table List</p>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="./typography.html">
              <i className="material-icons">library_books</i>
              <p>Typography</p>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="./icons.html">
              <i className="material-icons">bubble_chart</i>
              <p>Icons</p>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="./map.html">
              <i className="material-icons">location_ons</i>
              <p>Maps</p>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="./notifications.html">
              <i className="material-icons">notifications</i>
              <p>Notifications</p>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="./rtl.html">
              <i className="material-icons">language</i>
              <p>RTL Support</p>
            </Link>
          </li>
          <li className="nav-item active-pro ">
            <Link className="nav-link" to="./upgrade.html">
              <i className="material-icons">unarchive</i>
              <p>Upgrade to PRO</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
     
    )
}
export default Sidebar;