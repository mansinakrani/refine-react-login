import { Refine, AuthProvider } from "@pankod/refine-core";
import {   notificationProvider,
  ReadyPage,
  ErrorComponent, } from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { AccountInfo, SilentRequest } from "@azure/msal-browser";
import axios, { AxiosRequestConfig } from "axios";

import "styles/antd.less";
import {
  Title,
  Header,
  Sider,
  Footer,
  Layout,
  OffLayoutArea,
} from "components/layout";
import { PostList, PostCreate, PostEdit, PostShow } from "./pages/posts";


import LoginPage from "./login";
import { tokenRequest } from "./config";

export const TOKEN_KEY = "refine-auth";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    // Here we can perform any function we'd like on the request
    (request: AxiosRequestConfig) => {
        // Retrieve the token from local storage
        const token = localStorage.getItem(TOKEN_KEY);

        // Check if the header property exists
        if (request.headers) {
            // Set the Authorization header if it exists
            request.headers["Authorization"] = `Bearer ${token}`;
        } else {
            // Create the headers property if it does not exist
            request.headers = {
                Authorization: `Bearer ${token}`,
            };
        }
        return request;
    },
);

const App: React.FC = () => {
    const API_URL = "https://api.fake-rest.refine.dev";

    const isAuthenticated = useIsAuthenticated();
    const { instance, inProgress, accounts } = useMsal();

    if (inProgress === "login" || inProgress === "handleRedirect") {
        return <div>Loading...</div>;
    }

    const account: AccountInfo = accounts[0];

    const request: SilentRequest = {
        ...tokenRequest,
        account,
    };

    const authProvider: AuthProvider = {
        login: () => {
            instance.loginRedirect(); // Pick the strategy you prefer i.e. redirect or popup
            return Promise.resolve(false);
        },
        register: async () => Promise.resolve(),
        // resetPassword: async () => Promise.resolve(),
        updatePassword: async () => Promise.resolve(),
        logout: async () => Promise.resolve(),
        checkAuth: async () => {
            try {
                if (account) {
                    const token = await instance.acquireTokenSilent(request);
                    localStorage.setItem(TOKEN_KEY, token.accessToken);
                    return Promise.resolve();
                } else {
                    return Promise.reject();
                }
            } catch (e) {
                return Promise.reject();
            }
        },
        checkError: async () => Promise.resolve(),
        getPermissions: async () => Promise.resolve(),
        getUserIdentity: async (): Promise<AccountInfo> => {
            if (account === null || account === undefined) {
                return Promise.reject();
            }
            return Promise.resolve(account);
        },
    };

    return (
        <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider(API_URL, axiosInstance)}
            authProvider={authProvider}
            LoginPage={LoginPage}
            notificationProvider={notificationProvider}
            ReadyPage={ReadyPage}
            catchAll={<ErrorComponent />}
            Title={Title}
            Header={Header}
            Sider={Sider}
            Footer={Footer}
            Layout={Layout}
            OffLayoutArea={OffLayoutArea}
            // resources={[
            //   {
            //       name: "posts",
            //   }
            // ]}
      resources={[
        {
          name: "posts",
          list: PostList,
          create: PostCreate,
          edit: PostEdit,
          show: PostShow,
        },
      ]}
        />
    );
};

export default App;

// import React from "react";

// import { Refine } from "@pankod/refine-core";
// import {
//   notificationProvider,
//   ReadyPage,
//   ErrorComponent,
// } from "@pankod/refine-antd";

// import dataProvider from "@pankod/refine-simple-rest";
// import routerProvider from "@pankod/refine-react-router-v6";
// import "styles/antd.less";
// import {
//   Title,
//   Header,
//   Sider,
//   Footer,
//   Layout,
//   OffLayoutArea,
// } from "components/layout";
// import { PostList, PostCreate, PostEdit, PostShow } from "pages/posts";

// function App() {
//   return (
//     <Refine
//       dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
//       notificationProvider={notificationProvider}
//       ReadyPage={ReadyPage}
//       catchAll={<ErrorComponent />}
//       Title={Title}
//       Header={Header}
//       Sider={Sider}
//       Footer={Footer}
//       Layout={Layout}
//       OffLayoutArea={OffLayoutArea}
//       routerProvider={routerProvider}
//       resources={[
//         {
//           name: "posts",
//           list: PostList,
//           create: PostCreate,
//           edit: PostEdit,
//           show: PostShow,
//         },
//       ]}
//     />
//   );
// }

// export default App;
