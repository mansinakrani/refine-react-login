import React from "react";
import ReactDOM from "react-dom/client";

import {
    EventType,
    PublicClientApplication,
    AccountInfo,
    EventPayload,
    SilentRequest,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

import App, { TOKEN_KEY } from "./App";
import { msalConfig, tokenRequest } from "./config";

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.addEventCallback(async (event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
        const payload: EventPayload = event.payload;
        msalInstance.setActiveAccount(payload as AccountInfo);

        let account = msalInstance.getActiveAccount();

        const request: SilentRequest = {
            ...tokenRequest,
            account: account!,
        };
        try {
            // Silently acquires an access token which is then attached to a request for API access
            const response = await msalInstance.acquireTokenSilent(request);
            console.log("Fetching access token: success");
            console.log("Scopes", response.scopes);
            console.log("Token Type", response.tokenType);

            localStorage.setItem(TOKEN_KEY, response.accessToken);
        } catch (e) {
            msalInstance.acquireTokenPopup(request).then((response) => {
                localStorage.setItem(TOKEN_KEY, response.accessToken);
            });
        }
    }
});

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
root.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <App />
        </MsalProvider>
    </React.StrictMode>,
);