import React from "react";
import "./header.css";
import UserEnabled from "../userEnabled/userEnabled";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.loginService = props.loginService;
    }

    static get propTypes() {
        return {
            loginService: PropTypes.object,
            signalrService: PropTypes.object,
        }
    }

    render() {
        return (
            <div className="App-header">
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" className="Title">
                            Graph On-Behalf-Of Example
                        </Typography>
                        <UserEnabled loginService={this.loginService} ></UserEnabled>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default Header;