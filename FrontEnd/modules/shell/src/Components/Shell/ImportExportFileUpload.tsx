import getFileExtension from "@insite/client-framework/Common/Utilities/getFileExtension";
import FileUpload, { FileUploadProps } from "@insite/mobius/FileUpload/FileUpload";
import React, { useEffect, useState } from "react";

interface Props {
    fileUploadProps: FileUploadProps;
    setFile: (file: File | null) => void;
}

const ImportExportModalFileUpload: React.FC<Props> = ({ fileUploadProps, setFile }) => {
    const [incorrectFileExtension, setIncorrectFileExtension] = React.useState(false);
    useEffect(() => {
        setFile(null);
    }, []);

    const fileChangeHandler = (event: React.ChangeEvent<any>) => {
        const uploadedFile = event.target.files && event.target.files[0];
        setFile(uploadedFile);
        if (uploadedFile) {
            const fileExtension = getFileExtension(uploadedFile.name);
            const incorrectFileExtension = fileExtension !== "zip";
            setIncorrectFileExtension(incorrectFileExtension);
        } else {
            setIncorrectFileExtension(false);
        }
    };

    return (
        <FileUpload
            label="Select Import File"
            accept=".zip"
            onFileChange={fileChangeHandler}
            error={incorrectFileExtension ? "must be .zip" : undefined}
            {...fileUploadProps}
        />
    );
};

export default ImportExportModalFileUpload;
