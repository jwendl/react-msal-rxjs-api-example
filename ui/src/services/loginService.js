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

export default class LoginService {
    constructor() {
        this.subject = new Subject();
    }

    async login() {
        await publicClientApplication.loginPopup(loginRequest).then(async (response) => {
            this.sendLogin(response);
        })
            .catch(async (error) => {
                console.log("There was an error with login: " + error);
            });
    };

    async refreshToken() {
        await publicClientApplication.acquireTokenSilent(refreshRequest)
            .then(async (response) => {
                this.sendRefresh(response);
            })
            .catch(async (error) => {
                await publicClientApplication.acquireTokenPopup(refreshRequest)
                    .then(async (response) => {
                        this.sendRefresh(response);
                    })
                    .catch(async (error) => {
                        console.log("error: " + error);
                    });
            });
    }

    logoff() {
        publicClientApplication.logout();
    }

    sendLogin(loginResponse) {
        var response = {
            action: "login",
            accessToken: loginResponse.accessToken,
            uniqueId: loginResponse.uniqueId,
        }

        this.subject.next(response);
    }

    sendRefresh(loginResponse) {
        var response = {
            action: "refresh",
            accessToken: loginResponse.accessToken,
            uniqueId: loginResponse.uniqueId,
        }

        this.subject.next(response);
    }

    notifications() {
        return this.subject.asObservable();
    }
}