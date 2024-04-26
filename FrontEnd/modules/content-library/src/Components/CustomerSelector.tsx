import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { BaseAddressModel, PaginationModel } from "@insite/client-framework/Types/ApiModels";
import CustomerCard, { CustomerCardStyles } from "@insite/content-library/Components/CustomerCard";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { useState } from "react";

interface OwnProps {
    customers: BaseAddressModel[];
    pagination: PaginationModel | null;
    selectedCustomer?: BaseAddressModel;
    onSelect: (customer: BaseAddressModel) => void;
    /** @deprecated Not used anymore */
    allowEditCustomer?: boolean;
    onEdit?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, customer: BaseAddressModel) => void;
    onChangePage: (page: number) => void;
    onChangeResultsPerPage: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    extendedStyles?: CustomerSelectorStyles;
}

export interface CustomerSelectorStyles {
    customerCard?: CustomerCardStyles;
    customerCardSelected?: CustomerCardStyles;
    pagination?: PaginationPresentationProps;
}

const linkTextStyles: TypographyPresentationProps = {
    color: "text.link",
};

export const customerSelectorStyles: CustomerSelectorStyles = {
    customerCardSelected: {
        address: {
            attentionText: linkTextStyles,
            customerNameText: linkTextStyles,
            companyNameText: linkTextStyles,
            address1Text: linkTextStyles,
            address2Text: linkTextStyles,
            address3Text: linkTextStyles,
            address4Text: linkTextStyles,
            cityStatePostalCodeText: linkTextStyles,
            countryText: linkTextStyles,
            phoneText: linkTextStyles,
            emailText: linkTextStyles,
            faxText: linkTextStyles,
        },
    },
};

const CustomerSelector = ({
    customers,
    pagination,
    extendedStyles,
    selectedCustomer,
    onChangePage,
    onChangeResultsPerPage,
    onSelect,
    onEdit,
}: OwnProps) => {
    const [styles] = useState(() => mergeToNew(customerSelectorStyles, extendedStyles));

    return (
        <>
            {customers.map(customer => {
                const isCardSelected = customer.id === selectedCustomer?.id;
                return (
                    <CustomerCard
                        key={customer.id}
                        customer={customer}
                        isSelected={isCardSelected}
                        extendedStyles={isCardSelected ? styles.customerCardSelected : styles.customerCard}
                        onSelect={onSelect}
                        onEdit={onEdit}
                    />
                );
            })}
            {customers.length > 0 && pagination && (
                <Pagination
                    {...styles.pagination}
                    currentPage={pagination.currentPage}
                    resultsPerPage={pagination.pageSize}
                    resultsCount={pagination.totalItemCount}
                    resultsPerPageOptions={pagination.pageSizeOptions}
                    onChangePage={onChangePage}
                    onChangeResultsPerPage={onChangeResultsPerPage}
                />
            )}
        </>
    );
};

export default CustomerSelector;
