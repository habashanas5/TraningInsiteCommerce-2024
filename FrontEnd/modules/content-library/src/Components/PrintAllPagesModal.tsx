/* eslint-disable spire/export-styles */
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import { HasPagingParameters } from "@insite/client-framework/Services/ApiService";
import translate from "@insite/client-framework/Translate";
import { PaginationModel } from "@insite/client-framework/Types/ApiModels";
import { TwoButtonModalStyles, twoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import Button from "@insite/mobius/Button";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem from "@insite/mobius/GridItem";
import Modal from "@insite/mobius/Modal";
import Typography from "@insite/mobius/Typography";
import React from "react";

// copied into here because we got rid of the handler that used this. We will eventually bring this back.
interface LoadOrderLinesParameter extends HasPagingParameters {
    orderId: string;
}

type Props = {
    updateParameterFunction?: (pageSize: number) => void;
    awaitableLoader(parameter?: any): Promise<any>;
    generateParameter?: (pageSize: number) => LoadOrderLinesParameter;
    lineCollection: { pagination: Pick<PaginationModel, "totalItemCount"> | null };
    reloading: boolean;
    isOpen: boolean;
    initialPageSize: number;
    handleClose(): void;
    styles?: TwoButtonModalStyles;
};

const PrintAllPagesModal: React.FC<Props> = ({
    updateParameterFunction,
    awaitableLoader,
    initialPageSize,
    lineCollection,
    generateParameter,
    reloading,
    isOpen,
    handleClose,
    styles,
}) => {
    const onAfterPrint = (queryEvent: MediaQueryListEvent) => {
        if (!queryEvent.matches) {
            runQuery(initialPageSize);
        }
    };

    React.useEffect(() => {
        const mediaQueryList = window.matchMedia("print");
        mediaQueryList.addListener(onAfterPrint);

        return () => {
            mediaQueryList.removeListener(onAfterPrint);
        };
    }, []);

    const totalItemCount = lineCollection?.pagination?.totalItemCount || 999;
    const mergeStyles = mergeToNew(twoButtonModalStyles, styles);
    const printFirstPage = () => {
        if (isOpen) {
            handleClose();
            setTimeout(openPrintDialog, 300);
        }
    };

    const runQuery = async (itemCount: number) => {
        if (typeof updateParameterFunction === "function") {
            updateParameterFunction(itemCount);
            await awaitableLoader();
            return;
        }
        if (typeof generateParameter === "function") {
            await awaitableLoader(generateParameter(itemCount));
        }
    };

    const printAllPages = async () => {
        await runQuery(totalItemCount);
        printFirstPage();
    };

    const cancelPrintAllPages = () => {
        handleClose();
        runQuery(initialPageSize);
    };

    return (
        <Modal headline={translate("Print Options")} {...styles} handleClose={handleClose} isOpen={isOpen}>
            <GridContainer {...mergeStyles?.container}>
                <GridItem {...mergeStyles?.textGridItem}>
                    <Typography {...mergeStyles?.messageText}>
                        {translate(
                            "Would you like to print only the current page of results, or all {0} items?",
                        ).replace("{0}", `${totalItemCount === 999 ? "" : totalItemCount}`)}
                    </Typography>
                </GridItem>
                <GridItem {...mergeStyles?.buttonsGridItem}>
                    {!reloading ? (
                        <Button {...mergeStyles?.cancelButton} onClick={printFirstPage}>
                            {translate("Print this page")}
                        </Button>
                    ) : (
                        <Button onClick={cancelPrintAllPages} {...mergeStyles?.cancelButton}>
                            {translate("Cancel Printing")}
                        </Button>
                    )}
                    <Button {...mergeStyles?.submitButton} disabled={reloading} onClick={printAllPages}>
                        {reloading ? translate("Loading all pages...") : translate("Print all pages")}
                    </Button>
                </GridItem>
            </GridContainer>
        </Modal>
    );
};

export default PrintAllPagesModal;
