import React from "react";
import { useLogin } from "@pankod/refine-core";
import { AntdLayout, Button } from "@pankod/refine-antd";
// import { loginRequest } from "config";
// import { useMsal } from "@azure/msal-react";

// type LoginVariables = {
//     username: string;
//     password: string;
// };
const LoginPage = () => {
    const SignInButton = () => {
        const { mutate: login } = useLogin();
        // const { instance } = useMsal();
        // const { mutate: login } = useLogin<{ LoginVariables: any }>();        
        
        // const onSubmit = (values: LoginVariables) => {
        //     login(values);
        // };
        // const onSubmit = (values) => {
        //     login(values);
        // };

        return (
            <Button onClick={(values) => {
                login(values);
            }}
                type="primary"
                size="large"
                block
            >
                Sign in
            </Button>
        );
    };

    return (
        <AntdLayout
            style={{
                background: `radial-gradient(50% 50% at 50% 50%, #63386A 0%, #310438 100%)`,
                backgroundSize: "cover",
            }}
        >
            <div style={{ height: "100vh", display: "flex" }}>
                <div style={{ maxWidth: "200px", margin: "auto" }}>
                    <div style={{ marginBottom: "28px" }}>
                        <img src="./refine.svg" alt="Refine" />
                    </div>
                    <SignInButton />
                </div>
            </div>
        </AntdLayout>
    );

};

export default LoginPage;