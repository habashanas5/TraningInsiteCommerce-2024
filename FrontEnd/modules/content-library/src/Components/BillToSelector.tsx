import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { GetBillTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDefaultPageSize, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getBillTosDataView } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTos from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTos";
import { BaseAddressModel, BillToModel } from "@insite/client-framework/Types/ApiModels";
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
    currentBillTo?: BillToModel;
    onSelect: (billTo: BillToModel) => void;
    onEdit?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, billTo: BillToModel) => void;
    extendedStyles?: BillToSelectorStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    defaultPageSize: getDefaultPageSize(state),
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface BillToSelectorStyles {
    customerSelectorToolbar?: CustomerSelectorToolbarStyles;
    centeringWrapper?: InjectableCss;
    loadingSpinner?: LoadingSpinnerProps;
    addressesLoadFailedText?: TypographyPresentationProps;
    noBillTosText?: TypographyPresentationProps;
    customerSelector?: CustomerSelectorStyles;
}

export const billToSelectorStyles: BillToSelectorStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            height: 300px;
            justify-content: center;
            align-items: center;
        `,
    },
    addressesLoadFailedText: { variant: "h4" },
    noBillTosText: { variant: "h4" },
};

const CenteringWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;

const billToSelector = ({ currentBillTo, onSelect, extendedStyles, onEdit, defaultPageSize }: Props) => {
    const [parameter, setParameter] = useState<GetBillTosApiParameter>({ page: 1, pageSize: defaultPageSize });

    return (
        <WrappedBillToSelector
            currentBillTo={currentBillTo}
            onSelect={onSelect}
            extendedStyles={extendedStyles}
            parameter={parameter}
            setParameter={setParameter}
            onEdit={onEdit}
        />
    );
};

const BillToSelector = connect(mapStateToProps)(billToSelector);

interface WrappedBillToSelectorProps {
    currentBillTo?: BillToModel;
    onSelect: (billTo: BillToModel) => void;
    onEdit?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, billTo: BillToModel) => void;
    extendedStyles?: BillToSelectorStyles;
    setParameter: (parameter: GetBillTosApiParameter) => void;
    parameter: GetBillTosApiParameter;
}

const mapStateToPropsWrapped = (state: ApplicationState, props: WrappedBillToSelectorProps) => ({
    billTosDataView: getBillTosDataView(state, props.parameter),
});

const mapDispatchToPropsWrapped = {
    loadBillTos,
};

type WrappedProps = WrappedBillToSelectorProps &
    ResolveThunks<typeof mapDispatchToPropsWrapped> &
    ReturnType<typeof mapStateToPropsWrapped>;

const wrappedBillToSelector = ({
    currentBillTo,
    billTosDataView,
    onSelect,
    extendedStyles,
    setParameter,
    parameter,
    loadBillTos,
    onEdit,
}: WrappedProps) => {
    const [styles] = useState(() => mergeToNew(billToSelectorStyles, extendedStyles));
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (!billTosDataView.value && !billTosDataView.isLoading) {
            loadBillTos(parameter);
        }
    });

    const searchHandler = () => {
        setParameter({
            ...parameter,
            page: 1,
            filter: searchText || undefined,
        });
    };

    const selectCustomerHandler = (customer: BaseAddressModel) => onSelect(customer as BillToModel);

    const editCustomerHandler = onEdit
        ? (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, customer: BaseAddressModel) => {
              onEdit(event, customer as BillToModel);
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
                isSearchDisabled={billTosDataView.isLoading}
                extendedStyles={styles.customerSelectorToolbar}
            />
            {billTosDataView.isLoading || !billTosDataView.value ? (
                <CenteringWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.loadingSpinner} />
                </CenteringWrapper>
            ) : (
                <>
                    {billTosDataView.value.length === 0 ? (
                        <CenteringWrapper {...styles.centeringWrapper}>
                            <Typography {...styles.noBillTosText}>
                                {searchText.length > 0
                                    ? siteMessage("Addresses_NoResultsFound")
                                    : siteMessage("Addresses_NoAddressesFound")}
                            </Typography>
                        </CenteringWrapper>
                    ) : (
                        <CustomerSelector
                            customers={billTosDataView.value}
                            pagination={billTosDataView.pagination!}
                            selectedCustomer={currentBillTo}
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

const WrappedBillToSelector = connect(mapStateToPropsWrapped, mapDispatchToPropsWrapped)(wrappedBillToSelector);

export default BillToSelector;
