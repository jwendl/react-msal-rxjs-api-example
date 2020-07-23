import * as msal from "@azure/msal-browser";
import { Subject } from "rxjs";

const loginRequest = {
    scopes: [process.env.REACT_APP_API_SCOPE, process.env.REACT_APP_GRAPH_SCOPE_OPENID, process.env.REACT_APP_GRAPH_SCOPE_PROFILE],
};

const refreshRequest = {
    scopes: [process.env.REACT_APP_API_SCOPE],
    forceRefresh: false,
};

const config = {
    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID,
        authority: process.env.REACT_APP_AUTHORITY,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

const publicClientApplication = new msal.PublicClientApplication(config);
const subject = new Subject();

const sendLogin = (loginResponse) => {
    var response = {
        action: "login",
        accessToken: loginResponse.accessToken,
        uniqueId: loginResponse.uniqueId,
    }

    subject.next(response);
    sendRefresh(loginResponse);
}

const sendRefresh = (loginResponse) => {
    var response = {
        action: "refresh",
        accessToken: loginResponse.accessToken,
        uniqueId: loginResponse.uniqueId,
    }

    subject.next(response);
}

const LoginService = {
    login: function () {
        publicClientApplication.loginPopup(loginRequest).then(async (response) => {
            sendLogin(response);
        })
            .catch(async (error) => {
                console.log("There was an error with login: " + error);
            });
    },
    refreshToken: function () {
        publicClientApplication.acquireTokenSilent(refreshRequest)
            .then(async (response) => {
                sendRefresh(response);
            })
            .catch(async (error) => {
                publicClientApplication.acquireTokenPopup(refreshRequest)
                    .then(async (response) => {
                        sendRefresh(response);
                    })
                    .catch(async (error) => {
                        console.log("error: " + error);
                    });
            });
    },
    logoff: function () {
        publicClientApplication.logout();
    },
    notifications: function () {
        return subject.asObservable();
    }
}

export default LoginService;