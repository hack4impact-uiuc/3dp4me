import React, { useState, useEffect } from "react";

import { AppBar, Avatar, Toolbar } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Logo from '../../assets/3dp4me_logo.png';

import "./Navbar.scss";

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
    <div className="wrap-nav">
      <AppBar className={classes.appBar}>
        <Toolbar className="navbar">
          <img className={key === "AR" ? "logo-ar" : ""} width={40} src={Logo} />

          <Link onClick={() => setActive("dashboard")} id="nav-title" className="nav-item" to="/">
            {lang[key].components.navbar.dashboard.navTitle}
          </Link>
          <Link className={`nav-item ${active === "dashboard" ? "active" : ""}`} onClick={() => setActive("dashboard")} to="/">
            {lang[key].components.navbar.dashboard.navTitle}
          </Link>
          <Link className={`nav-item ${active === "patients" ? "active" : ""}`} onClick={() => setActive("patients")} to="/patients">
            {lang[key].components.navbar.patients.navTitle}
          </Link>
          <Link className={`nav-item ${active === "metrics" ? "active" : ""}`} onClick={() => setActive("metrics")} to="/metrics">
            {lang[key].components.navbar.metrics.navTitle}
          </Link>
          <Link className={`nav-item ${active === "account" ? "active" : ""}`} onClick={() => setActive("account")} to="/account">
            {lang[key].components.navbar.accountManagement.navTitle}
          </Link>
          <Avatar className="user-avatar">EE</Avatar>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
