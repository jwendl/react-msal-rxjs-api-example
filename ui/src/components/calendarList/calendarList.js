import "./calendarList.css";
import * as React from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";

class CalendarList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarItems: [],
            accessToken: null,
            uniqueId: null,
        }

        this.loginService = props.loginService;
    }

    async componentDidMount() {
        this.loginService
            .notifications()
            .subscribe(res => {
                if (res.action === "refresh") {
                    this.setState({
                        accessToken: res.accessToken,
                        uniqueId: res.uniqueId,
                    })

                    this.refreshCalendarList();
                }
            });
    }

    async refresh() {
        await this.loginService.refreshToken();
        await this.refreshCalendarList();
    }

    async refreshCalendarList() {
        fetch(process.env.REACT_APP_BASE_API_URL + "/api/events", {
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
                            this.setState({ calendarItems: data.value });
                        })
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
                {
                    <Grid container spacing={2} className="Grid">
                        <Typography variant="h6" className="List-title">
                            Calendar Items
                        </Typography>

                        <Button onClick={this.refresh.bind(this)}>Refresh</Button>

                        <List className="List">
                            {
                                this.state.calendarItems.map((calendarItem) => (
                                    <div>
                                        <ListItem className="List-Item" key={calendarItem.id}>
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
}

export default CalendarList;