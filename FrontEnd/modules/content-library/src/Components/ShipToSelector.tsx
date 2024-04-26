import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDefaultPageSize, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTos";
import { getShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { BaseAddressModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import CustomerSelector, { CustomerSelectorStyles } from "@insite/content-library/Components/CustomerSelector";
import CustomerSelectorToolbar, {
    CustomerSelectorToolbarStyles,
} from "@insite/content-library/Components/CustomerSelectorToolbar";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

interface OwnProps {
    currentShipTo?: ShipToModel;
    currentBillToId?: string;
    allowSelectBillTo?: boolean;
    onSelect: (shipTo: ShipToModel) => void;
    onEdit?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, customer: BaseAddressModel) => void;
    onCreateNewAddressClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    extendedStyles?: ShipToSelectorStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    defaultPageSize: getDefaultPageSize(state),
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface ShipToSelectorStyles {
    customerSelectorToolbar?: CustomerSelectorToolbarStyles;
    centeringWrapper?: InjectableCss;
    loadingSpinner?: LoadingSpinnerProps;
    addressesLoadFailedText?: TypographyPresentationProps;
    noAddressesText?: TypographyPresentationProps;
    customerSelector?: CustomerSelectorStyles;
}

export const shipToSelectorStyles: ShipToSelectorStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            height: 300px;
            justify-content: center;
            align-items: center;
        `,
    },
    addressesLoadFailedText: { variant: "h4" },
    noAddressesText: { variant: "h4" },
};

const CenteringWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;

const shipToSelector = ({
    currentShipTo,
    currentBillToId,
    onCreateNewAddressClick,
    onEdit,
    extendedStyles,
    onSelect,
    allowSelectBillTo,
    defaultPageSize,
}: Props) => {
    const [parameter, setParameter] = useState<GetShipTosApiParameter>({
        page: 1,
        pageSize: defaultPageSize,
        billToId: currentBillToId,
        expand: ["validation"],
        exclude: allowSelectBillTo
            ? ["showAll", "oneTime", "createNew"]
            : ["showAll", "billTo", "oneTime", "createNew"],
    });

    return (
        <WrappedShipToSelector
            currentShipTo={currentShipTo}
            onCreateNewAddressClick={onCreateNewAddressClick}
            onEdit={onEdit}
            extendedStyles={extendedStyles}
            onSelect={onSelect}
            parameter={parameter}
            setParameter={setParameter}
        />
    );
};

const ShipToSelector = connect(mapStateToProps)(shipToSelector);

interface WrappedShipToSelectorProps {
    currentShipTo?: ShipToModel;
    onSelect: (shipTo: ShipToModel) => void;
    onEdit?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, customer: BaseAddressModel) => void;
    onCreateNewAddressClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    extendedStyles?: ShipToSelectorStyles;
    setParameter: (parameter: GetShipTosApiParameter) => void;
    parameter: GetShipTosApiParameter;
}

const mapStateToPropsWrapped = (state: ApplicationState, props: WrappedShipToSelectorProps) => ({
    shipTosDataView: getShipTosDataView(state, props.parameter),
    customerSettings: getSettingsCollection(state).customerSettings,
});

const mapDispatchToPropsWrapped = {
    loadShipTos,
};

type WrappedProps = WrappedShipToSelectorProps &
    ResolveThunks<typeof mapDispatchToPropsWrapped> &
    ReturnType<typeof mapStateToPropsWrapped>;

const wrappedShipToSelector = ({
    currentShipTo,
    shipTosDataView,
    customerSettings,
    loadShipTos,
    onCreateNewAddressClick,
    onEdit,
    extendedStyles,
    onSelect,
    parameter,
    setParameter,
}: WrappedProps) => {
    const [styles] = useState(() => mergeToNew(shipToSelectorStyles, extendedStyles));
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (!shipTosDataView.value && !shipTosDataView.isLoading) {
            loadShipTos(parameter);
        }
    });

    const searchHandler = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setParameter({
            ...parameter,
            page: 1,
            filter: searchText || undefined,
        });
    };

    const selectCustomerHandler = (customer: BaseAddressModel) => onSelect(customer as ShipToModel);

    const editCustomerHandler = onEdit
        ? (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, customer: BaseAddressModel) => {
              onEdit(event, customer as ShipToModel);
          }
        : undefined;

    const changePageHandler = (page: number) => {
        setParameter({
            ...parameter,
            page,
        });
    };

    const changeResultsPerPageHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setParameter({
            ...parameter,
            page: 1,
            pageSize: Number(event.currentTarget.value),
        });
    };

    return (
        <>
            <CustomerSelectorToolbar
                searchText={searchText}
                onSearchTextChanged={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchText(event.currentTarget.value)
                }
                onSearch={searchHandler}
                allowCreateAddress={customerSettings !== undefined && customerSettings.allowCreateNewShipToAddress}
                onCreateNewAddressClick={onCreateNewAddressClick}
                isSearchDisabled={shipTosDataView.isLoading}
                extendedStyles={styles.customerSelectorToolbar}
            />
            {shipTosDataView.isLoading || !shipTosDataView.value ? (
                <CenteringWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.loadingSpinner} />
                </CenteringWrapper>
            ) : (
                <>
                    {shipTosDataView.value.length === 0 ? (
                        <CenteringWrapper {...styles.centeringWrapper}>
                            <Typography {...styles.noAddressesText}>
                                {searchText.length > 0
                                    ? siteMessage("Addresses_NoResultsFound")
                                    : siteMessage("Addresses_NoAddressesFound")}
                            </Typography>
                        </CenteringWrapper>
                    ) : (
                        <CustomerSelector
                            customers={shipTosDataView.value}
                            pagination={shipTosDataView.pagination!}
                            selectedCustomer={currentShipTo}
                            onSelect={selectCustomerHandler}
                            onEdit={editCustomerHandler}
                            onChangePage={changePageHandler}
                            onChangeResultsPerPage={changeResultsPerPageHandler}
                            extendedStyles={styles.customerSelector}
                        />
                    )}
                </>
            )}
        </>
    );
};

const WrappedShipToSelector = connect(mapStateToPropsWrapped, mapDispatchToPropsWrapped)(wrappedShipToSelector);

export default ShipToSelector;
