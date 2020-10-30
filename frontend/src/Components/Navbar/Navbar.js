import React, { useState, useEffect } from "react";

import { AppBar, Avatar, Toolbar } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Logo from '../../icons/3dp4me_logo.png';
// import lang from '../../language.json';

import "./Navbar.css";

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
      {/* {key === "EN" ? (
        <AppBar className={classes.appBar}>
          <Toolbar className="navbar">
            <img width={60} src={Logo} />

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
              <Link className="nav-item active" to="account">
                {lang[key].components.navbar.accountManagement.navTitle}
              </Link>

            ) : (
                <Link onClick={() => setActive("account")} className="nav-item" to="account">
                  {lang[key].components.navbar.accountManagement.navTitle}
                </Link>
              )}
            <Avatar style={{ backgroundColor: "#ff9900", marginLeft: 20, marginRight: 10 }}>EE</Avatar>
          </Toolbar>
        </AppBar>
      ) : (
          <AppBar className={classes.appBar}>
            <Toolbar className="navbar">
              <Avatar style={{ backgroundColor: "#ff9900", marginLeft: 20, marginRight: 10 }}>EE</Avatar>
              {active === "account" ? (
                <Link className="nav-item active" to="account">
                  {lang[key].components.navbar.accountManagement.navTitle}
                </Link>

              ) : (
                  <Link onClick={() => setActive("account")} className="nav-item" to="account">
                    {lang[key].components.navbar.accountManagement.navTitle}
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

              {active === "patients" ? (

                <Link className="nav-item active" to="/patients">
                  {lang[key].components.navbar.patients.navTitle}
                </Link>
              ) : (
                  <Link onClick={() => setActive("patients")} className="nav-item" to="/patients">
                    {lang[key].components.navbar.patients.navTitle}
                  </Link>
                )}
              {active === "dashboard" ? (
                <Link id="nav-title" className="nav-item active" to="/">
                  {lang[key].components.navbar.dashboard.navTitle}
                </Link>
              ) : (
                  <Link onClick={() => setActive("dashboard")} id="nav-title" className="nav-item" to="/">
                    {lang[key].components.navbar.dashboard.navTitle}
                  </Link>
                )}
              <Link onClick={() => setActive("dashboard")} className="nav-item" to="/">
                {lang[key].components.navbar.dashboard.navTitle}
              </Link>
              <img style={{ marginLeft: '15px' }} width={60} src={Logo} />
            </Toolbar>
          </AppBar>
        )} */}
      <AppBar className={classes.appBar}>
        <Toolbar className="navbar">
          <img width={60} src={Logo} />

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
            <Link className="nav-item active" to="account">
              {lang[key].components.navbar.accountManagement.navTitle}
            </Link>

          ) : (
              <Link onClick={() => setActive("account")} className="nav-item" to="account">
                {lang[key].components.navbar.accountManagement.navTitle}
              </Link>
            )}
          <Avatar style={{ backgroundColor: "#ff9900", marginLeft: 20, marginRight: 10 }}>EE</Avatar>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
