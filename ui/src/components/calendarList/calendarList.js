import React, { useState, useEffect } from "react";
import "./calendarList.css";
import LoginService from "../../services/loginService";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const CalendarList = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [calendarItems, setCalendarItems] = useState([]);

    LoginService
        .notifications()
        .subscribe(res => {
            if (res.action === "refresh") {
                setAccessToken(res.accessToken);
            }
        });

    useEffect(() => {
        if (accessToken !== null) {
            fetch(process.env.REACT_APP_BASE_API_URL + "/api/events", {
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
                                setCalendarItems(data.value);
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
            {
                <Grid container spacing={2} className="Grid">
                    <Typography variant="h6" className="List-title">
                        Calendar Items
                    </Typography>

                    <Button onClick={refresh.bind(this)}>Refresh</Button>

                    <List className="List">
                        {
                            calendarItems.map((calendarItem) => (
                                <div key={calendarItem.id.toString()}>
                                    <ListItem className="List-Item" key={calendarItem.id.toString()}>
                                        <ListItemText primary={calendarItem.subject} className="Title" />
                                    </ListItem>
                                </div>
                            ))
                        }
                    </List>
                </Grid>
            }
        </div>
    );
}

export default CalendarList;