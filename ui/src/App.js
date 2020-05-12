import React, { useState, useEffect } from "react";
import "./App.css";
import LoginService from "./services/loginService";
import Header from "./components/header/header"
import CalendarList from "./components/calendarList/calendarList";
import UserProfile from "./components/userProfile/userProfile";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#212121"
        },
        secondary: {
            main: "#fafafa"
        }
    },
});

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        LoginService
            .notifications()
            .subscribe(res => {
                if (res.action === "login") {
                    setIsLoggedIn(true);
                }
            });
    }, []);

    return (
        <div className="App">
            <MuiThemeProvider theme={theme}>
                <Header></Header>
                {
                    isLoggedIn === false ? <div> &nbsp;&nbsp;&nbsp;Please Switch to Enabled Status</div>
                        : <div className="Dashboard">
                            <CalendarList className="Client-list"></CalendarList>
                            <UserProfile></UserProfile>
                        </div>
                }
            </MuiThemeProvider>
        </div>
    );
}

export default App;