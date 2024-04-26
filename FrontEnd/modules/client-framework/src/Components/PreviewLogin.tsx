import { getCookie } from "@insite/client-framework/Common/Cookies";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import previewLogin from "@insite/client-framework/Store/Context/Handlers/PreviewLogin";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    previewLoginEnabled: getSettingsCollection(state).websiteSettings.previewLoginEnabled,
});

const mapDispatchToProps = {
    previewLogin,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext;

interface State {
    username: string;
    password: string;
    errorMessage: string;
}

const CenteringWrapper = styled.div`
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const Description = styled.span`
    text-align: center;
    margin: 0 40px 40px;
`;

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 250px;
`;

const UsernameLabel = styled.span`
    margin: 10px 0 5px 0;
    font-weight: 600;
`;

const UsernameInput = styled.input`
    padding: 8px;
`;

const PasswordLabel = styled.span`
    margin: 10px 0 5px 0;
    font-weight: 600;
`;

const PasswordInput = styled.input`
    padding: 8px;
`;

const LoginButton = styled.button`
    margin-top: 20px;
    padding: 8px;
`;

const ErrorMessage = styled.span`
    margin-top: 20px;
    text-align: center;
    color: red;
`;

class PreviewLogin extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            errorMessage: "",
        };
    }

    usernameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ username: event.currentTarget.value, errorMessage: "" });
    };

    passwordChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: event.currentTarget.value, errorMessage: "" });
    };

    logInClickHandler = () => {
        if (!this.state.username || !this.state.password) {
            return;
        }

        this.props.previewLogin({
            username: this.state.username,
            password: this.state.password,
            onSuccess: () => {
                window.location.reload();
            },
            onError: errorMessage => {
                this.setState({ errorMessage });
            },
        });
    };

    render() {
        if (
            !this.props.previewLoginEnabled ||
            getCookie("PreviewLoggedIn") === "true" ||
            this.props.shellContext.isInShell
        ) {
            return this.props.children;
        }

        return (
            <CenteringWrapper>
                <Description>
                    The website you are attempting to view is for testing and demonstration purposes only. <br />
                    To preview the website you will need to log in.
                </Description>
                <FormWrapper>
                    <UsernameLabel>Username</UsernameLabel>
                    <UsernameInput value={this.state.username} onChange={this.usernameChangeHandler} />
                    <PasswordLabel>Password</PasswordLabel>
                    <PasswordInput value={this.state.password} type="password" onChange={this.passwordChangeHandler} />
                    <LoginButton onClick={this.logInClickHandler}>Log In</LoginButton>
                </FormWrapper>
                <ErrorMessage>{this.state.errorMessage}</ErrorMessage>
            </CenteringWrapper>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withIsInShell(PreviewLogin));
