import React from "react";
import { AmplifySignOut } from '@aws-amplify/ui-react';
import Menu from '@material-ui/core/Menu';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  languageSelector: {
    display: "flex",
    justifyContent: "center",
    height: "42px",
  },
  signOutButton: {
    padding: "8px 18px 0px 18px",
  }
});

const AccountDropdown = (props) => {
  const styles = useStyles();
  const key = props.lang.key;

  const handleLanguageSelect = (e, selectedLang) => {
    props.setLang(selectedLang);
  }

  return (
    <div>
      <Menu
        id="account-dropdown-menu"
        anchorEl={props.anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom' }}
        keepMounted
        open={Boolean(props.anchorEl)}
        onClose={props.handleClose}
      >
        <div className={styles.languageSelector}>
          <ToggleButtonGroup
            value={key}
            exclusive
            onChange={handleLanguageSelect}
          >
            <ToggleButton value="EN">
              English
            </ToggleButton>
            <ToggleButton value="AR">
              Arabic
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className={styles.signOutButton}><AmplifySignOut/></div>
      </Menu>
    </div>
  );
};

export default AccountDropdown;
