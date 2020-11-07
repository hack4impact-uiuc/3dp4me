import React, { useState, useEffect } from "react";

import { AppBar, Avatar, Toolbar } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
<<<<<<< HEAD
import Logo from '../../Assets/3dp4me_logo.png';

import "./Navbar.scss";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));
=======
import Logo from '../../icons/3dp4me_logo.png';
import colors from '../../colors.json'
>>>>>>> origin/aws-backend-auth


const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));


const Navbar = (props) => {
  const classes = useStyles();
  const [active, setActive] = useState("dashboard");
  const lang = props.lang.data;
  const key = props.lang.key;


  return (
    <div className={`wrap-nav`}>
      <AppBar className={classes.appBar}>
        <Toolbar className="navbar">
<<<<<<< HEAD
          <img className={key === "AR" ? "logo-ar" : ""} width={40} src={Logo} />
=======
          <img style={key === "AR" ? {marginLeft: '15px'}: {}} width={40} src={Logo} />
>>>>>>> origin/aws-backend-auth

          <Link onClick={() => setActive("dashboard")} id="nav-title" className="nav-item" to="/">
            {lang[key].components.navbar.dashboard.navTitle}
          </Link>
          {active === "dashboard" ? (
            <Link className="nav-item active" to="/">
              {lang[key].components.navbar.dashboard.navTitle}
            </Link>
          ) : (
              <Link onClick={() => setActive("dashboard")} className="nav-item" to="/">
                {lang[key].components.navbar.dashboard.navTitle}
              </Link>
            )}
          {active === "patients" ? (

            <Link className="nav-item active" to="/patients">
              {lang[key].components.navbar.patients.navTitle}
            </Link>
          ) : (
              <Link onClick={() => setActive("patients")} className="nav-item" to="/patients">
                {lang[key].components.navbar.patients.navTitle}
              </Link>
            )}
          {active === "metrics" ? (
            <Link className="nav-item active" to="/metrics">
              {lang[key].components.navbar.metrics.navTitle}
            </Link>

          ) : (
              <Link onClick={() => setActive("metrics")} className="nav-item" to="/metrics">
                {lang[key].components.navbar.metrics.navTitle}
              </Link>
            )}
          {active === "account" ? (
            <Link className="nav-item active" to="/account">
              {lang[key].components.navbar.accountManagement.navTitle}
            </Link>

          ) : (
              <Link onClick={() => setActive("account")} className="nav-item" to="/account">
                {lang[key].components.navbar.accountManagement.navTitle}
              </Link>
            )}
<<<<<<< HEAD
          <Avatar className="user-avatar">EE</Avatar>
=======
          <Avatar style={{ backgroundColor: "#ff9900", marginLeft: 20, marginRight: 10 }}>EE</Avatar>
>>>>>>> origin/aws-backend-auth
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
