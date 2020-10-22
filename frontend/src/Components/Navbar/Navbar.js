import React from "react";

import { AppBar, Toolbar } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

import "./Navbar.css";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  return (
    <div className="wrap-nav">
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className="navbar">
          <Link id="nav-title" className="nav-item" to="/">
            Dashboard
      </Link>
          <Link className="nav-item" to="/">
            Dashboard
     </Link>
          <Link className="nav-item" to="/patients">
            Patients
       </Link>
          <Link className="nav-item" to="/metrics">
            Metrics
       </Link>
          <Link className="nav-item" to="account">
            Account Management
       </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
