import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import PropTypes from "prop-types";

class UserEnabled extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            label: "User Disabled",
        };

        this.loginService = props.loginService;
    }

    async componentDidMount() {
        this.loginService
            .notifications()
            .subscribe(res => {
                if (res.action === "login") {
                    this.setState({
                        checked: true,
                        label: "User Enabled",
                    });

                    this.loginService.refreshToken();
                }
            });
    }

    async login() {
        await this.loginService.login();
    }

    static get propTypes() {
        return {
            loginService: PropTypes.object,
        }
    }

    render() {
        return (
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Switch
                            checked={this.state.checked}
                            onChange={this.login.bind(this)}
                            color="primary"
                            name="agentEnabled"
                            inputProps={{ "aria-label": "primary checkbox" }}
                        />
                    }
                    label={this.state.label} />
            </FormGroup>
        );
    }
}

export default UserEnabled;