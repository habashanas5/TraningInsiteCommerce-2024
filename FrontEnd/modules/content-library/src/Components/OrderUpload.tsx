import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import getFileExtension from "@insite/client-framework/Common/Utilities/getFileExtension";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import batchLoadProducts from "@insite/client-framework/Store/Components/OrderUpload/Handlers/BatchLoadProducts";
import cleanupUploadData from "@insite/client-framework/Store/Components/OrderUpload/Handlers/CleanupUploadData";
import processFile from "@insite/client-framework/Store/Components/OrderUpload/Handlers/ProcessFile";
import setAllowCancel from "@insite/client-framework/Store/Components/OrderUpload/Handlers/SetAllowCancel";
import setErrorsModalIsOpen from "@insite/client-framework/Store/Components/OrderUpload/Handlers/SetErrorsModalIsOpen";
import setIsBadFile from "@insite/client-framework/Store/Components/OrderUpload/Handlers/SetIsBadFile";
import setIsUploading from "@insite/client-framework/Store/Components/OrderUpload/Handlers/SetIsUploading";
import setUploadCancelled from "@insite/client-framework/Store/Components/OrderUpload/Handlers/SetUploadCancelled";
import setUploadLimitExceeded from "@insite/client-framework/Store/Components/OrderUpload/Handlers/SetUploadLimitExceeded";
import translate from "@insite/client-framework/Translate";
import { ProductDto } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox";
import FileUpload, { FileUploadPresentationProps } from "@insite/mobius/FileUpload";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useContext, useRef, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

export interface OwnProps {
    descriptionText: React.ReactNode;
    checkInventory: boolean;
    templateUrl: string;
    onUploadProducts: (products: ProductDto[]) => void;
    extendedStyles?: OrderUploadStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    uploadedItems: state.components.orderUpload.uploadedItems,
    isUploading: state.components.orderUpload.isUploading,
    products: state.components.orderUpload.products,
    rowErrors: state.components.orderUpload.rowErrors,
    isBadFile: state.components.orderUpload.isBadFile,
    productsProcessed: state.components.orderUpload.productsProcessed,
    allowCancel: state.components.orderUpload.allowCancel,
    uploadCancelled: state.components.orderUpload.uploadCancelled,
    uploadLimitExceeded: state.components.orderUpload.uploadLimitExceeded,
    continueUpload: state.components.orderUpload.continueUpload,
});

const mapDispatchToProps = {
    processFile,
    batchLoadProducts,
    cleanupUploadData,
    setAllowCancel,
    setIsBadFile,
    setIsUploading,
    setUploadCancelled,
    setUploadLimitExceeded,
    setErrorsModalIsOpen,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderUploadStyles {
    mainWrapper?: InjectableCss;
    orderCancellationSuccessfulText?: TypographyPresentationProps;
    uploadLinkTooltipText?: TypographyPresentationProps;
    downloadTemplateButton?: ButtonPresentationProps;
    fileUploader?: FileUploadPresentationProps;
    includeFirstRowCheckbox?: CheckboxProps;
    cancelUploadButton?: ButtonPresentationProps;
    uploadFileButton?: ButtonPresentationProps;
    spinner?: LoadingSpinnerProps;
    uploadingButtonLabel?: TypographyPresentationProps;
    uploadFileButtonLabel?: TypographyPresentationProps;
}

export const orderUploadStyles: OrderUploadStyles = {
    mainWrapper: {
        css: css`
            width: 100%;
        `,
    },
    orderCancellationSuccessfulText: {
        color: "warning",
        css: css`
            line-height: 25px;
        `,
    },
    uploadLinkTooltipText: {
        css: css`
            margin-bottom: 15px;
        `,
    },
    downloadTemplateButton: {
        css: css`
            margin-bottom: 15px;
        `,
        variant: "tertiary",
    },
    includeFirstRowCheckbox: {
        css: css`
            margin: 15px 0;
            display: block;
        `,
    },
    fileUploader: {
        buttonProps: {
            variant: "tertiary",
        },
    },
    cancelUploadButton: {
        variant: "secondary",
        css: css`
            float: right;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            width: 100%;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    uploadFileButton: {
        css: css`
            float: right;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            margin-bottom: 10px;
                            width: 100%;
                        `,
                        css`
                            margin-left: 15px;
                            width: initial;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    spinner: {
        size: 22,
        css: css`
            margin-right: 8px;
        `,
    },
    uploadingButtonLabel: {
        css: css`
            font-size: 15px;
            font-weight: bold;
            vertical-align: super;
        `,
    },
    uploadFileButtonLabel: {
        css: css`
            font-size: 15px;
            font-weight: bold;
        `,
    },
};

const styles = orderUploadStyles;

const OrderUpload: FC<Props> = ({
    descriptionText,
    checkInventory,
    templateUrl,
    uploadedItems,
    isUploading,
    products,
    rowErrors,
    isBadFile,
    productsProcessed,
    allowCancel,
    uploadCancelled,
    uploadLimitExceeded,
    continueUpload,
    processFile,
    onUploadProducts,
    batchLoadProducts,
    cleanupUploadData,
    setAllowCancel,
    setIsBadFile,
    setIsUploading,
    setUploadCancelled,
    setErrorsModalIsOpen,
}) => {
    const toasterContext = useContext(ToasterContext);
    const fileUploadRef = useRef({ value: "" } as HTMLInputElement);

    const [file, setFile] = useState<any>(null);
    const [incorrectFileExtension, setIncorrectFileExtension] = React.useState(false);
    const [firstRowHeading, setFirstRowHeading] = React.useState(true);
    const firstRowHeadingChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setFirstRowHeading(value);
    };

    React.useEffect(() => batchGetProducts(), [uploadedItems]);

    React.useEffect(() => checkCompletion(), [productsProcessed]);

    React.useEffect(() => {
        if (isBadFile || uploadLimitExceeded) {
            setErrorsModalIsOpen({ errorsModalIsOpen: true });
        }
    }, [isBadFile, uploadLimitExceeded]);

    const downloadTemplateHandler = () => {
        window.open(`${window.location.origin}${templateUrl}`);
    };

    const cancelUploadingHandler = () => {
        setUploadCancelled({ uploadCancelled: true });
        setIsUploading({ isUploading: false });
        cleanupUploadData();
        setFile(null);
        if (fileUploadRef.current?.value) {
            fileUploadRef.current.value = "";
        }
        setFirstRowHeading(false);
    };

    const uploadFileHandler = () => {
        if (isUploading) {
            return;
        }

        setUploadCancelled({ uploadCancelled: false });
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = onReaderLoad(getFileExtension(file.name));
        reader.readAsArrayBuffer(file);
    };

    const onReaderLoad = (fileExtension: string) => {
        return (e: Event) => {
            const data = (e.target as any).result;
            processFile({ data, fileExtension, firstRowHeading });
        };
    };

    const batchGetProducts = () => {
        cleanupUploadData();
        if (!file) {
            return;
        }

        if (uploadedItems.length === 0) {
            setIsBadFile({ isBadFile: true });
            return;
        }

        const extendedNames = uploadedItems.map(item => item.name);
        batchLoadProducts({ extendedNames, firstRowHeading, checkInventory });
    };

    const checkCompletion = React.useCallback(() => {
        if (!productsProcessed || uploadCancelled) {
            return;
        }

        if (uploadedItems.length === products.length && rowErrors.length === 0) {
            uploadProducts();
        } else {
            setIsUploading({ isUploading: false });
            setErrorsModalIsOpen({ errorsModalIsOpen: true });
        }
    }, [productsProcessed, uploadCancelled, uploadedItems, products, rowErrors]);

    const uploadProducts = () => {
        setAllowCancel({ allowCancel: false });
        onUploadProducts(products);
        onUploadingSuccess();
    };

    const onUploadingSuccess = React.useCallback(() => {
        setIsUploading({ isUploading: false });
        cleanupUploadData();
        toasterContext.addToast({ body: `${products.length} ${translate("items uploaded")}`, messageType: "success" });
    }, [products]);

    React.useEffect(() => {
        if (continueUpload) {
            uploadProducts();
        }
    }, [continueUpload]);

    const fileChangeHandler = (event: React.ChangeEvent<any>) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
        if (uploadedFile) {
            const fileExtension = getFileExtension(uploadedFile.name);
            const incorrectFileExtension = ["xls", "xlsx", "csv"].indexOf(fileExtension) === -1;
            setIncorrectFileExtension(incorrectFileExtension);
            setIsBadFile({ isBadFile: incorrectFileExtension });
            setUploadLimitExceeded({ uploadLimitExceeded: false });
        }
    };

    return (
        <StyledWrapper {...styles.mainWrapper}>
            {uploadCancelled && (
                <Typography as="p" {...styles.orderCancellationSuccessfulText}>
                    {siteMessage("OrderUpload_CancellationSuccessful")}
                </Typography>
            )}
            <Typography as="p" {...styles.uploadLinkTooltipText}>
                {descriptionText}
            </Typography>
            <Button {...styles.downloadTemplateButton} onClick={downloadTemplateHandler}>
                {translate("Download Template")}
            </Button>
            <FileUpload
                {...styles.fileUploader}
                inputRef={fileUploadRef}
                fileName={file?.name || ""}
                accept=".xls,.xlsx,.csv"
                label={translate("Upload a File")}
                labelPosition="top"
                error={incorrectFileExtension ? translate("must be .xls, .xlsx or .csv") : undefined}
                onFileChange={fileChangeHandler}
                uid="orderUploadFileUpload"
            />
            <Checkbox
                {...styles.includeFirstRowCheckbox}
                onChange={firstRowHeadingChangeHandler}
                checked={firstRowHeading}
                uid="includeHeading"
            >
                {translate("Include First Row Column Heading")}
            </Checkbox>
            <Button {...styles.uploadFileButton} disabled={!file || isUploading} onClick={uploadFileHandler}>
                {isUploading && (
                    <>
                        <LoadingSpinner {...styles.spinner} />
                        <Typography {...styles.uploadingButtonLabel}>{translate("Uploading")}</Typography>
                    </>
                )}
                {!isUploading && <Typography {...styles.uploadFileButtonLabel}>{translate("Upload File")}</Typography>}
            </Button>
            <Button
                {...styles.cancelUploadButton}
                onClick={cancelUploadingHandler}
                disabled={!isUploading || !allowCancel || uploadCancelled}
            >
                {translate("Cancel Upload")}
            </Button>
        </StyledWrapper>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderUpload);
