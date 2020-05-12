import React, { useState } from "react";
import LoginService from "../../services/loginService";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const UserEnabled = () => {
    const [checked, setChecked] = useState(false);
    const [label, setLabel] = useState(null);

    LoginService
        .notifications()
        .subscribe(res => {
            if (res.action === "login") {
                setChecked(true);
                setLabel("User Enabled");
            }
        });

    return (
        <FormGroup row>
            <FormControlLabel
                control={
                    <Switch
                        checked={checked}
                        onChange={LoginService.login.bind(this)}
                        color="primary"
                        name="agentEnabled"
                        inputProps={{ "aria-label": "primary checkbox" }}
                    />
                }
                label={label} />
        </FormGroup>
    );
}

export default UserEnabled;