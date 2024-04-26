import Button from "@insite/mobius/Button";
import Modal from "@insite/mobius/Modal";
import ButtonBar from "@insite/shell/Components/Modals/ButtonBar";
import { refreshAccessToken } from "@insite/shell/Services/AccessTokenService";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";

const mapStateToProps = ({ logoutWarningModal: { isOpen } }: ShellState) => ({
    isOpen,
});

type Props = ReturnType<typeof mapStateToProps> & DispatchProp<AnyShellAction>;

const LogoutWarningModal: React.FC<Props> = ({ dispatch, isOpen }) => {
    const close = () => {
        dispatch({
            type: "LogoutWarningModal/HideModal",
        });
    };

    const keepLoggedIn = () => {
        refreshAccessToken();
        close();
    };

    return (
        <Modal size={350} isOpen={!!isOpen} headline="Warning" isCloseable handleClose={close} closeOnEsc>
            <p>The system will log you out in 3 minutes.</p>
            <ButtonBar>
                <Button variant="secondary" onClick={close}>
                    Close
                </Button>
                <Button variant="primary" onClick={keepLoggedIn}>
                    Keep me logged in
                </Button>
            </ButtonBar>
        </Modal>
    );
};

export default connect(mapStateToProps)(LogoutWarningModal);
