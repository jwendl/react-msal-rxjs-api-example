import React, { useState, useEffect } from "react";
import "./userProfile.css";
import LoginService from "../../services/loginService";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const UserProfile = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [objectId, setObjectId] = useState(null);

    LoginService
        .notifications()
        .subscribe(res => {
            if (res.action === "refresh") {
                setAccessToken(res.accessToken);
            }
        });

    useEffect(() => {
        if (accessToken !== null) {
            fetch(process.env.REACT_APP_BASE_API_URL + "/api/profile", {
                headers: {
                    "Authorization": "Bearer " + accessToken
                }
            })
                .then(response => {
                    if (response.status !== 200) {
                        console.log("error");
                    } else {
                        response.json()
                            .then(data => {
                                setDisplayName(data.displayName);
                                setObjectId(data.objectId);
                            })
                    }
                });
        }
    }, [accessToken]);

    const refresh = () => {
        LoginService.refreshToken();
    }

    return (
        <div className="List-container">
            <Button onClick={refresh.bind(this)}>Refresh</Button>

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
                            <TableCell align="right">{displayName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Object Id</TableCell>
                            <TableCell align="right">{objectId}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default UserProfile;
