import Button from "@insite/mobius/Button";
import Modal from "@insite/mobius/Modal";
import getColor from "@insite/mobius/utilities/getColor";
import {
    closeRestoreContentModal,
    restoreContent,
} from "@insite/shell/Store/ImportExportModal/ImportExportModalActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

const mapStateToProps = (state: ShellState) => ({
    visible: !!state.importExportModal.showRestoreModal,
    errorMessage: state.importExportModal.errorMessage,
    taskInProgress: state.importExportModal.taskInProgress,
});

const mapDispatchToProps = {
    closeRestoreContentModal,
    restoreContent,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RestoreContentModal: React.FC<Props> = ({
    visible,
    errorMessage,
    taskInProgress,
    closeRestoreContentModal,
    restoreContent,
}) => {
    const modalContent = () => {
        if (errorMessage) {
            return (
                <>
                    <ErrorStyle>{errorMessage}</ErrorStyle>
                </>
            );
        }

        return (
            <>
                <WarningStyle>
                    WARNING: This action is irreversible and will replace all content for the site with the content in
                    the backup table. Are you sure you wish to continue?
                </WarningStyle>
                <ButtonsStyle>
                    <Button variant="tertiary" onClick={closeRestoreContentModal}>
                        Cancel
                    </Button>
                    <Button disabled={taskInProgress} onClick={restoreContent}>
                        Continue
                    </Button>
                </ButtonsStyle>
            </>
        );
    };

    return (
        <Modal isOpen={visible} handleClose={closeRestoreContentModal} headline="Restore Content" size={600}>
            {modalContent()}
        </Modal>
    );
};

const ErrorStyle = styled.p`
    color: ${getColor("danger.main")};
    margin: 20px 0;
`;

const WarningStyle = styled.p`
    color: ${getColor("danger.main")};
    margin-bottom: 20px;
`;

const ButtonsStyle = styled.div`
    display: flex;
    justify-content: flex-end;
    & > button {
        margin-left: 10px;
    }
`;

export default connect(mapStateToProps, mapDispatchToProps)(RestoreContentModal);
