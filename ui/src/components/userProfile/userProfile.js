import React from "react"
import "./userProfile.css"
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: null,
            objectId: null,
        };

        this.loginService = props.loginService;
    }

    async refresh() {
        await this.loginService.refreshToken();
        await this.refreshUserProfile();
    }

    async refreshUserProfile() {
        fetch(process.env.REACT_APP_BASE_API_URL + "/api/profile", {
            headers: {
                "Authorization": "Bearer " + this.state.accessToken
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    console.log("error");
                } else {
                    response.json()
                        .then(data => {
                            this.setState({ displayName: data.displayName, objectId: data.id });
                        })
                }
            });
    }

    async componentDidMount() {
        this.loginService
            .notifications()
            .subscribe(res => {
                if (res.action === "refresh") {
                    this.setState({
                        accessToken: res.accessToken,
                        uniqueId: res.uniqueId,
                    });

                    this.refreshUserProfile();
                }
            });
    }

    static get propTypes() {
        return {
            loginService: PropTypes.object,
        }
    }

    render() {
        return (
            <div className="List-container">
                <Typography variant="h6" className="Stats-title">
                    User Profile
                </Typography>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Property</TableCell>
                                <TableCell align="right">Value</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell align="right">{this.state.displayName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Object Id</TableCell>
                                <TableCell align="right">{this.state.objectId}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
}

export default UserProfile;
