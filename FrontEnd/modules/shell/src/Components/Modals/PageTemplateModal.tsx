import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import Button from "@insite/mobius/Button";
import Modal from "@insite/mobius/Modal";
import ButtonBar from "@insite/shell/Components/Modals/ButtonBar";
import { closePageTemplateModal } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {}

interface PageEditorState {
    id: string;
}

const mapStateToProps = (state: ShellState) => ({
    pageType: getCurrentPage(state).type,
    isOpen: state.pageEditor.displayPageTemplateModal,
    generatedPageTemplate: state.pageEditor.generatedPageTemplate,
});

const mapDispatchToProps = {
    closePageTemplateModal,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class PageTemplateModal extends React.Component<Props, PageEditorState> {
    private textarea: HTMLTextAreaElement | null = null;

    copyGeneratedPage = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (this.textarea === null) {
            return;
        }

        this.textarea.select();
        document.execCommand("copy");
        event.currentTarget.focus();
    };

    render() {
        if (!this.props.isOpen) {
            return null;
        }

        const pathToSave =
            BLUEPRINT_NAME === "content-library"
                ? `wwwroot/AppData/PageTemplates/BuiltIn/${this.props.pageType}/Standard.json`
                : `modules/blueprints/${BLUEPRINT_NAME}/wwwroot/AppData/PageTemplates/${this.props.pageType}/Standard.json`;

        return (
            <Modal
                isOpen={this.props.isOpen}
                headline="Code for Page Template"
                handleClose={this.props.closePageTemplateModal}
                closeOnEsc
                closeOnScrimClick
            >
                <p>Save this to {pathToSave}</p>
                <TextAreaStyle
                    readOnly={true}
                    ref={textarea => {
                        this.textarea = textarea;
                    }}
                    value={this.props.generatedPageTemplate}
                />
                <ButtonBar>
                    <Button variant="secondary" onClick={this.props.closePageTemplateModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.copyGeneratedPage}>
                        Copy
                    </Button>
                </ButtonBar>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageTemplateModal);

const TextAreaStyle = styled.textarea`
    width: 100%;
    height: 500px;
`;
