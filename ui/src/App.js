import * as React from "react";
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

let loginService = new LoginService();
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: null,
        }
    }

    componentDidMount() {
        loginService
            .notifications()
            .subscribe(res => {
                if (res.action === "login") {
                    this.setState({ isLoggedIn: true })
                }
            });
    }

    render() {
        return (
            <div className="App">
                <MuiThemeProvider theme={theme}>
                    <Header loginService={loginService}></Header>
                    {
                        this.state.isLoggedIn === null ? <div> &nbsp;&nbsp;&nbsp;Please Switch to Enabled Status</div>
                            : <div className="Dashboard">
                                <CalendarList className="Client-list" loginService={loginService}></CalendarList>
                                <UserProfile loginService={loginService}></UserProfile>
                            </div>
                    }
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;