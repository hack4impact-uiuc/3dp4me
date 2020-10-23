import React from "react";

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
  return (
    <div className="wrap-nav">
      <AppBar className={classes.appBar}>
        <Toolbar className="navbar">
          <img width={60} src={Logo} />
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
       <Avatar style={{backgroundColor: "#ff9900", marginLeft: 20, marginRight: 10}}>EE</Avatar>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
