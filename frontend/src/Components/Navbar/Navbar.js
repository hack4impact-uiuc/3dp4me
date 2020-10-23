import React, {useState} from "react";

import { AppBar, Avatar, Toolbar } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Logo from '../../icons/3dp4me_logo.png';

import "./Navbar.css";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  const [active, setActive] = useState("dashboard")
  return (
    <div className="wrap-nav">
      <AppBar className={classes.appBar}>
        <Toolbar className="navbar">
          <img width={60} src={Logo} />

          <Link onClick={() => setActive("dashboard")} id="nav-title" className="nav-item" to="/">
            Dashboard
      </Link>
          {active === "dashboard" ? (
            <Link className="nav-item active" to="/">
              Dashboard
            </Link>
          ) : (
              <Link onClick={() => setActive("dashboard")} className="nav-item" to="/">
                Dashboard
              </Link>
            )}
          {active === "patients" ? (

            <Link className="nav-item active" to="/patients">
              Patients
            </Link>
          ) : (
              <Link onClick={() => setActive("patients")} className="nav-item" to="/patients">
                Patients
              </Link>
            )}
          {active === "metrics" ? (
            <Link className="nav-item active" to="/metrics">
              Metrics
            </Link>

          ) : (
              <Link onClick={() => setActive("metrics")} className="nav-item" to="/metrics">
                Metrics
              </Link>
            )}
          {active === "account" ? (
            <Link className="nav-item active" to="account">
              Account Management
            </Link>

          ) : (
              <Link onClick={() => setActive("account")} className="nav-item" to="account">
                Account Management
              </Link>
            )}
          <Avatar style={{ backgroundColor: "#ff9900", marginLeft: 20, marginRight: 10 }}>EE</Avatar>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
