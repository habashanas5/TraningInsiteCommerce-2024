import { createPageElement } from "@insite/client-framework/Components/ContentItemStore";
import { ShellContext } from "@insite/client-framework/Components/IsInShell";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import closeErrorModal from "@insite/client-framework/Store/Context/Handlers/CloseErrorModal";
import { loadPageByType } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getPageStateByType } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import translate from "@insite/client-framework/Translate";
import Modal from "@insite/mobius/Modal";
import * as React from "react";
import { FC, useContext, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    modalIsOpen: !!state.context.isErrorModalOpen,
    isUnauthorizedError: !!state.context.isUnauthorizedError,
    errorPage: getPageStateByType(state, "UnhandledErrorModal"),
});

const mapDispatchToProps = {
    loadPageByType,
    closeErrorModal,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const ErrorModal: FC<Props> = ({ modalIsOpen, isUnauthorizedError, closeErrorModal, errorPage, loadPageByType }) => {
    const { isInShell } = useContext(ShellContext);
    useEffect(() => {
        if (!errorPage.value && !errorPage.isLoading) {
            loadPageByType("UnhandledErrorModal");
        }
    }, [errorPage.isLoading, errorPage.value, loadPageByType]);

    const modalCloseHandler = () => {
        closeErrorModal();
    };

    if (!errorPage.value || isInShell) {
        return null;
    }

    const headline = isUnauthorizedError ? translate("Authorization Required") : errorPage.value.fields["modalTitle"];
    return (
        <Modal headline={headline} isOpen={modalIsOpen} handleClose={modalCloseHandler}>
            {isUnauthorizedError ? (
                <>{translate("Please sign in with a website user to view this page.")}</>
            ) : (
                <div data-test-selector="unhandledErrorModal">
                    <ShellContext.Provider value={{ isInShell, pageId: errorPage.id }}>
                        {createPageElement(errorPage.value.type, errorPage.value)}
                    </ShellContext.Provider>
                </div>
            )}
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);
