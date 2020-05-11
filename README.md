# React, MSAL-Browser, RXJS, Api Example

At a high level this repository is to illustrate how to have a user interface built in react authenticate into Azure AD using the [msal-browser](https://www.npmjs.com/package/@azure/msal-browser) to be able to share the ability to get the access token across components in React.

The API is built using [express](https://www.npmjs.com/package/express) for Node.

The UI is built using [react-scripts](https://www.npmjs.com/package/react-scripts) with NPM.

For more information on how we are utilizing Azure AD please see the [docs](docs/flows/azure-ad.md) page.

## Server Application Registration

Reference: [Azure AD Docs Page](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/2.%20Web%20API%20now%20calls%20Microsoft%20Graph#register-the-service-app-todolistservice)

- Create new application registration
- Under Certificates and Secrets
  - Create a new secret
  - Save it for later
- Under API Permissions
  - Add a permission
  - Under Microsoft APIs
    - Select Microsoft Graph
    - Select Delegated Permissions
    - Select "Calendar.Read" and "User.Read"
    - Grant admin consent for your tenant (required because the API will not be able to provide a consent UI during on-behalf-of flow)
- Under Expose an API
  - Add a scope
  - Scope name access_as_user
  - Enter details for user and admin
- Under Manifest
  - Find "accessTokenAcceptedVersion" property and change it to "2"

## Client Application Registration

Reference: [Azure AD Docs Page](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/2.%20Web%20API%20now%20calls%20Microsoft%20Graph#register-the-client-app-todolistclient)

- Create new application registration
- Under Authentication
  - Select single page application for platform
  - Add a redirect url (http://localhost:3000/)
- Under API Permissions
  - Go under My APIs and select the Server app registration from above
  - Under delegated permissions select access_as_user
  - Click add permissions

## Tying Both Together

- Under the API app registration
  - Select Manifest
  - Update "knownClientApplications" to be similar to below

``` json
"knownClientApplications": [
    "ca8dca8d-f828-4f08-82f5-325e1a1c6428"
],
```

## Environment File(s)

./api/.env

``` bash
TENANT_ID="Tenant ID from Server App Registration"
CLIENT_ID="Client ID from Server App Registration"
CLIENT_SECRET="Client Secret from Server App Registration"
SCOPES="https://graph.microsoft.com/Calendars.Read"
ISSUER="Similar to https://login.microsoftonline.com/<Tenant ID>/v2.0"
AUDIENCE="Client ID from Server App Registration"
IDENTITY_METADATA="Similar to https://login.microsoftonline.com/<Tenant ID>/v2.0/.well-known/openid-configuration"
TOKEN_ENDPOINT="Similar to https://login.microsoftonline.com/<Tenant ID>/oauth2/v2.0/token"
```

./ui/.env

``` bash
REACT_APP_BASE_API_URL="http://localhost:5001"
REACT_APP_TENANT_ID="Tenant ID from Client App Registration"
REACT_APP_CLIENT_ID="Client ID from Client App Registration"
REACT_APP_AUTHORITY="Similar to https://login.microsoftonline.com/<Tenant ID>"
REACT_APP_API_SCOPE="api://cqrsexample-server/access_as_user"
REACT_APP_GRAPH_SCOPE_OPENID="openid"
REACT_APP_GRAPH_SCOPE_PROFILE="profile"
```

## Use of RXJS

We are utilizing [rxjs](https://www.npmjs.com/package/rxjs) in order to pass a loginService across components inside React so we can show examples of refreshing a token and obtaining the current access token from Azure AD.

## Contributions

Feel free to make a PR for any contributions.
