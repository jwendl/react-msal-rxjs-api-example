var express = require('express');
var passport = require('passport');
var request = require('request');
require('dotenv').config();

var BearerStrategy = require("passport-azure-ad").BearerStrategy;

var options = {
    identityMetadata: process.env.IDENTITY_METADATA,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    scopes: process.env.SCOPES,
    issuer: process.env.ISSUER,
    audience: process.env.AUDIENCE,
    loggingLevel: "info",
    passReqToCallback: false
};

var bearerStrategy = new BearerStrategy(options, function (token, done) {
    done(null, {}, token);
});

var app = express();
app.use(require('morgan')('combined'));
app.use(passport.initialize());
passport.use(bearerStrategy);

// Enable CORS for * because this is a demo project
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// This is where your API methods are exposed
app.get(
    "/api/profile",
    passport.authenticate("oauth-bearer", { session: false }),
    function (req, res) {
        // the access token the user sent
        const userToken = req.get("authorization");
        // request new token and use it to call resource API on user's behalf
        getNewAccessToken(userToken, newTokenRes => {
            callMeEndpoint(newTokenRes.access_token, (apiResponse) => {
                res.status(200).json(JSON.parse(apiResponse));
            });

            if (req.path.indexOf("events") > -1) {
                callCalendarListEndpoint(newTokenRes.access_token, (apiResponse) => {
                    res.status(200).json(JSON.parse(apiResponse));
                });
            }
        });
    }
);

app.get(
    "/api/events",
    passport.authenticate("oauth-bearer", { session: false }),
    function (req, res) {
        // the access token the user sent
        const userToken = req.get("authorization");
        // request new token and use it to call resource API on user's behalf
        getNewAccessToken(userToken, newTokenRes => {
            callCalendarListEndpoint(newTokenRes.access_token, (apiResponse) => {
                res.status(200).json(JSON.parse(apiResponse));
            });
        });
    }
);

function getNewAccessToken(userToken, callback) {
    const [bearer, tokenValue] = userToken.split(" ");

    var options = {
        method: 'POST',
        url: process.env.TOKEN_ENDPOINT,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            scope: process.env.SCOPES,
            assertion: tokenValue,
            requested_token_use: 'on_behalf_of'
        },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(body);
    });
}

function callMeEndpoint(newTokenValue, callback) {
    var location = 'https://graph.microsoft.com/v1.0/me/';
    request.get({
        headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + newTokenValue }
        , url: location, body: ''
    }, function (error, response, body) {
        callback(body);
    });
}

function callCalendarListEndpoint(newTokenValue, callback) {
    var location = 'https://graph.microsoft.com/v1.0/me/calendar/events';
    request.get({
        headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + newTokenValue }
        , url: location, body: ''
    }, function (error, response, body) {
        callback(body);
    });
}

// Run this
var port = process.env.PORT || 5001;
app.listen(port, function () {
    console.log("Listening on port " + port);
});