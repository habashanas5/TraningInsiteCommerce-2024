import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountShipTosDataView } from "@insite/client-framework/Store/Data/AccountShipTos/AccountShipTosSelectors";
import loadAccountShipToCollection from "@insite/client-framework/Store/Data/AccountShipTos/Handlers/LoadAccountShipToCollection";
import saveShipToCollection from "@insite/client-framework/Store/Pages/UserSetup/Handlers/SaveShipToCollection";
import updateSearchFields from "@insite/client-framework/Store/Pages/UserSetup/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import { AccountShipToModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import cloneDeep from "lodash/cloneDeep";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    isModalOpen: boolean;
    closeModalHandler: () => void;
    extendedStyles?: AssignShipToAddressModalStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    accountShipTosDataView: getAccountShipTosDataView(state, state.pages.userSetup.getAccountShipToCollectionParameter),
    parameter: state.pages.userSetup.getAccountShipToCollectionParameter,
});

const mapDispatchToProps = {
    loadAccountShipToCollection,
    updateSearchFields,
    saveShipToCollection,
};

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

export interface AssignShipToAddressModalStyles {
    modal?: ModalPresentationProps;
    shipToContainer?: GridContainerProps;
    shipToNumberGridItem?: GridItemProps;
    shipToNumberLabel?: TypographyPresentationProps;
    shipToNumberText?: TypographyPresentationProps;
    addressInfoGridItem?: GridItemProps;
    addressInfoDisplay?: AddressInfoDisplayStyles;
    assignShippingAddressGridItem?: GridItemProps;
    assignShippingAddressCheckbox?: CheckboxPresentationProps;
    pagination?: PaginationPresentationProps;
    buttonsWrapper?: InjectableCss;
    cancelButton?: ButtonPresentationProps;
    saveButton?: ButtonPresentationProps;
}

export const assignShipToAddressModalStyles: AssignShipToAddressModalStyles = {
    modal: { sizeVariant: "large" },
    shipToContainer: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    shipToNumberGridItem: {
        width: [4, 2, 2, 2, 2],
        css: css`
            flex-direction: column;
        `,
    },
    shipToNumberLabel: {
        css: css`
            margin-bottom: 5px;
            font-size: 15px;
            font-weight: 600;
        `,
    },
    addressInfoGridItem: { width: [8, 6, 6, 6, 7] },
    assignShippingAddressGridItem: { width: [12, 4, 4, 4, 3] },
    buttonsWrapper: {
        css: css`
            margin-top: 30px;
            text-align: right;
        `,
    },
    cancelButton: {
        variant: "secondary",
    },
    saveButton: {
        css: css`
            margin-left: 10px;
        `,
    },
};

const AssignShipToAddressModal = ({
    isModalOpen,
    accountShipTosDataView,
    parameter,
    closeModalHandler,
    extendedStyles,
    loadAccountShipToCollection,
    updateSearchFields,
    saveShipToCollection,
    toaster,
}: Props) => {
    useEffect(() => {
        if (!accountShipTosDataView.value && !accountShipTosDataView.isLoading) {
            loadAccountShipToCollection(parameter);
        }
    });

    useEffect(() => {
        setShipToCollection(accountShipTosDataView.value);
    }, [accountShipTosDataView.value]);

    const [shipToCollection, setShipToCollection] = React.useState<AccountShipToModel[] | undefined>();

    const [styles] = useState(() => mergeToNew(assignShipToAddressModalStyles, extendedStyles));

    const assignShippingAddressChangeHandler = (value: boolean, index: number) => {
        if (shipToCollection) {
            const currentShipToCollection = cloneDeep(shipToCollection);
            currentShipToCollection[index].assign = value;
            setShipToCollection(currentShipToCollection);
        }
    };

    const handleChangePage = (page: number) => {
        updateSearchFields({ page });
    };

    const handleChangeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = Number(event.target.value);
        updateSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };

    const saveButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!shipToCollection) {
            return;
        }

        saveShipToCollection({
            shipToCollection,
            onSuccess: () => {
                closeModalHandler();
                toaster.addToast({ body: translate("User Created/Updated."), messageType: "success" });
            },
            onError: (errorMessage: string) => {
                toaster.addToast({ body: errorMessage, messageType: "danger" });
            },
            onComplete(resultProps) {
                if (resultProps.apiResult?.successful) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                } else if (resultProps.apiResult?.errorMessage) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onError?.(resultProps.apiResult.errorMessage);
                }
            },
        });
    };

    return (
        <Modal
            {...styles.modal}
            headline={translate("Assign Ship To Address")}
            isOpen={isModalOpen}
            handleClose={closeModalHandler}
            data-test-selector="assignShiptoAddressModal"
        >
            {shipToCollection?.map((shipTo, index) => (
                <GridContainer key={shipTo.shipToNumber} {...styles.shipToContainer}>
                    <GridItem {...styles.shipToNumberGridItem}>
                        <Typography as="p" {...styles.shipToNumberLabel} id="shipToNumber">
                            {translate("Ship To #")}
                        </Typography>
                        <Typography as="p" {...styles.shipToNumberText} aria-labelledby="shipToNumber">
                            {shipTo.shipToNumber}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.addressInfoGridItem}>
                        <AddressInfoDisplay
                            address1={shipTo.address}
                            city={shipTo.city}
                            state={shipTo.state}
                            postalCode=""
                            extendedStyles={styles.addressInfoDisplay}
                        />
                    </GridItem>
                    <GridItem {...styles.assignShippingAddressGridItem}>
                        <Checkbox
                            {...styles.assignShippingAddressCheckbox}
                            checked={shipTo.assign}
                            onChange={(e, value) => assignShippingAddressChangeHandler(value, index)}
                            disabled={shipTo.shipToNumber.length === 0}
                            data-test-selector="assignShipToAddressModal_assign"
                            data-test-key={shipTo.shipToNumber}
                        >
                            {translate("Assign Shipping Address")}
                        </Checkbox>
                    </GridItem>
                </GridContainer>
            ))}
            {accountShipTosDataView.pagination && accountShipTosDataView.pagination.totalItemCount > 1 && (
                <Pagination
                    {...styles.pagination}
                    resultsCount={accountShipTosDataView.pagination.totalItemCount}
                    currentPage={accountShipTosDataView.pagination.page}
                    resultsPerPage={accountShipTosDataView.pagination.pageSize}
                    resultsPerPageOptions={accountShipTosDataView.pagination.pageSizeOptions}
                    onChangePage={handleChangePage}
                    onChangeResultsPerPage={handleChangeResultsPerPage}
                />
            )}
            <StyledWrapper {...styles.buttonsWrapper}>
                <Button {...styles.cancelButton} onClick={closeModalHandler}>
                    {translate("Cancel")}
                </Button>
                <Button
                    {...styles.saveButton}
                    onClick={e => saveButtonClickHandler(e)}
                    data-test-selector="assignShipToAddressModal_saveButton"
                >
                    {translate("Save")}
                </Button>
            </StyledWrapper>
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withToaster(AssignShipToAddressModal));
