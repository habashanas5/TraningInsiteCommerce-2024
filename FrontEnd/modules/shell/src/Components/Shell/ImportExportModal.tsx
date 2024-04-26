import Button from "@insite/mobius/Button";
import Checkbox from "@insite/mobius/Checkbox";
import { FileUploadProps } from "@insite/mobius/FileUpload";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Modal from "@insite/mobius/Modal";
import Radio from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup";
import getColor from "@insite/mobius/utilities/getColor";
import ImportExportModalFileUpload from "@insite/shell/Components/Shell/ImportExportFileUpload";
import {
    closeImportExportModal,
    confirmImport,
    exportContent,
    importContent,
    setOnlyExportPublishedContent,
    setTask,
} from "@insite/shell/Store/ImportExportModal/ImportExportModalActionCreators";
import { ImportExportModalState } from "@insite/shell/Store/ImportExportModal/ImportExportModalState";
import ShellState from "@insite/shell/Store/ShellState";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const mapStateToProps = (state: ShellState) => ({
    visible: !!state.importExportModal.showModal,
    task: state.importExportModal.task,
    onlyExportPublishedContent: state.importExportModal.onlyExportPublishedContent,
    taskInProgress: state.importExportModal.taskInProgress,
    confirmingImport: state.importExportModal.confirmingImport,
    errorMessage: state.importExportModal.errorMessage,
    cmsType: state.shellContext.cmsType,
});

const mapDispatchToProps = {
    closeImportExportModal,
    setTask,
    setOnlyExportPublishedContent,
    exportContent,
    importContent,
    confirmImport,
};

interface ImportExportModalStyles {
    radioGroup: RadioGroupProps;
    fileUpload: FileUploadProps;
    loadingSpinner: LoadingSpinnerProps;
}

const styles: ImportExportModalStyles = {
    radioGroup: {
        css: css`
            margin-top: 10px;
            display: inline-block;
            width: 100%;
            flex-direction: row;
            & > div {
                display: inline-flex;
                margin-right: 16px;
            }
        `,
        labelProps: {
            css: css`
                margin-bottom: 0 !important;
                text-transform: uppercase;
            `,
        },
    },
    fileUpload: {
        buttonProps: {
            css: css`
                margin: 41px 0 0 15px;
            `,
        },
        labelProps: {
            size: 15,
        },
    },
    loadingSpinner: {
        css: css`
            margin: 40px auto;
            display: block;
        `,
        color: "primary",
        size: 50,
    },
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const ImportExportModal: React.FC<Props> = ({
    visible,
    closeImportExportModal,
    task,
    setTask,
    setOnlyExportPublishedContent,
    onlyExportPublishedContent,
    taskInProgress,
    exportContent,
    confirmImport,
    confirmingImport,
    importContent,
    errorMessage,
    cmsType,
}) => {
    const [file, setFile] = useState<File | null>(null);

    const onChangeTask = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as ImportExportModalState["task"];
        setTask(value);
    };

    const onChangeOnlyExportPublishedContent = (event: React.SyntheticEvent, value: boolean) => {
        setOnlyExportPublishedContent(value);
    };

    const importOrExportClicked = () => {
        if (task === "Export") {
            exportContent();
        } else if (file !== null) {
            if (confirmingImport) {
                importContent(file);
            } else {
                confirmImport();
            }
        }
    };

    const buttons = (text: string, isDisabled = false) => {
        return (
            <ButtonsStyle>
                <Button variant="tertiary" onClick={closeImportExportModal}>
                    Cancel
                </Button>
                <Button onClick={importOrExportClicked} disabled={isDisabled}>
                    {text}
                </Button>
            </ButtonsStyle>
        );
    };

    const modalContent = () => {
        if (cmsType !== "Spire") {
            return (
                <WarningStyle>
                    The CMS type for the current website is set to {cmsType}. <br />
                    Import/Export may only be used if the CMS type is set to Spire.
                </WarningStyle>
            );
        }

        if (confirmingImport) {
            return (
                <>
                    <WarningStyle>
                        WARNING: This process is destructive and will replace all content for the current site with the
                        file selected. Are you absolutely sure you want to proceed?
                    </WarningStyle>
                    {buttons("Continue")}
                </>
            );
        }

        if (errorMessage) {
            return (
                <>
                    <p>{task} failed.</p>
                    <ErrorStyle>{errorMessage}</ErrorStyle>
                </>
            );
        }

        if (taskInProgress) {
            return (
                <>
                    <p>{task} in progress. This may take several minutes.</p>
                    <LoadingSpinner {...styles.loadingSpinner} />
                </>
            );
        }

        return (
            <>
                Use this as an easy way to move CMS content between websites and environments.
                <RadioGroup label="Select a task" value={task} onChangeHandler={onChangeTask} {...styles.radioGroup}>
                    <Radio value="Import">Import</Radio>
                    <Radio value="Export">Export</Radio>
                </RadioGroup>
                <ContentWrapper>
                    {task === "Import" && (
                        <ImportExportModalFileUpload fileUploadProps={styles.fileUpload} setFile={setFile} />
                    )}
                    {task === "Export" && (
                        <>
                            <Legend>Export Options</Legend>
                            <Checkbox
                                checked={onlyExportPublishedContent}
                                onChange={onChangeOnlyExportPublishedContent}
                            >
                                Only Published Content
                            </Checkbox>
                            <ExportText>
                                Website content will be packaged into a single file for downloading.
                            </ExportText>
                        </>
                    )}
                </ContentWrapper>
                {buttons(task, task === "Import" && file === null)}
            </>
        );
    };

    return (
        <Modal isOpen={visible} handleClose={closeImportExportModal} headline="Import / Export Content" size={600}>
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

const Legend = styled.legend`
    font-weight: bold;
    text-transform: uppercase;
    padding-left: 0;
    margin-bottom: 4px;
`;

const ContentWrapper = styled.div`
    margin-top: 20px;
    height: 120px;
`;

const ButtonsStyle = styled.div`
    display: flex;
    justify-content: flex-end;
    & > button {
        margin-left: 10px;
    }
`;

const ExportText = styled.div`
    margin-top: 15px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(ImportExportModal);
